import { Bell, Check, CheckCheck, Trash2, Calendar, Pill } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications, NotificationType } from "@/hooks/use-notifications";
import { formatDistanceToNow } from "date-fns";

const typeStyles: Record<NotificationType, { color: string; dot: string; icon?: "pill" | "calendar" }> = {
  appointment_accepted: {
    color: "text-green-700",
    dot: "bg-green-500",
    icon: "calendar",
  },
  appointment_rejected: {
    color: "text-red-700",
    dot: "bg-red-500",
    icon: "calendar",
  },
  appointment_completed: {
    color: "text-blue-700",
    dot: "bg-blue-500",
    icon: "calendar",
  },
  appointment_cancelled: {
    color: "text-gray-600",
    dot: "bg-gray-400",
    icon: "calendar",
  },
  prescription_issued: {
    color: "text-purple-700",
    dot: "bg-purple-500",
    icon: "pill",
  },
};

export function NotificationBell() {
  const { notifications, unreadCount, markAllRead, markRead, clearAll } = useNotifications();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9"
          data-testid="button-notification-bell"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-0" data-testid="dropdown-notifications">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-semibold text-sm">Notifications</h3>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs gap-1"
                onClick={markAllRead}
                data-testid="button-mark-all-read"
              >
                <CheckCheck className="h-3 w-3" />
                Mark all read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                onClick={clearAll}
                data-testid="button-clear-notifications"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center px-4">
            <Bell className="h-8 w-8 text-muted-foreground/40 mb-2" />
            <p className="text-sm font-medium text-muted-foreground">No notifications yet</p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              You'll be notified about appointments and prescriptions here
            </p>
          </div>
        ) : (
          <ScrollArea className="max-h-96">
            <div className="divide-y">
              {notifications.map((notif) => {
                const style = typeStyles[notif.type] ?? typeStyles.appointment_cancelled;
                const isPrescription = notif.type === "prescription_issued";
                return (
                  <div
                    key={notif.id}
                    className={`flex gap-3 px-4 py-3 hover:bg-muted/50 transition-colors cursor-default ${
                      !notif.read ? "bg-primary/5" : ""
                    }`}
                    data-testid={`notification-item-${notif.id}`}
                    onClick={() => markRead(notif.id)}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isPrescription ? (
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-100">
                          <Pill className="h-3.5 w-3.5 text-purple-600" />
                        </div>
                      ) : (
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`inline-block h-1.5 w-1.5 rounded-full shrink-0 ${style.dot}`} />
                        <p className={`text-sm font-semibold leading-tight ${style.color}`}>
                          {notif.title}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                        {notif.message}
                      </p>
                      <p className="text-xs text-muted-foreground/60 mt-1">
                        {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    {!notif.read && (
                      <button
                        className="shrink-0 mt-0.5 p-0.5 rounded hover:bg-muted"
                        onClick={(e) => { e.stopPropagation(); markRead(notif.id); }}
                        data-testid={`button-read-${notif.id}`}
                      >
                        <Check className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
