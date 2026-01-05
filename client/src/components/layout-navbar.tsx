import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@hooks/use-auth";
import { Button } from "@components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@components/ui/avatar";
import { Brain, User, LogOut, LayoutDashboard } from "lucide-react";

export function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isDoctor = user?.role === 'doctor';
  const dashboardLink = isDoctor ? '/doctor/dashboard' : '/dashboard';

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
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem className="flex items-center gap-2 p-2">
                  <User className="h-4 w-4" />
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.username}</p>
                    <p className="text-xs leading-none text-muted-foreground capitalize">{user.role}</p>  
                  </div>
                </DropdownMenuItem>
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

