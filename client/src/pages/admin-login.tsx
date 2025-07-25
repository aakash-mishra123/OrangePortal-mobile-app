import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Shield, Lock, User, ArrowLeft } from "lucide-react";

const adminLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type AdminLoginData = z.infer<typeof adminLoginSchema>;

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<AdminLoginData>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: AdminLoginData) => {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Login Successful",
        description: "Welcome to the admin dashboard!",
      });
      setLocation("/admin");
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: AdminLoginData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-600/20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-indigo-600/20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full bg-purple-600/10 animate-ping" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md animate-in slide-in-from-bottom-8 duration-700">
        {/* Back Button */}
        <div className="mb-6">
          <Button 
            asChild 
            variant="ghost" 
            className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            <Link href="/home">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center animate-in zoom-in-50 duration-1000">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-white mb-2">
              Admin Access
            </CardTitle>
            <CardDescription className="text-white/70">
              Secure login for AppKickstart administrators
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/90 font-medium">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                          <Input
                            type="email"
                            placeholder="admin@appkickstart.com"
                            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 focus:border-white/40 transition-all duration-200"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-300" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/90 font-medium">
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                          <Input
                            type="password"
                            placeholder="Enter your password"
                            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 focus:border-white/40 transition-all duration-200"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-300" />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  disabled={loginMutation.isPending}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold py-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  {loginMutation.isPending ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4" />
                      <span>Access Admin Panel</span>
                    </div>
                  )}
                </Button>
              </form>
            </Form>

            <div className="text-center">
              <p className="text-white/60 text-sm">
                Authorized personnel only. All access is logged and monitored.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
          <h3 className="text-white font-medium mb-2">Demo Access:</h3>
          <p className="text-white/70 text-sm">Email: admin@appkickstart.com</p>
          <p className="text-white/70 text-sm">Password: admin123</p>
        </div>
      </div>
    </div>
  );
}