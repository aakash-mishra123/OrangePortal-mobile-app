import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { useEffect } from "react";
// Service type definition
interface Service {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  categoryId: string;
  hourlyRate: number;
  monthlyRate?: number;
  features: string[];
  technologies?: string[];
  imageUrl?: string;
  slug?: string;
}
import { Link } from "wouter";
import { ChevronRight, Home, Check, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// Activity tracking function
const trackUserActivity = (data: any) => {
  fetch('/api/activities', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).catch(console.error);
};
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-96 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl p-8 shadow-sm">
                  <div className="w-full h-64 bg-gray-300 rounded-lg mb-6 animate-pulse"></div>
                  <div className="h-8 bg-gray-300 rounded w-3/4 mb-4 animate-pulse"></div>
                  <div className="h-6 bg-gray-300 rounded w-1/2 mb-6 animate-pulse"></div>
                  <div className="space-y-3 mb-8">
                    <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-4 animate-pulse"></div>
                  <div className="space-y-4">
                    <div className="h-12 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-12 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-12 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-20 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-12 bg-gray-300 rounded animate-pulse"></div>
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

  const categoryName = service.categoryId.split('-').map((word: string) => 
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
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <Card className="overflow-hidden shadow-xl animate-in slide-in-from-left-6 duration-500">
              <CardContent className="p-0">
                <div className="relative">
                  <img 
                    src={service.imageUrl || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop"}
                    alt={service.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-6 text-white">
                    <h1 className="text-3xl font-bold mb-2">{service.title}</h1>
                    <p className="text-lg opacity-90">{service.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Description */}
            <Card className="shadow-lg animate-in slide-in-from-left-8 duration-700">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-blue-800 mb-6">About This Service</h2>
                <p className="text-gray-700 text-lg leading-relaxed mb-8">
                  {service.longDescription || service.description}
                </p>

                {/* Key Features */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-blue-700 mb-6 flex items-center">
                    <Check className="h-6 w-6 text-green-500 mr-2" />
                    Key Features & Benefits
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.features.map((feature: string, index: number) => (
                      <li 
                        key={index} 
                        className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg animate-in slide-in-from-left-4 duration-500"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technologies Used */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-blue-700 mb-6">Technologies & Tools</h3>
                  <div className="flex flex-wrap gap-3">
                    {service.technologies?.map((tech: string, index: number) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="text-sm px-4 py-2 bg-blue-100 text-blue-800 hover:bg-blue-200 transform hover:scale-105 transition-all duration-200"
                        style={{ 
                          animationDelay: `${index * 50}ms`,
                          animation: 'slideInFromBottom 0.5s ease-out forwards'
                        }}
                      >
                        {tech}
                      </Badge>
                    )) || [
                      "React", "Node.js", "MongoDB", "TypeScript", "AWS"
                    ].map((tech: string, index: number) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="text-sm px-4 py-2 bg-blue-100 text-blue-800 hover:bg-blue-200 transform hover:scale-105 transition-all duration-200"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Pricing Info */}
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200">
                  <h3 className="text-xl font-semibold text-orange-800 mb-4">Investment Details</h3>
                  <div className="flex items-center space-x-6">
                    <div>
                      <div className="text-3xl font-bold text-orange-600">
                        ₹{service.hourlyRate.toLocaleString()}
                      </div>
                      <div className="text-sm text-orange-700">per hour</div>
                    </div>
                    <div className="text-gray-400">or</div>
                    <div>
                      <div className="text-2xl font-bold text-orange-600">
                        ₹{(service.monthlyRate || service.hourlyRate * 160).toLocaleString()}
                      </div>
                      <div className="text-sm text-orange-700">monthly retainer</div>
                    </div>
                  </div>
                  <p className="text-sm text-orange-600 mt-4">
                    💡 Final pricing will be customized based on your specific requirements
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
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