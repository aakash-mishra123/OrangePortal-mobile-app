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
import ProjectDetailsForm from "@/components/ui/project-details-form";
import { resourceTypes } from "@/components/ui/resource-selector";
import { apiRequest } from "@/lib/queryClient";

export default function ServiceDetail() {
  const [, params] = useRoute("/service/:slug");
  const slug = params?.slug;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedResource, setSelectedResource] = useState<string | null>(null);
  const [showProjectForm, setShowProjectForm] = useState(false);

  const { data: service, isLoading } = useQuery<Service>({
    queryKey: [`/api/service/${slug}`],
    queryFn: async () => {
      const response = await fetch(`/api/service/${slug}`);
      if (!response.ok) {
        throw new Error('Failed to fetch service');
      }
      return response.json();
    }
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
      return await apiRequest("/api/leads", "POST", leadData);
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
    if (!service || !selectedResource) return;

    const selectedResourceData = resourceTypes.find(r => r.id === selectedResource);
    if (!selectedResourceData) return;

    const leadData = {
      serviceId: service.id,
      serviceName: service.title,
      resourceType: selectedResourceData.title,
      ...projectData
    };

    leadMutation.mutate(leadData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-96 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl p-8 shadow-sm">
                  <div className="w-full h-64 bg-gray-300 rounded-lg mb-6"></div>
                  <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="h-6 bg-gray-300 rounded w-1/2 mb-6"></div>
                  <div className="space-y-3 mb-8">
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Service Header */}
            <Card className="animate-in slide-in-from-left-6 duration-700">
              <CardContent className="p-8">
                <div className="mb-6">
                  <img 
                    src={service.imageUrl} 
                    alt={service.title}
                    className="w-full h-64 object-cover rounded-lg shadow-md"
                  />
                </div>
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-3xl font-bold text-gray-800">{service.title}</h1>
                  <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">
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
            <div className="sticky top-8 space-y-6">
              {!showProjectForm ? (
                /* Resource Selection */
                <Card className="animate-in slide-in-from-right-6 duration-700">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-gray-800">Get Started</CardTitle>
                    <p className="text-gray-600">Select the type of resource you need for your project</p>
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
                    <ProjectDetailsForm
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