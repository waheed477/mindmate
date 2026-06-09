import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@hooks/use-auth";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Brain, User, Stethoscope, Mail, Loader2, CheckCircle2, RefreshCw } from "lucide-react";
import { useState, useRef } from "react";

const loginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;
type Step = "login" | "verify";

export default function Login() {
  const { login, verifyEmail, resendVerification, isLoggingIn } = useAuth();
  const navigate = useNavigate();
  const [userType, setUserType] = useState<"patient" | "doctor">("patient");
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Verify step state
  const [step, setStep] = useState<Step>("login");
  const [pendingEmail, setPendingEmail] = useState("");
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const digitRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [resendMsg, setResendMsg] = useState("");

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  // FIXED: Updated onSubmit function - send ONLY email and password (NO userType)
  const onSubmit = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    setLoginError("");
    try {
      // ✅ Send ONLY email and password (NO userType)
      const result = await login(data.email, data.password);
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setLoginError(result.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setLoginError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ── OTP handlers ────────────────────────────────────────────────────────────

  const handleDigitChange = (index: number, value: string) => {
    const char = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = char;
    setDigits(next);
    setVerifyError("");
    if (char && index < 5) digitRefs.current[index + 1]?.focus();
  };

  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      digitRefs.current[index - 1]?.focus();
    }
  };

  const handleDigitPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length > 0) {
      e.preventDefault();
      const next = [...digits];
      for (let i = 0; i < 6; i++) next[i] = pasted[i] || "";
      setDigits(next);
      digitRefs.current[Math.min(pasted.length, 5)]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = digits.join("");
    if (code.length < 6) { setVerifyError("Please enter all 6 digits."); return; }
    setIsVerifying(true);
    setVerifyError("");
    try {
      await verifyEmail(pendingEmail, code);
      navigate("/login");
      setStep("login");
      setDigits(["", "", "", "", "", ""]);
      form.reset();
    } catch (err: any) {
      setVerifyError(err.message || "Invalid code. Please try again.");
      setDigits(["", "", "", "", "", ""]);
      digitRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setResendMsg("");
    setVerifyError("");
    try {
      await resendVerification(pendingEmail);
      setDigits(["", "", "", "", "", ""]);
      digitRefs.current[0]?.focus();
      setResendMsg("A new code has been sent to your email.");
    } catch (err: any) {
      setVerifyError(err.message || "Failed to resend code.");
    } finally {
      setIsResending(false);
    }
  };

  // ── Verify Email Step ────────────────────────────────────────────────────────

  if (step === "verify") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <Link to="/">
              <div className="inline-flex items-center justify-center gap-2 text-primary hover:opacity-80 transition-opacity cursor-pointer">
                <Brain className="h-9 w-9" />
                <span className="text-2xl font-bold font-display">MindMate</span>
              </div>
            </Link>
          </div>

          <Card>
            <CardHeader className="text-center space-y-3 pb-2">
              <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="h-7 w-7 text-primary" />
              </div>
              <CardTitle className="text-xl">Verify your email</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Enter the 6-digit code sent to{" "}
                <span className="font-semibold text-foreground">{pendingEmail}</span>
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 pt-4">
              <div className="flex justify-center gap-2" onPaste={handleDigitPaste}>
                {digits.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => { digitRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    data-testid={`input-otp-${i}`}
                    onChange={(e) => handleDigitChange(i, e.target.value)}
                    onKeyDown={(e) => handleDigitKeyDown(i, e)}
                    className={`w-11 h-14 text-center text-xl font-bold rounded-lg border-2 bg-background outline-none transition-colors
                      ${d ? "border-primary text-primary" : "border-border text-foreground"}
                      focus:border-primary focus:ring-2 focus:ring-primary/20`}
                  />
                ))}
              </div>

              {verifyError && (
                <p className="text-sm text-destructive text-center" data-testid="text-verify-error">
                  {verifyError}
                </p>
              )}

              {resendMsg && (
                <p className="text-sm text-green-600 text-center flex items-center justify-center gap-1">
                  <CheckCircle2 className="h-4 w-4" />
                  {resendMsg}
                </p>
              )}

              <Button
                className="w-full"
                onClick={handleVerify}
                disabled={isVerifying || digits.join("").length < 6}
                data-testid="button-confirm-code"
              >
                {isVerifying ? (
                  <><Loader2 className="h-4 w-4 animate-spin mr-2" />Verifying…</>
                ) : (
                  "Confirm & Sign In"
                )}
              </Button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Didn't receive a code?</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResend}
                  disabled={isResending}
                  data-testid="button-resend-code"
                  className="gap-2 text-primary"
                >
                  {isResending ? (
                    <><Loader2 className="h-3 w-3 animate-spin" />Sending…</>
                  ) : (
                    <><RefreshCw className="h-3 w-3" />Resend code</>
                  )}
                </Button>
              </div>

              <div className="text-center">
                <button
                  onClick={() => { setStep("login"); setDigits(["","","","","",""]); setVerifyError(""); }}
                  className="text-sm text-muted-foreground hover:text-foreground underline"
                >
                  ← Back to login
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ── Login Step ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: Form */}
      <div className="flex flex-col justify-center items-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <Link to="/">
              <div className="inline-flex items-center justify-center gap-2 text-primary mb-8 hover:opacity-80 transition-opacity cursor-pointer">
                <Brain className="h-10 w-10" />
                <span className="text-2xl font-bold font-display">MindMate</span>
              </div>
            </Link>
            <h1 className="text-3xl font-bold font-display tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground">Select your role and enter your credentials</p>
          </div>

          <Card className="border-0 shadow-none sm:border sm:shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Sign in</CardTitle>
              <CardDescription>Choose your role and enter credentials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Tabs
                  defaultValue="patient"
                  className="w-full"
                  onValueChange={(value) => setUserType(value as "patient" | "doctor")}
                >
                  <TabsList className="grid grid-cols-2 mb-4">
                    <TabsTrigger value="patient" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>Patient</span>
                    </TabsTrigger>
                    <TabsTrigger value="doctor" className="flex items-center gap-2">
                      <Stethoscope className="h-4 w-4" />
                      <span>Doctor</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="patient" className="space-y-2">
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-md">
                      <p className="text-sm text-blue-800">
                        <span className="font-semibold">Patient Login:</span> Access your appointments, therapy sessions, and health records.
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="doctor" className="space-y-2">
                    <div className="p-3 bg-green-50 border border-green-100 rounded-md">
                      <p className="text-sm text-green-800">
                        <span className="font-semibold">Doctor Login:</span> Manage appointments, patient records, and consultations.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            data-testid="input-email"
                            placeholder={userType === "patient" ? "patient@example.com" : "doctor@example.com"}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input data-testid="input-password" type="password" placeholder="Enter your password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {loginError && (
                    <p className="text-sm text-destructive" data-testid="text-login-error">
                      {loginError}
                    </p>
                  )}

                  <Button type="submit" className="w-full" data-testid="button-login" disabled={isLoading || isLoggingIn}>
                    {isLoading || isLoggingIn ? (
                      <><Loader2 className="h-4 w-4 animate-spin mr-2" />Signing in…</>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        {userType === "patient" ? (
                          <><User className="h-4 w-4" /><span>Sign in as Patient</span></>
                        ) : (
                          <><Stethoscope className="h-4 w-4" /><span>Sign in as Doctor</span></>
                        )}
                      </div>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 text-center text-sm text-muted-foreground">
              <div className="space-y-2">
                <div>
                  Don't have an account?{" "}
                  <Link to="/register">
                    <span className="text-primary hover:underline font-medium cursor-pointer">Sign up</span>
                  </Link>
                </div>
                <div className="text-xs">
                  <Link to="/register">
                    <span className="text-primary hover:underline cursor-pointer">
                      Register as {userType === "patient" ? "Doctor" : "Patient"} instead
                    </span>
                  </Link>
                </div>
              </div>
              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  Forgot your password?{" "}
                  <Link to="/forgot-password">
                    <span className="text-primary hover:underline cursor-pointer">Reset it here</span>
                  </Link>
                </p>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Right: Image */}
      <div className="hidden lg:block relative overflow-hidden">
        <div className={`absolute inset-0 backdrop-blur-3xl transition-colors duration-300 ${
          userType === "patient" ? "bg-blue-50/30" : "bg-green-50/30"
        }`} />

        {userType === "patient" && (
          <>
            <img
              src="https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?q=80&w=2070&auto=format&fit=crop"
              alt="Calming water for patients"
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40"
            />
            <div className="relative z-10 h-full flex items-center justify-center p-12 text-center">
              <div className="max-w-lg space-y-6">
                <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
                  <User className="h-12 w-12 text-blue-600" />
                </div>
                <h2 className="text-4xl font-bold font-display text-gray-800">Patient Portal</h2>
                <p className="text-xl text-gray-600 opacity-90">
                  Access your therapy sessions, track progress, and connect with mental health professionals.
                </p>
                <ul className="text-left text-gray-600 space-y-2 pt-4">
                  <li className="flex items-center gap-2"><div className="h-2 w-2 bg-blue-500 rounded-full" /><span>Schedule appointments</span></li>
                  <li className="flex items-center gap-2"><div className="h-2 w-2 bg-blue-500 rounded-full" /><span>Access therapy resources</span></li>
                  <li className="flex items-center gap-2"><div className="h-2 w-2 bg-blue-500 rounded-full" /><span>Track your progress</span></li>
                </ul>
              </div>
            </div>
          </>
        )}

        {userType === "doctor" && (
          <>
            <img
              src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=2070&auto=format&fit=crop"
              alt="Medical professionals"
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40"
            />
            <div className="relative z-10 h-full flex items-center justify-center p-12 text-center">
              <div className="max-w-lg space-y-6">
                <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-4">
                  <Stethoscope className="h-12 w-12 text-green-600" />
                </div>
                <h2 className="text-4xl font-bold font-display text-gray-800">Doctor Portal</h2>
                <p className="text-xl text-gray-600 opacity-90">
                  Manage patient consultations, appointments, and provide mental health care.
                </p>
                <ul className="text-left text-gray-600 space-y-2 pt-4">
                  <li className="flex items-center gap-2"><div className="h-2 w-2 bg-green-500 rounded-full" /><span>Manage appointments</span></li>
                  <li className="flex items-center gap-2"><div className="h-2 w-2 bg-green-500 rounded-full" /><span>Access patient records</span></li>
                  <li className="flex items-center gap-2"><div className="h-2 w-2 bg-green-500 rounded-full" /><span>Provide consultations</span></li>
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}