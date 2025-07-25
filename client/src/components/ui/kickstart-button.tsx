import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Rocket, CheckCircle2, Clock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

// API request function
const apiRequest = async (url: string, method: string = 'GET', data?: any) => {
  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: data ? JSON.stringify(data) : undefined,
  });
  
  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
  
  return response.json();
};

interface KickstartButtonProps {
  service: {
    id: string;
    title: string;
    hourlyRate: number;
  };
}

export default function KickstartButton({ service }: KickstartButtonProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const queryClient = useQueryClient();

  const kickstartMutation = useMutation({
    mutationFn: async () => {
      if (!isAuthenticated || !user) {
        throw new Error('Please log in to kickstart your project');
      }

      return apiRequest('/api/leads', 'POST', {
        name: user.name || 'User',
        email: user.email,
        phone: '+91-XXXXXXXXXX',
        projectBrief: `Quick kickstart request for ${service.title}`,
        budget: "Will discuss during call",
        serviceId: service.id,
        serviceName: service.title
      });
    },
    onSuccess: () => {
      setIsSubmitted(true);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/leads'] });
      toast({
        title: "Project Kickstarted! 🚀",
        description: "Our manager will contact you within 5 minutes to discuss your project.",
        duration: 5000,
      });
    },
    onError: (error: any) => {
      console.error('Kickstart error:', error);
      if (error.message.includes('log in')) {
        window.location.href = '/';
      } else {
        toast({
          title: "Something went wrong",
          description: "Please try again or contact support.",
          variant: "destructive",
        });
      }
    },
  });

  const handleKickstart = () => {
    if (!isAuthenticated) {
      toast({
        title: "Please log in first",
        description: "You need to be logged in to kickstart a project.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
      return;
    }
    
    kickstartMutation.mutate();
  };

  if (isSubmitted) {
    return (
      <Card className="border-green-200 bg-green-50 animate-in slide-in-from-bottom-4 duration-500">
        <CardContent className="p-6 text-center">
          <div className="mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto animate-in zoom-in-50 duration-700" />
          </div>
          <h3 className="text-xl font-semibold text-green-800 mb-2">
            Project Kickstarted Successfully! 🎉
          </h3>
          <p className="text-green-700 mb-4">
            Our expert manager will contact you within the next 5 minutes to discuss your project requirements and next steps.
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-green-600">
            <Clock className="h-4 w-4" />
            <span>Expected call time: 2-5 minutes</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 animate-in slide-in-from-right-4 duration-500">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <div className="mb-4">
            <Rocket className="h-12 w-12 text-orange-500 mx-auto animate-bounce" />
          </div>
          <h3 className="text-2xl font-bold text-orange-800 mb-2">
            Ready to Kickstart?
          </h3>
          <p className="text-orange-700 mb-4">
            Get your {service.title} project started in just 1 click!
          </p>
          
          <div className="bg-orange-100 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-4 text-sm text-orange-700">
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>Expert Assigned</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>5 Min Response</span>
              </div>
            </div>
          </div>
          
          <div className="text-3xl font-bold text-orange-600 mb-2">
            ₹{service.hourlyRate.toLocaleString()}/hour
          </div>
          <p className="text-sm text-orange-600">Starting rate - Final pricing discussed during call</p>
        </div>

        <Button 
          onClick={handleKickstart}
          disabled={kickstartMutation.isPending}
          className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-3 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          {kickstartMutation.isPending ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Kickstarting...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Rocket className="h-5 w-5" />
              <span>Kickstart My Project Now!</span>
            </div>
          )}
        </Button>
        
        <p className="text-xs text-center text-orange-600 mt-3">
          ⚡ Our manager will call you within 5 minutes to discuss your project
        </p>
      </CardContent>
    </Card>
  );
}