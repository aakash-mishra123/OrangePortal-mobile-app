import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { useEffect, useState } from "react";
import { type Service } from "@shared/schema";
import { Link } from "wouter";
import { ChevronRight, Home, ArrowLeft, Star, Clock, Shield, Trophy, Users, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { trackUserActivity } from "@/lib/activityTracker";
import AchievementCards from "@/components/ui/achievement-cards";
import ResourceSelector from "@/components/ui/resource-selector";
import InteractiveStepperForm from "@/components/ui/interactive-stepper-form";
import { resourceTypes } from "@/components/ui/resource-selector";
import { apiRequest } from "@/lib/queryClient";

export default function ServiceDetail() {
  const [, params] = useRoute("/service/:slug");
  const slug = params?.slug;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedResource, setSelectedResource] = useState<string | null>(null);
  const [showProjectForm, setShowProjectForm] = useState(false);

  const { data: service, isLoading, error } = useQuery<Service>({
    queryKey: [`/api/service/${slug}`],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/service/${slug}`);
        if (!response.ok) {
          console.error(`Service fetch failed: ${response.status}`);
          return null;
        }
        return response.json();
      } catch (err) {
        console.error('Service fetch error:', err);
        return null;
      }
    },
    retry: 1,
    staleTime: 300000 // 5 minutes
  });

  // Track service view activity
  useEffect(() => {
    if (service) {
      trackUserActivity({
        activityType: 'service_view',
        serviceId: service.id,
        metadata: {
          serviceTitle: service.title,
          categoryId: service.categoryId,
          viewedAt: new Date().toISOString()
        }
      });
    }
  }, [service]);

  const leadMutation = useMutation({
    mutationFn: async (leadData: any) => {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(leadData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Project Kickstarted! 🚀",
        description: "Your request has been submitted. Our expert will call you within 5 minutes!",
        duration: 5000,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      setSelectedResource(null);
      setShowProjectForm(false);
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit your request. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleResourceSelect = (resourceId: string) => {
    setSelectedResource(resourceId);
    setShowProjectForm(true);
  };

  const handleProjectSubmit = (projectData: any) => {
    try {
      if (!service || !selectedResource) {
        console.error('Missing service or resource data');
        return;
      }

      const selectedResourceData = resourceTypes.find(r => r.id === selectedResource);
      if (!selectedResourceData) {
        console.error('Resource not found');
        return;
      }

      const leadData = {
        serviceId: service.id,
        serviceName: service.title,
        resourceType: selectedResourceData.title,
        ...projectData
      };

      console.log('Submitting lead data:', leadData);
      leadMutation.mutate(leadData);
    } catch (error) {
      console.error('Project submission error:', error);
      toast({
        title: "Submission Error",
        description: "An error occurred while submitting your project. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-80 mb-12"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              <div className="lg:col-span-2">
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-10 shadow-xl border border-white/50">
                  <div className="w-full h-80 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl mb-8"></div>
                  <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-3/4 mb-6"></div>
                  <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/2 mb-8"></div>
                  <div className="space-y-4 mb-10">
                    <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-full"></div>
                    <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-full"></div>
                    <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-3/4"></div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="space-y-4">
                    <div className="h-12 bg-gray-300 rounded"></div>
                    <div className="h-12 bg-gray-300 rounded"></div>
                    <div className="h-12 bg-gray-300 rounded"></div>
                    <div className="h-20 bg-gray-300 rounded"></div>
                    <div className="h-12 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Service Not Found</h1>
          <p className="text-gray-600 mb-6">The service you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const selectedResourceData = selectedResource ? resourceTypes.find(r => r.id === selectedResource) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8 animate-in slide-in-from-left-4 duration-500">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            <Home className="h-4 w-4" />
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href={`/category/${service.categoryId}`} className="hover:text-blue-600 transition-colors">
            Category
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-800 font-medium">{service.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            {/* Running Message Banner */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-3 sm:p-4 rounded-2xl shadow-lg animate-in slide-in-from-top-4 duration-500">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-sm sm:text-base font-medium text-center">
                  🚀 Expert consultation available in 5 minutes • 500+ successful projects delivered • Get instant quote
                </span>
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Service Header */}
            <Card className="interactive-card animate-in slide-in-from-left-6 duration-700 hover-glow border-0 shadow-2xl">
              <CardContent className="p-4 sm:p-6 lg:p-8">
                <div className="mb-4 sm:mb-6 relative overflow-hidden rounded-xl">
                  <img 
                    src={service.imageUrl} 
                    alt={service.title}
                    className="w-full h-48 sm:h-56 lg:h-64 object-cover rounded-xl shadow-lg transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                    <div className="bg-white/90 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium text-gray-800 animate-bounce-slow">
                      🔥 Hot Service
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">{service.title}</h1>
                  <Badge className="bg-green-100 text-green-800 text-sm sm:text-base lg:text-lg px-3 py-1.5 sm:px-4 sm:py-2 self-start sm:self-auto">
                    Starting at ₹{service.hourlyRate}/hour
                  </Badge>
                </div>
                <p className="text-gray-600 text-lg mb-6">{service.description}</p>
                
                {/* Achievement Cards */}
                <AchievementCards />

                {/* Detailed Description */}
                <div className="prose max-w-none">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">About This Service</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">{service.longDescription}</p>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">What's Included</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 text-xs">✓</span>
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technologies */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Technologies We Use</h3>
                  <div className="flex flex-wrap gap-2">
                    {service.technologies.map((tech, index) => (
                      <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 lg:top-8 space-y-4 lg:space-y-6">
              {!showProjectForm ? (
                /* Resource Selection */
                <Card className="animate-in slide-in-from-right-6 duration-700 border-0 shadow-xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Get Started</CardTitle>
                    <p className="text-sm sm:text-base text-gray-600">Select the type of resource you need for your project</p>
                  </CardHeader>
                  <CardContent>
                    <ResourceSelector 
                      selectedResource={selectedResource}
                      onResourceSelect={handleResourceSelect}
                    />
                  </CardContent>
                </Card>
              ) : (
                /* Project Details Form */
                <div className="animate-in slide-in-from-right-6 duration-500">
                  <div className="mb-4">
                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        setShowProjectForm(false);
                        setSelectedResource(null);
                      }}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Resource Selection
                    </Button>
                  </div>
                  
                  {selectedResourceData && (
                    <InteractiveStepperForm
                      serviceId={service.id}
                      serviceName={service.title}
                      resourceType={selectedResource!}
                      resourceTitle={selectedResourceData.title}
                      hourlyRate={selectedResourceData.hourlyRate}
                      onSubmit={handleProjectSubmit}
                      isSubmitting={leadMutation.isPending}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}