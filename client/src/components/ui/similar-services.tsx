import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star } from "lucide-react";

interface SimilarServicesProps {
  currentServiceId: string;
  categoryId: string;
}

export default function SimilarServices({ currentServiceId, categoryId }: SimilarServicesProps) {
  const { data: services = [], isLoading } = useQuery({
    queryKey: ['/api/services'],
    queryFn: async () => {
      const response = await fetch('/api/services');
      if (!response.ok) throw new Error('Failed to fetch services');
      return response.json();
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-24"></div>
          </div>
        ))}
      </div>
    );
  }

  // Filter similar services (same category, exclude current service)
  const similarServices = services
    .filter((service: any) => 
      service.categoryId === categoryId && 
      service.id !== currentServiceId
    )
    .slice(0, 3);

  if (similarServices.length === 0) {
    // If no services in same category, show popular services
    const popularServices = services
      .filter((service: any) => service.id !== currentServiceId)
      .slice(0, 3);
    
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <Star className="h-4 w-4 text-yellow-500" />
          <span className="text-sm font-medium text-gray-600">Popular Services</span>
        </div>
        {popularServices.map((service: any, index: number) => (
          <SimilarServiceCard key={service.id} service={service} index={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {similarServices.map((service: any, index: number) => (
        <SimilarServiceCard key={service.id} service={service} index={index} />
      ))}
    </div>
  );
}

function SimilarServiceCard({ service, index }: { service: any; index: number }) {
  return (
    <Card 
      className="group hover:shadow-md transition-all duration-300 cursor-pointer transform hover:-translate-y-1 animate-in slide-in-from-right-4 duration-500 border hover:border-orange-200"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800 text-sm group-hover:text-orange-600 transition-colors duration-200 line-clamp-2">
              {service.title}
            </h4>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
              {service.description.substring(0, 80)}...
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm">
            <span className="font-semibold text-orange-600">
              ₹{service.hourlyRate?.toLocaleString() || '1,250'}/hr
            </span>
          </div>
          <Badge variant="outline" className="text-xs">
            {service.features?.[0] || 'Premium'}
          </Badge>
        </div>
        
        <Button 
          asChild 
          variant="outline" 
          size="sm" 
          className="w-full group-hover:bg-orange-50 group-hover:border-orange-200 group-hover:text-orange-600 transition-all duration-200"
        >
          <Link href={`/service/${service.slug || service.id}`}>
            <span className="flex items-center justify-center space-x-1">
              <span>View Details</span>
              <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform duration-200" />
            </span>
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}