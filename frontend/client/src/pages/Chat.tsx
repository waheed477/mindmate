import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Navbar } from "@/components/layout-navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send, Loader2, MessageSquare, WifiOff } from "lucide-react";
import { format, isToday, isYesterday } from "date-fns";
import { cn } from "@/lib/utils";
import { io, Socket } from "socket.io-client";

interface ChatMessage {
  _id: string;
  senderId: string;
  receiverId: string;
  senderName?: string;
  content: string;
  createdAt: string;
  read: boolean;
  pending?: boolean;
}

interface ReceiverInfo {
  _id: string;
  fullName?: string;
  email?: string;
  role?: string;
}

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

let chatSocket: Socket | null = null;

const getChatSocket = (token: string): Socket => {
  if (chatSocket?.connected) return chatSocket;
  if (chatSocket) {
    chatSocket.removeAllListeners();
    chatSocket.disconnect();
  }
  chatSocket = io(window.location.origin, {
    auth: { token },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
  });
  return chatSocket;
};

export default function ChatPage() {
  const { receiverId } = useParams<{ receiverId: string }>();
  const navigate = useNavigate();
  const { user, getToken } = useAuth();

  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [receiver, setReceiver] = useState<ReceiverInfo | null>(null);
  const [input, setInput] = useState("");
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tempIdCounterRef = useRef(0);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }, []);

  // Fetch message history
  useEffect(() => {
    if (!receiverId) return;
    const token = getToken();
    if (!token) return;

    setIsLoadingHistory(true);
    fetch(`/api/messages/${receiverId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setMessages(data.messages ?? []);
        setReceiver(data.receiver ?? null);
      })
      .catch((err) => console.error("History fetch error:", err))
      .finally(() => setIsLoadingHistory(false));
  }, [receiverId]);

  // Socket setup
  useEffect(() => {
    if (!receiverId) return;
    const token = getToken();
    if (!token) return;

    const socket = getChatSocket(token);
    socketRef.current = socket;

    setIsConnected(socket.connected);

    const onConnect = () => {
      setIsConnected(true);
      socket.emit("join_room", { receiverId });
      socket.emit("mark_read", { senderId: receiverId });
    };

    const onDisconnect = () => setIsConnected(false);

    const onReceiveMessage = (msg: ChatMessage) => {
      const myId = user?.id ?? "";
      const isRelevant =
        (String(msg.senderId) === String(receiverId) && String(msg.receiverId) === myId) ||
        (String(msg.senderId) === myId && String(msg.receiverId) === String(receiverId));
      if (!isRelevant) return;

      setMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, { ...msg, pending: false }];
      });
      scrollToBottom();
      socket.emit("mark_read", { senderId: receiverId });
    };

    const onMessageSent = (msg: ChatMessage) => {
      // Replace the most recent matching pending (optimistic) message with the confirmed one
      setMessages((prev) => {
        const reversed = [...prev].reverse();
        const pendingIdx = reversed.findIndex(
          (m) => !!m.pending && m.content === msg.content && String(m.senderId) === (user?.id ?? "")
        );
        if (pendingIdx !== -1) {
          const realIdx = prev.length - 1 - pendingIdx;
          return prev.map((m, i) => (i === realIdx ? { ...msg, pending: false } : m));
        }
        // No pending match, add only if not already present
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, { ...msg, pending: false }];
      });
    };

    const onUserTyping = ({ senderId }: { senderId: string }) => {
      if (String(senderId) === String(receiverId)) setIsTyping(true);
    };

    const onUserStopTyping = ({ senderId }: { senderId: string }) => {
      if (String(senderId) === String(receiverId)) setIsTyping(false);
    };

    const onMessageError = () => {
      setMessages((prev) =>
        prev.map((m, i) =>
          i === prev.length - 1 && m.pending
            ? { ...m, pending: false, _id: `failed_${m._id}` }
            : m
        )
      );
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("receive_message", onReceiveMessage);
    socket.on("message_sent", onMessageSent);
    socket.on("user_typing", onUserTyping);
    socket.on("user_stop_typing", onUserStopTyping);
    socket.on("message_error", onMessageError);

    if (socket.connected) {
      socket.emit("join_room", { receiverId });
      socket.emit("mark_read", { senderId: receiverId });
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("receive_message", onReceiveMessage);
      socket.off("message_sent", onMessageSent);
      socket.off("user_typing", onUserTyping);
      socket.off("user_stop_typing", onUserStopTyping);
      socket.off("message_error", onMessageError);
    };
  }, [receiverId, user?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (!receiverId || !socketRef.current) return;
    socketRef.current.emit("typing", { receiverId });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit("stop_typing", { receiverId });
    }, 1500);
  };

  const handleSend = () => {
    const content = input.trim();
    if (!content || !receiverId || !socketRef.current) return;

    setInput("");
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    socketRef.current.emit("stop_typing", { receiverId });

    const tempId = `temp_${Date.now()}_${tempIdCounterRef.current++}`;
    const optimistic: ChatMessage = {
      _id: tempId,
      senderId: user?.id ?? "",
      receiverId,
      content,
      createdAt: new Date().toISOString(),
      read: false,
      pending: true,
    };
    setMessages((prev) => [...prev, optimistic]);
    scrollToBottom();

    socketRef.current.emit("send_message", { receiverId, content });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const myId = user?.id ?? "";

  // Group messages by date
  const groupedMessages: Record<string, ChatMessage[]> = {};
  for (const msg of messages) {
    const date = format(new Date(msg.createdAt), "yyyy-MM-dd");
    if (!groupedMessages[date]) groupedMessages[date] = [];
    groupedMessages[date].push(msg);
  }

  const receiverName = receiver?.fullName || receiver?.email || "User";
  const receiverRole = receiver?.role
    ? receiver.role.charAt(0).toUpperCase() + receiver.role.slice(1)
    : "";
  const displayName = receiverRole === "Doctor" ? `Dr. ${receiverName}` : receiverName;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div
        className="container flex-1 flex flex-col py-4 max-w-3xl"
        style={{ height: "calc(100vh - 65px)" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0"
            data-testid="button-back-chat"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <Avatar className="h-10 w-10 shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
              {getInitials(receiverName)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-semibold text-base leading-tight truncate">{displayName}</h2>
              {receiverRole && (
                <Badge variant="outline" className="text-xs shrink-0">
                  {receiverRole}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground h-4">
              {isTyping ? (
                <span className="text-primary animate-pulse">Typing…</span>
              ) : (
                "MindMate Chat"
              )}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isConnected ? (
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-green-500 block" />
                <span className="text-xs text-muted-foreground hidden sm:block">Connected</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <WifiOff className="h-3.5 w-3.5" />
                <span className="text-xs hidden sm:block">Reconnecting…</span>
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6 min-h-0">
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
                  Start the conversation with {displayName}
                </p>
              </div>
            </div>
          ) : (
            Object.entries(groupedMessages).map(([date, dayMessages]) => (
              <div key={date} className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground px-2 shrink-0">
                    {format(new Date(date), "MMMM d, yyyy")}
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {dayMessages.map((msg) => {
                  const isMe = String(msg.senderId) === myId;
                  return (
                    <div
                      key={msg._id}
                      className={cn(
                        "flex gap-2 items-end",
                        isMe ? "flex-row-reverse" : "flex-row"
                      )}
                      data-testid={`message-${msg._id}`}
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
                            : "bg-muted text-foreground rounded-bl-sm",
                          msg.pending && "opacity-60"
                        )}
                      >
                        <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                        <p
                          className={cn(
                            "text-[10px] mt-1 flex items-center gap-1",
                            isMe
                              ? "text-primary-foreground/70 justify-end"
                              : "text-muted-foreground"
                          )}
                        >
                          {formatMessageTime(msg.createdAt)}
                          {isMe && msg.pending && (
                            <span className="opacity-60">· Sending…</span>
                          )}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}

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

        {/* Input */}
        <div className="pt-4 border-t shrink-0">
          <div className="flex items-center gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${displayName}…`}
              className="flex-1 rounded-full px-4"
              disabled={isLoadingHistory}
              autoFocus
              data-testid="input-chat-message"
            />
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!input.trim() || isLoadingHistory}
              className="rounded-full h-10 w-10 shrink-0"
              data-testid="button-send-message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-center text-muted-foreground mt-2">
            Press Enter to send
          </p>
        </div>
      </div>
    </div>
  );
}
