import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";

let sharedSocket: Socket | null = null;

const getSocket = (token: string): Socket => {
  if (sharedSocket?.connected) return sharedSocket;

  sharedSocket = io(window.location.origin, {
    auth: { token },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  return sharedSocket;
};

export const useSocket = (token: string | null) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) return;
    socketRef.current = getSocket(token);
    return () => {
      // Don't disconnect shared socket on unmount — just clean up listeners
    };
  }, [token]);

  const joinRoom = useCallback((receiverId: string) => {
    socketRef.current?.emit("join_room", { receiverId });
  }, []);

  const sendMessage = useCallback((receiverId: string, content: string) => {
    socketRef.current?.emit("send_message", { receiverId, content });
  }, []);

  const emitTyping = useCallback((receiverId: string) => {
    socketRef.current?.emit("typing", { receiverId });
  }, []);

  const emitStopTyping = useCallback((receiverId: string) => {
    socketRef.current?.emit("stop_typing", { receiverId });
  }, []);

  const markRead = useCallback((senderId: string) => {
    socketRef.current?.emit("mark_read", { senderId });
  }, []);

  const on = useCallback((event: string, handler: (...args: any[]) => void) => {
    socketRef.current?.on(event, handler);
    return () => { socketRef.current?.off(event, handler); };
  }, []);

  const off = useCallback((event: string, handler: (...args: any[]) => void) => {
    socketRef.current?.off(event, handler);
  }, []);

  return { socket: socketRef, joinRoom, sendMessage, emitTyping, emitStopTyping, markRead, on, off };
};
