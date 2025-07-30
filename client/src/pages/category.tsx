import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { type Service, type Category } from "@shared/schema";
import ServiceCard from "@/components/ui/service-card";
import { Link } from "wouter";
import { ChevronRight, Home } from "lucide-react";

export default function Category() {
  const [, params] = useRoute("/category/:slug");
  const slug = params?.slug;

  const { data: category } = useQuery<Category>({
    queryKey: [`/api/categories/${slug}`],
    enabled: false, // We'll get this from services query for now
  });

  const { data: services, isLoading, error } = useQuery<Service[]>({
    queryKey: ["/api/services", { category: slug }],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/services?category=${slug}`);
        if (!response.ok) {
          console.error(`Services fetch failed: ${response.status}`);
          return [];
        }
        return response.json();
      } catch (err) {
        console.error('Services fetch error:', err);
        return [];
      }
    },
    retry: 1,
    staleTime: 300000 // 5 minutes
  });

  // Get category info from first service
  const categoryInfo = services?.[0] ? {
    name: services[0].categoryId.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' '),
    description: `Professional ${services[0].categoryId.replace('-', ' ')} services for your business needs`
  } : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-64 mb-8"></div>
            <div className="h-8 bg-gray-300 rounded w-96 mb-4"></div>
            <div className="h-6 bg-gray-300 rounded w-full max-w-3xl mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="w-full h-48 bg-gray-300 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-16 bg-gray-300 rounded w-full mb-4"></div>
                  <div className="h-10 bg-gray-300 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!services || services.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h1>
            <p className="text-gray-600 mb-8">The requested category could not be found.</p>
            <Link href="/" className="text-om-orange hover:underline">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-om-gray-500 hover:text-om-orange flex items-center">
                <Home className="h-4 w-4" />
              </Link>
            </li>
            <li>
              <ChevronRight className="h-4 w-4 text-om-gray-400" />
            </li>
            <li className="text-om-blue font-medium">
              {categoryInfo?.name || 'Category'}
            </li>
          </ol>
        </nav>

        <div className="mb-8 sm:mb-12 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            {categoryInfo?.name || 'Services'}
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto sm:mx-0">
            {categoryInfo?.description || 'Professional services tailored to your business needs.'}
          </p>
        </div>

        {/* Services Grid */}
        {/* Running Message */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 sm:p-4 rounded-2xl shadow-lg mb-8 animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-sm sm:text-base font-medium text-center">
              ⚡ Get instant consultation • 1000+ projects delivered • Expert team available 24/7
            </span>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {services.map((service, index) => (
            <div 
              key={service.id}
              className="animate-bounce-slow transform transition-all duration-300 hover:scale-105"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <ServiceCard service={service} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
