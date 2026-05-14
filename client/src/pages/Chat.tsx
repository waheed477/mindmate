import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useSocket } from "@/hooks/use-socket";
import { Navbar } from "@/components/layout-navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send, Loader2, MessageSquare } from "lucide-react";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

interface ChatMessage {
  _id: string;
  senderId: string;
  receiverId: string;
  senderName?: string;
  content: string;
  createdAt: string;
  read: boolean;
}

interface ReceiverInfo {
  _id: string;
  fullName?: string;
  email?: string;
  role?: string;
}

const getToken = () => localStorage.getItem("token") ?? "";

const formatMessageTime = (dateStr: string) => {
  try {
    const d = new Date(dateStr);
    if (isToday(d)) return format(d, "p");
    if (isYesterday(d)) return `Yesterday ${format(d, "p")}`;
    return format(d, "MMM d, p");
  } catch {
    return "";
  }
};

const getInitials = (name?: string) =>
  (name || "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

export default function ChatPage() {
  const { receiverId } = useParams<{ receiverId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const token = getToken();

  const { joinRoom, sendMessage, emitTyping, emitStopTyping, markRead, on, off } =
    useSocket(token);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [receiver, setReceiver] = useState<ReceiverInfo | null>(null);
  const [input, setInput] = useState("");
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Fetch message history via REST
  useEffect(() => {
    if (!receiverId || !token) return;

    const fetchHistory = async () => {
      try {
        const res = await fetch(`/api/messages/${receiverId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch history");
        const data = await res.json();
        setMessages(data.messages ?? []);
        setReceiver(data.receiver ?? null);
      } catch (err) {
        console.error("History fetch error:", err);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    fetchHistory();
  }, [receiverId, token]);

  // Socket setup
  useEffect(() => {
    if (!receiverId) return;

    // Join chat room
    joinRoom(receiverId);
    if (receiverId) markRead(receiverId);

    // Connection status
    const offConnect = on("connect", () => setIsConnected(true));
    const offDisconnect = on("disconnect", () => setIsConnected(false));

    // Incoming messages
    const handleReceive = (msg: ChatMessage) => {
      setMessages((prev) => {
        // Deduplicate by _id
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
      markRead(receiverId);
    };
    const offReceive = on("receive_message", handleReceive);

    // Typing indicator
    const handleTyping = ({ senderId }: { senderId: string }) => {
      if (senderId === receiverId) setIsTyping(true);
    };
    const handleStopTyping = ({ senderId }: { senderId: string }) => {
      if (senderId === receiverId) setIsTyping(false);
    };
    const offTyping = on("user_typing", handleTyping);
    const offStopTyping = on("user_stop_typing", handleStopTyping);

    return () => {
      offConnect();
      offDisconnect();
      offReceive();
      offTyping();
      offStopTyping();
    };
  }, [receiverId, joinRoom, markRead, on]);

  // Scroll to bottom on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);

    if (!receiverId) return;
    emitTyping(receiverId);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      emitStopTyping(receiverId!);
    }, 1500);
  };

  const handleSend = () => {
    if (!input.trim() || !receiverId || isSending) return;

    const content = input.trim();
    setInput("");
    setIsSending(true);

    // Optimistic update
    const tempId = `temp_${Date.now()}`;
    const optimistic: ChatMessage = {
      _id: tempId,
      senderId: user?.id ?? "",
      receiverId,
      content,
      createdAt: new Date().toISOString(),
      read: false,
    };
    setMessages((prev) => [...prev, optimistic]);

    sendMessage(receiverId, content);

    // Clean up sending state
    setTimeout(() => setIsSending(false), 500);

    // Stop typing
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    emitStopTyping(receiverId);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const myId = user?.id ?? "";

  // Group messages by date
  const groupedMessages = messages.reduce(
    (groups: Record<string, ChatMessage[]>, msg) => {
      const date = format(new Date(msg.createdAt), "yyyy-MM-dd");
      if (!groups[date]) groups[date] = [];
      groups[date].push(msg);
      return groups;
    },
    {}
  );

  const receiverName = receiver?.fullName || receiver?.email || "User";
  const receiverRole = receiver?.role
    ? receiver.role.charAt(0).toUpperCase() + receiver.role.slice(1)
    : "";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="container flex-1 flex flex-col py-4 max-w-3xl">
        {/* Chat Header */}
        <div className="flex items-center gap-3 pb-4 border-b">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <Avatar className="h-10 w-10 shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {getInitials(receiverName)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-base truncate">
                {receiverRole === "Doctor" ? `Dr. ${receiverName}` : receiverName}
              </h2>
              {receiverRole && (
                <Badge variant="outline" className="text-xs shrink-0">
                  {receiverRole}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {isTyping ? (
                <span className="text-primary animate-pulse">Typing...</span>
              ) : (
                "MindMate Chat"
              )}
            </p>
          </div>

          <div
            className={cn(
              "h-2 w-2 rounded-full shrink-0",
              isConnected ? "bg-green-500" : "bg-gray-300"
            )}
            title={isConnected ? "Connected" : "Connecting..."}
          />
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6 min-h-0" style={{ maxHeight: "calc(100vh - 280px)" }}>
          {isLoadingHistory ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
              <div className="p-4 bg-primary/10 rounded-full">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="font-medium">No messages yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Start the conversation with{" "}
                  {receiverRole === "Doctor" ? `Dr. ${receiverName}` : receiverName}
                </p>
              </div>
            </div>
          ) : (
            Object.entries(groupedMessages).map(([date, dayMessages]) => (
              <div key={date} className="space-y-3">
                {/* Date separator */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground px-2 shrink-0">
                    {format(new Date(date), "MMMM d, yyyy")}
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {dayMessages.map((msg) => {
                  const isMe = msg.senderId === myId;
                  return (
                    <div
                      key={msg._id}
                      className={cn(
                        "flex gap-2 items-end",
                        isMe ? "flex-row-reverse" : "flex-row"
                      )}
                    >
                      {!isMe && (
                        <Avatar className="h-7 w-7 shrink-0 mb-1">
                          <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-semibold">
                            {getInitials(receiverName)}
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div
                        className={cn(
                          "max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm",
                          isMe
                            ? "bg-primary text-primary-foreground rounded-br-sm"
                            : "bg-muted text-foreground rounded-bl-sm"
                        )}
                      >
                        <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                        <p
                          className={cn(
                            "text-[10px] mt-1",
                            isMe ? "text-primary-foreground/70 text-right" : "text-muted-foreground"
                          )}
                        >
                          {formatMessageTime(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-2 items-end">
              <Avatar className="h-7 w-7 shrink-0">
                <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-semibold">
                  {getInitials(receiverName)}
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-sm">
                <div className="flex gap-1 items-center h-4">
                  <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div className="pt-4 border-t">
          <div className="flex items-center gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${receiverRole === "Doctor" ? `Dr. ${receiverName}` : receiverName}...`}
              className="flex-1 rounded-full px-4"
              disabled={isLoadingHistory}
              autoFocus
            />
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!input.trim() || isLoadingHistory}
              className="rounded-full h-10 w-10 shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-center text-muted-foreground mt-2">
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
