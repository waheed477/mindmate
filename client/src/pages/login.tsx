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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const { login, isLoggingIn } = useAuth();
  
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(data: LoginForm) {
    login(data);
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: Form */}
      <div className="flex flex-col justify-center items-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <Link href="/">
              <div className="inline-flex items-center justify-center gap-2 text-primary mb-8 hover:opacity-80 transition-opacity cursor-pointer">
                <Brain className="h-10 w-10" />
                <span className="text-2xl font-bold font-display">MindMate</span>
              </div>
            </Link>
            <h1 className="text-3xl font-bold font-display tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground">Enter your credentials to access your account</p>
          </div>

          <Card className="border-0 shadow-none sm:border sm:shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Sign in</CardTitle>
              <CardDescription>
                Enter your username and password below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your username" {...field} />
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
                  <Button type="submit" className="w-full" disabled={isLoggingIn}>
                    {isLoggingIn ? "Signing in..." : "Sign in"}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
              <div>
                Don't have an account?{" "}
                <Link href="/register">
                  <span className="text-primary hover:underline font-medium cursor-pointer">Sign up</span>
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Right: Image */}
      <div className="hidden lg:block relative bg-primary/5 overflow-hidden">
        {/* Abstract calming pattern */}
        <div className="absolute inset-0 bg-primary/10 backdrop-blur-3xl" />
        <div className="absolute inset-0 flex items-center justify-center p-12 text-primary-foreground">
           {/* Unsplash image of calming nature or doctor */}
           {/* nature calming water */}
           <img 
             src="https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?q=80&w=2070&auto=format&fit=crop" 
             alt="Calming water" 
             className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
           />
           <div className="relative z-10 max-w-lg text-primary text-center space-y-4">
             <h2 className="text-4xl font-bold font-display">Your Mental Health Matters</h2>
             <p className="text-xl opacity-90">Join a supportive community where healing begins with connection.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
