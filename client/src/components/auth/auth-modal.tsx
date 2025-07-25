import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { X } from "lucide-react";

const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  mobile: z.string().min(10, "Please enter a valid mobile number"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type SignupFormData = z.infer<typeof signupSchema>;
type LoginFormData = z.infer<typeof loginSchema>;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoginMode, setIsLoginMode] = useState(false);
  
  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const signupMutation = useMutation({
    mutationFn: async (data: SignupFormData) => {
      const response = await apiRequest('POST', '/api/auth/register', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Account created successfully!",
        description: "Welcome to OrangeMantra. You can now enjoy personalized service recommendations.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      signupForm.reset();
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Signup failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await apiRequest('POST', '/api/auth/login', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Login successful!",
        description: "Welcome back to OrangeMantra.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      loginForm.reset();
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Login failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSignup = (data: SignupFormData) => {
    signupMutation.mutate(data);
  };

  const handleLogin = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const handleSkip = () => {
    toast({
      title: "Continue as guest",
      description: "You can sign up anytime to track your service preferences.",
    });
    onClose();
  };

  const switchMode = () => {
    setIsLoginMode(!isLoginMode);
    signupForm.reset();
    loginForm.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              {isLoginMode ? "Welcome Back" : "Create Your Account"}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {isLoginMode 
              ? "Sign in to your OrangeMantra account to continue."
              : "Join OrangeMantra to get personalized service recommendations and track your project inquiries."
            }
          </p>
        </DialogHeader>

        <div className="mt-4">
          {isLoginMode ? (
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
              <div>
                <Label htmlFor="login-email">Email Address</Label>
                <Input
                  id="login-email"
                  type="email"
                  {...loginForm.register("email")}
                  placeholder="john@example.com"
                  className="mt-1"
                />
                {loginForm.formState.errors.email && (
                  <p className="text-sm text-red-600 mt-1">{loginForm.formState.errors.email.message}</p>
                )}
              </div>

              <div className="flex flex-col space-y-3 pt-4">
                <Button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  {loginMutation.isPending ? "Signing In..." : "Sign In"}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSkip}
                  className="w-full"
                >
                  Skip for now
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    {...signupForm.register("firstName")}
                    placeholder="John"
                    className="mt-1"
                  />
                  {signupForm.formState.errors.firstName && (
                    <p className="text-sm text-red-600 mt-1">{signupForm.formState.errors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    {...signupForm.register("lastName")}
                    placeholder="Doe"
                    className="mt-1"
                  />
                  {signupForm.formState.errors.lastName && (
                    <p className="text-sm text-red-600 mt-1">{signupForm.formState.errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  {...signupForm.register("email")}
                  placeholder="john@example.com"
                  className="mt-1"
                />
                {signupForm.formState.errors.email && (
                  <p className="text-sm text-red-600 mt-1">{signupForm.formState.errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input
                  id="mobile"
                  {...signupForm.register("mobile")}
                  placeholder="+1 (555) 123-4567"
                  className="mt-1"
                />
                {signupForm.formState.errors.mobile && (
                  <p className="text-sm text-red-600 mt-1">{signupForm.formState.errors.mobile.message}</p>
                )}
              </div>

              <div className="flex flex-col space-y-3 pt-4">
                <Button
                  type="submit"
                  disabled={signupMutation.isPending}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  {signupMutation.isPending ? "Creating Account..." : "Create Account"}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSkip}
                  className="w-full"
                >
                  Skip for now
                </Button>
              </div>
            </form>
          )}

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={switchMode}
              className="text-sm text-orange-600 hover:underline cursor-pointer"
            >
              {isLoginMode 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"
              }
            </button>
          </div>

          {!isLoginMode && (
            <p className="text-xs text-center text-gray-500 mt-4">
              By creating an account, you agree to our{" "}
              <span className="text-orange-600 cursor-pointer hover:underline">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-orange-600 cursor-pointer hover:underline">
                Privacy Policy
              </span>
              .
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}