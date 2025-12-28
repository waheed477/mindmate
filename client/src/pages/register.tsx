import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Brain } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";

// This schema handles both patient and doctor basic registration
// Real apps would likely split this into multi-step forms
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["patient", "doctor"]),
  
  // Patient fields (conditionally required based on logic, but optional in schema for simplicity)
  fullName: z.string().min(2, "Full Name is required"),
  age: z.coerce.number().min(18, "Must be at least 18"),
  gender: z.string().min(1, "Gender is required"),
  contactNumber: z.string().min(10, "Valid contact number required"),
  
  // Doctor specific
  specialization: z.string().optional(),
  licenseNumber: z.string().optional(),
  experience: z.coerce.number().optional(),
  consultationFee: z.coerce.number().optional(),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const { register, isRegistering } = useAuth();
  const [role, setRole] = useState<"patient" | "doctor">("patient");

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      role: "patient",
      fullName: "",
      age: undefined,
      gender: "",
      contactNumber: "",
      // Doctor defaults
      specialization: "",
      licenseNumber: "",
      experience: undefined,
      consultationFee: undefined,
    },
  });

  function onSubmit(data: RegisterForm) {
    const payload: any = {
      username: data.username,
      password: data.password,
      role: data.role,
    };

    if (data.role === "patient") {
      payload.patientData = {
        fullName: data.fullName,
        age: Number(data.age),
        gender: data.gender,
        contactNumber: data.contactNumber,
      };
    } else {
      payload.doctorData = {
        fullName: data.fullName,
        specialization: data.specialization!,
        licenseNumber: data.licenseNumber!,
        experience: Number(data.experience!),
        consultationFee: Number(data.consultationFee!),
        // Minimal default availability
        availability: [{
            day: "Monday",
            startTime: "09:00",
            endTime: "17:00",
            isAvailable: true
        }]
      };
    }

    register(payload);
  }

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <Link href="/">
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
                
                {/* Account Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Account Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="johndoe" {...field} />
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
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>I am a...</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(val) => {
                                field.onChange(val);
                                setRole(val as "patient" | "doctor");
                            }}
                            defaultValue={field.value}
                            className="flex flex-col sm:flex-row gap-4"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="patient" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                Patient (seeking care)
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="doctor" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                Doctor (providing care)
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Profile Info */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-semibold">Profile Details</h3>
                  
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {role === 'patient' && (
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Age</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="25" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="contactNumber"
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormLabel>Contact Number</FormLabel>
                            <FormControl>
                              <Input placeholder="+1 234 567 8900" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {role === 'doctor' && (
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="specialization"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Specialization</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select specialization" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Psychiatrist">Psychiatrist</SelectItem>
                                <SelectItem value="Psychologist">Psychologist</SelectItem>
                                <SelectItem value="Therapist">Therapist</SelectItem>
                                <SelectItem value="Counselor">Counselor</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="licenseNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>License Number</FormLabel>
                            <FormControl>
                              <Input placeholder="LIC-12345" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="experience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Years of Experience</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="5" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="consultationFee"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Consultation Fee ($)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="100" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isRegistering}>
                  {isRegistering ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
