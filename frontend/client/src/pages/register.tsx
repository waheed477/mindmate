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
import { Brain, Camera, Upload, Loader2 } from "lucide-react";
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

export default function Register() {
  const { register, isRegistering } = useAuth();
  const [role, setRole] = useState<"patient" | "doctor">("patient");
  const [profilePicture, setProfilePicture] = useState("");
  const [licensePicture, setLicensePicture] = useState("");
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingLicense, setUploadingLicense] = useState(false);
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
      age: undefined,
      gender: "",
      contactNumber: "",
      specialization: "",
      licenseNumber: "",
      experience: undefined,
      consultationFee: undefined,
      bio: "",
    },
  });

  const watchedName = form.watch("fullName");
  const initials = watchedName?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "?";

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
    const payload = {
      email: data.email,
      password: data.password,
      name: data.fullName,
      role: data.role,
      profilePicture: profilePicture || undefined,
      ...(data.role === "doctor" ? {
        specialization: data.specialization,
        licenseNumber: data.licenseNumber,
        experience: Number(data.experience) || undefined,
        consultationFee: Number(data.consultationFee) || undefined,
        bio: data.bio || undefined,
        licensePicture: licensePicture || undefined,
      } : {
        age: Number(data.age) || undefined,
        gender: data.gender || undefined,
        contactNumber: data.contactNumber || undefined,
      }),
    };

    register(payload)
      .then(() => {
        alert("✅ Registration successful! Please log in.");
        navigate("/login");
      })
      .catch((error) => {
        console.error("Registration failed:", error);
      });
  }

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
                        <FormControl><Input type="email" placeholder="john@example.com" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="password" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
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
                            <FormControl><RadioGroupItem value="patient" /></FormControl>
                            <FormLabel className="font-normal cursor-pointer">Patient (seeking care)</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="doctor" /></FormControl>
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
                      <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  {role === "patient" && (
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="age" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age</FormLabel>
                          <FormControl><Input type="number" placeholder="25" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="gender" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
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
                          <FormControl><Input placeholder="+1 234 567 8900" {...field} /></FormControl>
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
                                <SelectTrigger><SelectValue placeholder="Select specialization" /></SelectTrigger>
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
                            <FormControl><Input placeholder="LIC-12345" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="experience" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Years of Experience</FormLabel>
                            <FormControl><Input type="number" placeholder="5" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="consultationFee" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Consultation Fee (Rs.)</FormLabel>
                            <FormControl><Input type="number" placeholder="500" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>

                      <FormField control={form.control} name="bio" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio / About (optional)</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Tell patients about your expertise and approach..." rows={3} {...field} />
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

                <Button type="submit" className="w-full" disabled={isRegistering || uploadingProfile || uploadingLicense}>
                  {isRegistering ? "Creating Account..." : "Create Account"}
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
