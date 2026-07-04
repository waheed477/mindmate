import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@hooks/use-auth";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Brain, Camera, Upload, Loader2, Mail, CheckCircle2, RefreshCw } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@components/ui/radio-group";
import { useState, useRef } from "react";
import { uploadImage } from "@/services/uploadService";

const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["patient", "doctor"]),
  fullName: z.string().min(2, "Full name is required"),
  age: z.coerce.number().optional(),
  gender: z.string().optional(),
  contactNumber: z.string().optional(),
  specialization: z.string().optional(),
  licenseNumber: z.string().optional(),
  experience: z.coerce.number().optional(),
  consultationFee: z.coerce.number().optional(),
  bio: z.string().optional(),
});

type RegisterForm = z.infer<typeof registerSchema>;
type Step = "form" | "verify";

export default function Register() {
  const { register, verifyEmail, resendVerification, isRegistering } = useAuth();
  const [step, setStep] = useState<Step>("form");
  const [pendingEmail, setPendingEmail] = useState("");
  const [role, setRole] = useState<"patient" | "doctor">("patient");
  const [profilePicture, setProfilePicture] = useState("");
  const [licensePicture, setLicensePicture] = useState("");
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingLicense, setUploadingLicense] = useState(false);

  // OTP digits
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const digitRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [resendMsg, setResendMsg] = useState("");
  const [formError, setFormError] = useState("");

  const profilePicRef = useRef<HTMLInputElement>(null);
  const licensePicRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "patient",
      fullName: "",
      age: "" as any,
      gender: "",
      contactNumber: "",
      specialization: "",
      licenseNumber: "",
      experience: "" as any,
      consultationFee: "" as any,
      bio: "",
    },
  });

  const watchedName = form.watch("fullName");
  const initials =
    watchedName
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";

  const handleProfilePicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingProfile(true);
    try {
      const url = await uploadImage(file);
      setProfilePicture(url);
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploadingProfile(false);
    }
  };

  const handleLicensePicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLicense(true);
    try {
      const url = await uploadImage(file);
      setLicensePicture(url);
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploadingLicense(false);
    }
  };

  async function onSubmit(data: RegisterForm) {
    setFormError("");
    
    const payload: any = {
      email: data.email,
      password: data.password,
      fullName: data.fullName,
      role: data.role,
    };

    if (data.role === "doctor") {
      payload.specialization = data.specialization;
      payload.licenseNumber = data.licenseNumber;
      payload.experience = Number(data.experience) || 0;
      payload.consultationFee = Number(data.consultationFee) || 0;
    } else {
      payload.age = Number(data.age) || 0;
      payload.condition = data.condition || "Anxiety";
      payload.contact = data.contactNumber || "0000000000";
    }

    try {
      const result = await register(payload);
      if (result?.requiresVerification) {
        setPendingEmail(data.email);
        setStep("verify");
      } else if (result?.success) {
        navigate(data.role === "doctor" ? "/doctor/dashboard" : "/dashboard");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Registration failed";
      console.error("Register error details:", errorMessage);
      setFormError(errorMessage);
    }
  }

  // ── OTP digit handlers ──────────────────────────────────────────────────────

  const handleDigitChange = (index: number, value: string) => {
    const char = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = char;
    setDigits(next);
    setVerifyError("");
    if (char && index < 5) {
      digitRefs.current[index + 1]?.focus();
    }
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
    if (code.length < 6) {
      setVerifyError("Please enter all 6 digits.");
      return;
    }
    setIsVerifying(true);
    setVerifyError("");
    try {
      const result = await verifyEmail(pendingEmail, code);
      if (result?.user?.role === "doctor") {
        navigate("/doctor/dashboard");
      } else {
        navigate("/dashboard");
      }
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

  // ── Verify Email Step ───────────────────────────────────────────────────────

  if (step === "verify") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
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
              <CardTitle className="text-xl">Check your email</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                We sent a 6-digit verification code to{" "}
                <span className="font-semibold text-foreground">{pendingEmail}</span>
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 pt-4">
              {/* OTP Boxes */}
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

              {/* Error */}
              {verifyError && (
                <p className="text-sm text-destructive text-center" data-testid="text-verify-error">
                  {verifyError}
                </p>
              )}

              {/* Resend success */}
              {resendMsg && (
                <p className="text-sm text-green-600 text-center flex items-center justify-center gap-1">
                  <CheckCircle2 className="h-4 w-4" />
                  {resendMsg}
                </p>
              )}

              {/* Confirm Button */}
              <Button
                className="w-full"
                onClick={handleVerify}
                disabled={isVerifying || digits.join("").length < 6}
                data-testid="button-confirm-code"
              >
                {isVerifying ? (
                  <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Verifying…</>
                ) : (
                  "Confirm & Continue"
                )}
              </Button>

              {/* Resend */}
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
                    <><Loader2 className="h-3 w-3 animate-spin" /> Sending…</>
                  ) : (
                    <><RefreshCw className="h-3 w-3" /> Resend code</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ── Registration Form ───────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <Link to="/">
            <div className="inline-flex items-center justify-center gap-2 text-primary hover:opacity-80 transition-opacity cursor-pointer">
              <Brain className="h-10 w-10" />
              <span className="text-2xl font-bold font-display">MindMate</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold font-display">Create your account</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>Enter your details to get started.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                {formError && (
                  <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                    <span className="font-semibold">Error:</span> {formError}
                  </div>
                )}

                {/* Profile Picture */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Profile Photo (optional)</h3>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className="h-20 w-20 border-2 border-border">
                        <AvatarImage src={profilePicture} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">{initials}</AvatarFallback>
                      </Avatar>
                      <button
                        type="button"
                        onClick={() => profilePicRef.current?.click()}
                        className="absolute bottom-0 right-0 rounded-full bg-primary text-primary-foreground p-1.5 shadow"
                      >
                        <Camera className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="space-y-1">
                      <input ref={profilePicRef} type="file" accept="image/*" className="hidden" onChange={handleProfilePicUpload} />
                      <Button type="button" variant="outline" size="sm" onClick={() => profilePicRef.current?.click()} disabled={uploadingProfile} className="gap-2">
                        {uploadingProfile ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
                        {uploadingProfile ? "Uploading..." : "Upload Photo"}
                      </Button>
                      <p className="text-xs text-muted-foreground">JPG, PNG, max 5MB</p>
                    </div>
                  </div>
                </div>

                {/* Account Info */}
                <div className="space-y-4 border-t pt-4">
                  <h3 className="text-lg font-semibold">Account Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl><Input type="email" placeholder="john@example.com" data-testid="input-email" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="password" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl><Input type="password" placeholder="••••••••" data-testid="input-password" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="role" render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>I am a...</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(val) => { field.onChange(val); setRole(val as "patient" | "doctor"); }}
                          defaultValue={field.value}
                          className="flex flex-col sm:flex-row gap-4"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="patient" data-testid="radio-patient" /></FormControl>
                            <FormLabel className="font-normal cursor-pointer">Patient (seeking care)</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="doctor" data-testid="radio-doctor" /></FormControl>
                            <FormLabel className="font-normal cursor-pointer">Doctor (providing care)</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                {/* Profile Details */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-semibold">Profile Details</h3>

                  <FormField control={form.control} name="fullName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl><Input placeholder="John Doe" data-testid="input-fullname" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  {role === "patient" && (
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="age" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age</FormLabel>
                          <FormControl><Input type="number" placeholder="25" data-testid="input-age" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="gender" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-gender"><SelectValue placeholder="Select gender" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="contactNumber" render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Contact Number</FormLabel>
                          <FormControl><Input placeholder="+1 234 567 8900" data-testid="input-contact" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                  )}

                  {role === "doctor" && (
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="specialization" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Specialization</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-specialization"><SelectValue placeholder="Select specialization" /></SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Psychiatrist">Psychiatrist</SelectItem>
                                <SelectItem value="Psychologist">Psychologist</SelectItem>
                                <SelectItem value="Therapist">Therapist</SelectItem>
                                <SelectItem value="Counselor">Counselor</SelectItem>
                                <SelectItem value="General">General</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="licenseNumber" render={({ field }) => (
                          <FormItem>
                            <FormLabel>License Number <span className="text-destructive">*</span></FormLabel>
                            <FormControl><Input placeholder="LIC-12345" data-testid="input-license" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="experience" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Years of Experience</FormLabel>
                            <FormControl><Input type="number" placeholder="5" data-testid="input-experience" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="consultationFee" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Consultation Fee (Rs.)</FormLabel>
                            <FormControl><Input type="number" placeholder="500" data-testid="input-fee" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>

                      <FormField control={form.control} name="bio" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio / About (optional)</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Tell patients about your expertise and approach..." rows={3} data-testid="textarea-bio" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <div className="space-y-2">
                        <p className="text-sm font-medium">License Document (optional)</p>
                        <input ref={licensePicRef} type="file" accept="image/*" className="hidden" onChange={handleLicensePicUpload} />
                        <div className="flex items-center gap-3">
                          <Button type="button" variant="outline" size="sm" onClick={() => licensePicRef.current?.click()} disabled={uploadingLicense} className="gap-2">
                            {uploadingLicense ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
                            {uploadingLicense ? "Uploading..." : "Upload License"}
                          </Button>
                          {licensePicture && <span className="text-xs text-green-600">✓ License uploaded</span>}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Button type="submit" className="w-full" data-testid="button-create-account" disabled={isRegistering || uploadingProfile || uploadingLicense}>
                  {isRegistering ? (
                    <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Creating Account…</>
                  ) : (
                    "Create Account"
                  )}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
                </p>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}