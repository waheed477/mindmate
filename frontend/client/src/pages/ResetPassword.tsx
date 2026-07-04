import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, KeyRound, CheckCircle2, Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");
    if (t) setToken(t);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!token) { setError("Invalid reset link — please request a new one."); return; }
    if (newPassword.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (newPassword !== confirmPassword) { setError("Passwords do not match."); return; }
    setIsLoading(true);
    try {
      const res = await api.post("/auth/reset-password", { token, newPassword });
      if (res.data.success) {
        setDone(true);
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setError(res.data.message || "Failed to reset password.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Reset link is invalid or has expired. Please request a new one.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Brain className="h-8 w-8 text-teal-600" />
          <span className="text-2xl font-bold text-teal-700">MindMate</span>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            {done ? (
              <>
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-green-100 p-4">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                  </div>
                </div>
                <CardTitle className="text-xl">Password reset!</CardTitle>
                <CardDescription>
                  Your password has been updated successfully. Redirecting you to login…
                </CardDescription>
              </>
            ) : (
              <>
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-teal-100 p-4">
                    <KeyRound className="h-10 w-10 text-teal-600" />
                  </div>
                </div>
                <CardTitle className="text-xl">Set a new password</CardTitle>
                <CardDescription>
                  Choose a strong password for your MindMate account.
                </CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent>
            {done ? (
              <Link to="/login">
                <Button className="w-full bg-teal-600 hover:bg-teal-700">Go to Login</Button>
              </Link>
            ) : !token ? (
              <div className="text-center space-y-4">
                <div className="flex items-center gap-2 text-destructive justify-center">
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-sm">Invalid or missing reset token.</span>
                </div>
                <Link to="/forgot-password">
                  <Button className="w-full bg-teal-600 hover:bg-teal-700">Request New Link</Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="At least 6 characters"
                      value={newPassword}
                      onChange={(e) => { setNewPassword(e.target.value); setError(""); }}
                      disabled={isLoading}
                      data-testid="input-new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Repeat your new password"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                    disabled={isLoading}
                    data-testid="input-confirm-password"
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-destructive text-sm">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-700"
                  disabled={isLoading}
                  data-testid="button-reset-password"
                >
                  {isLoading ? (
                    <><Loader2 className="h-4 w-4 animate-spin mr-2" />Resetting…</>
                  ) : (
                    "Reset Password"
                  )}
                </Button>

                <Link to="/login" className="flex items-center justify-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Back to Login
                </Link>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
