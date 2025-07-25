import { type Service } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
      <img 
        src={service.imageUrl} 
        alt={service.title}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />
      
      <h3 className="text-xl font-semibold text-om-blue mb-2">{service.title}</h3>
      <p className="text-om-gray-500 mb-4">{service.description}</p>
      
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm">
          <span className="text-om-orange font-semibold">
            ₹{service.hourlyRate.toLocaleString()}/hour
          </span>
          <span className="text-om-gray-400 ml-2">
            or ₹{service.monthlyRate.toLocaleString()}/month
          </span>
        </div>
      </div>
      
      <Button asChild className="w-full bg-om-orange text-white hover:bg-orange-600 transition-colors font-medium">
        <Link href={`/service/${service.slug}`}>
          View Details
        </Link>
      </Button>
    </div>
  );
}
