import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
  useRef,
  createElement,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { io, Socket } from "socket.io-client";

export type NotificationType =
  | "appointment_accepted"
  | "appointment_rejected"
  | "appointment_completed"
  | "appointment_cancelled"
  | "prescription_issued";

export interface AppointmentNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  appointmentId?: string;
  doctorName: string;
  date: string;
  read: boolean;
  createdAt: string;
}

interface NotificationsContextValue {
  notifications: AppointmentNotification[];
  unreadCount: number;
  markAllRead: () => void;
  markRead: (id: string) => void;
  clearAll: () => void;
}

export const NotificationsContext = createContext<NotificationsContextValue>({
  notifications: [],
  unreadCount: 0,
  markAllRead: () => {},
  markRead: () => {},
  clearAll: () => {},
});

export const useNotifications = () => useContext(NotificationsContext);

let sharedSocket: Socket | null = null;

const getNotifSocket = (token: string): Socket => {
  if (sharedSocket?.connected) return sharedSocket;
  if (sharedSocket) {
    sharedSocket.removeAllListeners();
    sharedSocket.disconnect();
    sharedSocket = null;
  }
  sharedSocket = io(window.location.origin, {
    auth: { token },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 15,
    reconnectionDelay: 1500,
  });
  return sharedSocket;
};

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user, getToken } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [notifications, setNotifications] = useState<AppointmentNotification[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!user || !token) return;

    const socket = getNotifSocket(token);
    socketRef.current = socket;

    const addNotification = (notif: AppointmentNotification) => {
      setNotifications((prev) => [notif, ...prev].slice(0, 50));
      toast({
        title: notif.title,
        description: notif.message,
        duration: 6000,
      });
    };

    // ── Appointment status changes ──────────────────────────────────────────
    const handleAppointmentNotification = (data: {
      type: NotificationType;
      appointmentId: string;
      doctorName: string;
      date: string;
      message: string;
    }) => {
      const typeLabels: Record<string, string> = {
        appointment_accepted: "Appointment Confirmed",
        appointment_rejected: "Appointment Declined",
        appointment_completed: "Appointment Completed",
        appointment_cancelled: "Appointment Cancelled",
      };

      const notif: AppointmentNotification = {
        id: `${Date.now()}-${Math.random()}`,
        type: data.type,
        title: typeLabels[data.type] ?? "Appointment Update",
        message: data.message,
        appointmentId: data.appointmentId,
        doctorName: data.doctorName,
        date: data.date,
        read: false,
        createdAt: new Date().toISOString(),
      };

      addNotification(notif);
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    };

    // ── New prescription issued ─────────────────────────────────────────────
    const handlePrescriptionNotification = (data: {
      doctorName: string;
      medicineCount: number;
      prescriptionId: string;
    }) => {
      const notif: AppointmentNotification = {
        id: `${Date.now()}-${Math.random()}`,
        type: "prescription_issued",
        title: "New Prescription",
        message: `Dr. ${data.doctorName} has issued you a prescription with ${data.medicineCount} medicine${data.medicineCount !== 1 ? "s" : ""}.`,
        doctorName: data.doctorName,
        date: new Date().toLocaleDateString("en-US", { dateStyle: "medium" }),
        read: false,
        createdAt: new Date().toISOString(),
      };

      addNotification(notif);
      queryClient.invalidateQueries({ queryKey: ["/api/prescriptions/my"] });
    };

    socket.on("appointment_notification", handleAppointmentNotification);
    socket.on("prescription_notification", handlePrescriptionNotification);

    return () => {
      socket.off("appointment_notification", handleAppointmentNotification);
      socket.off("prescription_notification", handlePrescriptionNotification);
    };
  }, [user?.id]);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const markRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const clearAll = useCallback(() => setNotifications([]), []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return createElement(
    NotificationsContext.Provider,
    { value: { notifications, unreadCount, markAllRead, markRead, clearAll } },
    children
  );
}
