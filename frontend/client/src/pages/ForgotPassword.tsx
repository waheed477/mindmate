import { useState } from "react";
import { Link } from "react-router-dom";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, ArrowLeft, Mail, CheckCircle2, Loader2 } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setError("Please enter your email address."); return; }
    setIsLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/forgot-password", { email });
      if (res.data.success) {
        setSent(true);
      } else {
        setError(res.data.message || "Something went wrong. Please try again.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "No account found with that email address.");
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
            {sent ? (
              <>
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-green-100 p-4">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                  </div>
                </div>
                <CardTitle className="text-xl">Check your email</CardTitle>
                <CardDescription>
                  We sent a password reset link to <strong>{email}</strong>. Check your inbox (and spam folder).
                  The link expires in 1 hour.
                </CardDescription>
              </>
            ) : (
              <>
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-teal-100 p-4">
                    <Mail className="h-10 w-10 text-teal-600" />
                  </div>
                </div>
                <CardTitle className="text-xl">Forgot your password?</CardTitle>
                <CardDescription>
                  Enter the email address associated with your account and we'll send you a link to reset your password.
                </CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent>
            {sent ? (
              <div className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => { setSent(false); setEmail(""); }}
                >
                  Try a different email
                </Button>
                <Link to="/login">
                  <Button className="w-full bg-teal-600 hover:bg-teal-700">Back to Login</Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    disabled={isLoading}
                    data-testid="input-email"
                  />
                  {error && <p className="text-sm text-destructive">{error}</p>}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-700"
                  disabled={isLoading}
                  data-testid="button-send-reset"
                >
                  {isLoading ? (
                    <><Loader2 className="h-4 w-4 animate-spin mr-2" />Sending...</>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>

                <Link to="/login" className="flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="h-4 w-4" />
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
