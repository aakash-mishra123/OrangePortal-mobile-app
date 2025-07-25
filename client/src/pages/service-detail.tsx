import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { useEffect } from "react";
import { type Service } from "@shared/schema";
import { Link } from "wouter";
import { ChevronRight, Home, Check, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trackUserActivity } from "@/lib/activityTracker";
import KickstartButton from "@/components/ui/kickstart-button";
import SimilarServices from "@/components/ui/similar-services";

export default function ServiceDetail() {
  const [, params] = useRoute("/service/:slug");
  const slug = params?.slug;

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-om-gray-50">
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20 animate-in fade-in duration-500">
            <div className="mb-8">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto flex items-center justify-center mb-4">
                <span className="text-4xl">❓</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Service Not Found</h1>
            <p className="text-gray-600 mb-8 text-lg">The requested service could not be found.</p>
            <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white">
              <Link href="/home">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const categoryName = service.categoryId.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 animate-in slide-in-from-top-4 duration-300">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/home" className="text-gray-500 hover:text-orange-500 flex items-center transition-colors duration-200">
                <Home className="h-4 w-4" />
              </Link>
            </li>
            <li>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </li>
            <li>
              <Link 
                href={`/category/${service.categoryId}`}
                className="text-gray-500 hover:text-orange-500 transition-colors duration-200"
              >
                {categoryName}
              </Link>
            </li>
            <li>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </li>
            <li className="text-blue-600 font-medium">{service.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Service Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <img 
                src={service.imageUrl} 
                alt={service.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              
              <h1 className="text-3xl font-bold text-om-blue mb-4">{service.title}</h1>
              
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-2xl font-bold text-om-orange">
                  ₹{service.hourlyRate.toLocaleString()}/hour
                </span>
                <span className="text-lg text-om-gray-500">
                  or ₹{service.monthlyRate.toLocaleString()}/month
                </span>
              </div>

              <div className="prose max-w-none mb-8">
                <p className="text-lg text-om-gray-600 mb-4">
                  {service.description}
                </p>
                
                <p className="text-om-gray-600 mb-6">
                  {service.longDescription}
                </p>
              </div>

              {/* Key Features */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-om-blue mb-4">Key Features</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technologies Used */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-om-blue mb-4">Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                  {service.technologies.map((tech, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Kickstart Button */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <KickstartButton service={service} />
              
              {/* Similar Services */}
              <Card className="shadow-lg animate-in slide-in-from-right-6 duration-700">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4">Similar Services</h3>
                  <SimilarServices currentServiceId={service.id} categoryId={service.categoryId} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
