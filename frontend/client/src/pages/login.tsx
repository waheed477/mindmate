import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@hooks/use-auth";
import { Link } from "react-router-dom";
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
import { Brain, User, Stethoscope } from "lucide-react";
import { useState } from "react";

const loginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const { login, isLoggingIn } = useAuth();
  const [userType, setUserType] = useState<"patient" | "doctor">("patient");
  
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: LoginForm) {
    console.log("Login form submitted:", data);
    console.log("User type selected:", userType);
    
    // Pass userType to login function for better UX
    login({
      ...data,
      userType // This helps with UI feedback
    });
  }

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
              <CardDescription>
                Choose your role and enter credentials
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* User Type Tabs */}
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

              {/* Login Form */}
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
                          <Input type="password" placeholder="Enter your password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Login Button with User Type */}
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? (
                      "Signing in..."
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        {userType === "patient" ? (
                          <>
                            <User className="h-4 w-4" />
                            <span>Sign in as Patient</span>
                          </>
                        ) : (
                          <>
                            <Stethoscope className="h-4 w-4" />
                            <span>Sign in as Doctor</span>
                          </>
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
              
              {/* Password Reset Link (Optional) */}
              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  Forgot your password?{" "}
                  <Link to="/forgot-password">
                    <span className="text-primary hover:underline cursor-pointer">
                      Reset it here
                    </span>
                  </Link>
                </p>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Right: Image - Changes based on user type */}
      <div className="hidden lg:block relative overflow-hidden">
        <div className={`absolute inset-0 backdrop-blur-3xl transition-colors duration-300 ${
          userType === "patient" ? "bg-blue-50/30" : "bg-green-50/30"
        }`} />
        
        {/* Patient Image */}
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
                <div className="pt-4">
                  <ul className="text-left text-gray-600 space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      <span>Schedule appointments</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      <span>Access therapy resources</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      <span>Track your progress</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* Doctor Image */}
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
                <div className="pt-4">
                  <ul className="text-left text-gray-600 space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span>Manage appointments</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span>Access patient records</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span>Provide consultations</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}