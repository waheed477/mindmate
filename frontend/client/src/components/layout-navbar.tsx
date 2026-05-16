import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@hooks/use-auth";
import { Button } from "@components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Brain, User, LogOut, LayoutDashboard, Settings, Bot } from "lucide-react";
import { NotificationBell } from "@components/notification-bell";

export function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isDoctor = user?.role === "doctor";
  const dashboardLink = isDoctor ? "/doctor/dashboard" : "/dashboard";

  const profilePicture = isDoctor
    ? user?.doctor?.profilePicture
    : user?.patient?.profilePicture;

  const initials = user?.fullName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || (user?.username?.charAt(0)?.toUpperCase() ?? "U");

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/">
            <div className="flex items-center gap-2 text-primary hover:opacity-90 transition-opacity cursor-pointer">
              <Brain className="h-8 w-8" />
              <span className="text-xl font-bold font-display tracking-tight">MindMate</span>
            </div>
          </Link>

          {user && (
            <div className="hidden md:flex items-center gap-6">
              <Link to={dashboardLink}>
                <div className={`text-sm font-medium transition-colors hover:text-primary cursor-pointer ${location.pathname === dashboardLink ? "text-primary" : "text-muted-foreground"}`}>
                  Dashboard
                </div>
              </Link>
              {!isDoctor && (
                <Link to="/doctors">
                  <div className={`text-sm font-medium transition-colors hover:text-primary cursor-pointer ${location.pathname === "/doctors" ? "text-primary" : "text-muted-foreground"}`}>
                    Find Doctors
                  </div>
                </Link>
              )}
              {!isDoctor && (
                <Link to="/ai-assistant">
                  <div className={`text-sm font-medium transition-colors hover:text-primary cursor-pointer flex items-center gap-1.5 ${location.pathname === "/ai-assistant" ? "text-primary" : "text-muted-foreground"}`}>
                    <Bot className="h-4 w-4" />
                    AI Assistant
                  </div>
                </Link>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user && user.role === "patient" && <NotificationBell />}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarImage src={profilePicture} alt={user.fullName} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center gap-3 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profilePicture} alt={user.fullName} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-0.5">
                    <p className="text-sm font-medium leading-none">{user.fullName}</p>
                    <p className="text-xs leading-none text-muted-foreground capitalize">{user.role}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer p-2">
                  <Link to={dashboardLink} className="flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer p-2">
                  <Link to="/edit-profile" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive cursor-pointer p-2">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link to="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
