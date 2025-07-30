import { type Service } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-4 sm:p-6 hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-300 group hover:-translate-y-2 hover:border-blue-200">
      <div className="relative overflow-hidden rounded-xl mb-4">
        <img 
          src={service.imageUrl} 
          alt={service.title}
          className="w-full h-40 sm:h-48 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          🔥 Popular
        </div>
      </div>
      
      <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 group-hover:from-orange-500 group-hover:to-red-500 transition-all duration-300">
        {service.title}
      </h3>
      <p className="text-gray-600 mb-4 text-sm sm:text-base line-clamp-2">{service.description}</p>
      
      <div className="mb-4">
        <div className="text-xs sm:text-sm">
          <span className="text-orange-600 font-bold text-base sm:text-lg">
            ₹{service.hourlyRate.toLocaleString()}/hour
          </span>
          <span className="text-gray-400 ml-2 block sm:inline">
            or ₹{service.monthlyRate.toLocaleString()}/month
          </span>
        </div>
      </div>
      
      <Button asChild className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-medium rounded-xl shadow-lg hover:shadow-orange-200 transform hover:scale-105">
        <Link href={`/service/${service.slug}`}>
          View Details
        </Link>
      </Button>
    </div>
  );
}
