import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Navbar } from "@/components/layout-navbar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User, Phone, MessageCircle, AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SUGGESTED_QUESTIONS = [
  "I've been feeling anxious all week",
  "I can't stop negative thoughts",
  "How do I cope with stress?",
  "I'm struggling with sleep",
  "I feel lonely and isolated",
  "How to build self-confidence?",
];

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Hello! I'm MindMate AI Assistant. I'm here to offer compassionate support and evidence-based guidance for your mental wellbeing. 💙\n\nYou can type your own message or choose one of the suggested topics below to get started. Everything you share here is private.",
  timestamp: new Date(),
};

export default function AIAssistant() {
  const { user, getToken } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const token = getToken();
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: trimmed }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to get response");

      const aiMessage: Message = {
        id: `ai_${Date.now()}`,
        role: "assistant",
        content: data.response,
        timestamp: new Date(data.timestamp),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      const errorMessage: Message = {
        id: `err_${Date.now()}`,
        role: "assistant",
        content:
          "I'm sorry, I had trouble processing that. Please try again in a moment. If you're in crisis, please call 988 immediately.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const formatContent = (content: string) => {
    return content.split("\n").map((line, i) => {
      const formatted = line
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>");
      return (
        <span key={i}>
          <span dangerouslySetInnerHTML={{ __html: formatted }} />
          {i < content.split("\n").length - 1 && <br />}
        </span>
      );
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="flex-1 flex overflow-hidden" style={{ height: "calc(100vh - 64px)" }}>
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chat Header */}
          <div className="border-b bg-background/95 backdrop-blur px-6 py-4 flex items-center gap-3 shrink-0">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold text-base">MindMate AI Assistant</h1>
              <p className="text-xs text-muted-foreground">Mental health support · Always available</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-muted-foreground">Online</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-3 items-end max-w-3xl",
                  msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                )}
              >
                <Avatar className="h-8 w-8 shrink-0 mb-1">
                  <AvatarFallback
                    className={cn(
                      "text-xs font-semibold",
                      msg.role === "assistant"
                        ? "bg-primary/10 text-primary"
                        : "bg-secondary text-secondary-foreground"
                    )}
                  >
                    {msg.role === "assistant" ? (
                      <Bot className="h-4 w-4" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </AvatarFallback>
                </Avatar>

                <div
                  className={cn(
                    "rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm max-w-[80%]",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  )}
                >
                  <div className="whitespace-pre-wrap break-words">
                    {formatContent(msg.content)}
                  </div>
                  <p
                    className={cn(
                      "text-[10px] mt-1.5",
                      msg.role === "user"
                        ? "text-primary-foreground/60 text-right"
                        : "text-muted-foreground"
                    )}
                  >
                    {format(msg.timestamp, "p")}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex gap-3 items-end">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1 items-center h-4">
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length <= 1 && (
            <div className="px-4 md:px-8 pb-3 shrink-0">
              <p className="text-xs text-muted-foreground mb-2 font-medium">Suggested topics:</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    disabled={isLoading}
                    data-testid={`suggested-${q.slice(0, 20)}`}
                    className="text-xs px-3 py-1.5 rounded-full border border-primary/30 text-primary bg-primary/5 hover:bg-primary/10 transition-colors disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t px-4 md:px-8 py-4 shrink-0 bg-background">
            <div className="flex gap-3 items-end max-w-3xl mx-auto">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Share what's on your mind…"
                className="flex-1 resize-none rounded-2xl min-h-[48px] max-h-[120px] py-3 px-4 text-sm"
                rows={1}
                disabled={isLoading}
                data-testid="input-ai-message"
              />
              <Button
                size="icon"
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isLoading}
                className="rounded-full h-12 w-12 shrink-0"
                data-testid="button-send-ai"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-[11px] text-center text-muted-foreground mt-2 flex items-center justify-center gap-1">
              <AlertTriangle className="h-3 w-3 text-amber-500" />
              This AI provides general mental health support. For emergencies, call{" "}
              <strong>988</strong> or text HOME to <strong>741741</strong>.
            </p>
          </div>
        </div>

        {/* Crisis Helpline Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 border-l bg-muted/30 p-5 gap-4 shrink-0">
          <div>
            <h2 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              Crisis Helplines
            </h2>
            <div className="space-y-3">
              <div className="bg-background rounded-xl p-3 border border-border/60 shadow-sm">
                <p className="text-xs font-semibold text-foreground">
                  National Suicide Prevention
                </p>
                <p className="text-lg font-bold text-primary mt-0.5">988</p>
                <p className="text-[11px] text-muted-foreground">Call or text · 24/7</p>
              </div>
              <div className="bg-background rounded-xl p-3 border border-border/60 shadow-sm">
                <p className="text-xs font-semibold text-foreground">Crisis Text Line</p>
                <p className="text-sm font-bold text-primary mt-0.5">Text HOME to 741741</p>
                <p className="text-[11px] text-muted-foreground">Free · Confidential · 24/7</p>
              </div>
              <div className="bg-background rounded-xl p-3 border border-border/60 shadow-sm">
                <p className="text-xs font-semibold text-foreground">SAMHSA Helpline</p>
                <p className="text-sm font-bold text-primary mt-0.5">1-800-662-4357</p>
                <p className="text-[11px] text-muted-foreground">Substance & mental health</p>
              </div>
            </div>
          </div>

          <div className="mt-2">
            <h2 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-primary" />
              Talk to a Doctor
            </h2>
            <p className="text-xs text-muted-foreground mb-3">
              For personalized care, connect with a verified mental health specialist.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() => navigate("/doctors")}
              data-testid="button-find-doctor"
            >
              Find a Specialist
            </Button>
          </div>

          <div className="mt-auto">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
              <p className="text-[11px] text-amber-800 leading-relaxed">
                <strong>Note:</strong> This AI assistant offers general support only and is not a
                substitute for professional mental health care.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
