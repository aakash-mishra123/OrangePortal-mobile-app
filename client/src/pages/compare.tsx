import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { type Service } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, X, Plus, Minus } from "lucide-react";
import { Link } from "wouter";

export default function Compare() {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const addService = (serviceId: string) => {
    if (selectedServices.length < 3 && !selectedServices.includes(serviceId)) {
      setSelectedServices([...selectedServices, serviceId]);
    }
  };

  const removeService = (serviceId: string) => {
    setSelectedServices(selectedServices.filter(id => id !== serviceId));
  };

  const selectedServiceDetails = selectedServices.map(id =>
    services?.find(service => service.id === id)
  ).filter(Boolean) as Service[];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-om-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="h-64 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-om-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-om-blue mb-2">Compare Services</h1>
          <p className="text-om-gray-500">
            Compare up to 3 services side by side to find the best fit for your project
          </p>
        </div>

        {/* Service Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-om-blue">Select Services to Compare</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-om-gray-600 w-20">
                    Service {index + 1}:
                  </span>
                  {selectedServices[index] ? (
                    <div className="flex items-center space-x-2 flex-1">
                      <Badge variant="secondary" className="px-3 py-1">
                        {services?.find(s => s.id === selectedServices[index])?.title}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeService(selectedServices[index])}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Select value="" onValueChange={(value) => addService(value)}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select a service to compare" />
                      </SelectTrigger>
                      <SelectContent>
                        {services?.filter(service => !selectedServices.includes(service.id))
                          .map((service) => (
                            <SelectItem key={service.id} value={service.id}>
                              {service.title}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Comparison Table */}
        {selectedServiceDetails.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {selectedServiceDetails.map((service, index) => (
              <Card key={service.id} className="relative">
                <CardHeader>
                  <img
                    src={service.imageUrl}
                    alt={service.title}
                    className="w-full h-32 object-cover rounded-lg mb-4"
                  />
                  <CardTitle className="text-xl text-om-blue">{service.title}</CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeService(service.id)}
                    className="absolute top-4 right-4"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Pricing */}
                  <div>
                    <h4 className="font-semibold text-om-blue mb-2">Pricing</h4>
                    <div className="space-y-1">
                      <div className="text-lg font-bold text-om-orange">
                        ₹{service.hourlyRate.toLocaleString()}/hour
                      </div>
                      <div className="text-sm text-om-gray-500">
                        ₹{service.monthlyRate.toLocaleString()}/month
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="font-semibold text-om-blue mb-2">Description</h4>
                    <p className="text-sm text-om-gray-600">{service.description}</p>
                  </div>

                  {/* Key Features */}
                  <div>
                    <h4 className="font-semibold text-om-blue mb-2">Key Features</h4>
                    <div className="space-y-1">
                      {service.features.slice(0, 5).map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-sm">
                          <Check className="h-3 w-3 text-green-600 flex-shrink-0" />
                          <span className="text-om-gray-600">{feature}</span>
                        </div>
                      ))}
                      {service.features.length > 5 && (
                        <div className="text-xs text-om-gray-400">
                          +{service.features.length - 5} more features
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Technologies */}
                  <div>
                    <h4 className="font-semibold text-om-blue mb-2">Technologies</h4>
                    <div className="flex flex-wrap gap-1">
                      {service.technologies.slice(0, 4).map((tech, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {service.technologies.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{service.technologies.length - 4}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-4">
                    <Button asChild className="w-full bg-om-orange text-white hover:bg-orange-600">
                      <Link href={`/service/${service.slug}`}>
                        View Details
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full">
                      Add to Quote
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Empty slots */}
            {Array.from({ length: 3 - selectedServiceDetails.length }).map((_, index) => (
              <Card key={`empty-${index}`} className="border-dashed border-2 border-gray-300">
                <CardContent className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <Plus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Select a service to compare</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">⚖️</div>
              <h3 className="text-xl font-semibold text-om-blue mb-2">Start Comparing Services</h3>
              <p className="text-om-gray-500 mb-6">
                Select services from the dropdown above to see a detailed side-by-side comparison
              </p>
              <Button asChild className="bg-om-orange text-white hover:bg-orange-600">
                <Link href="/">Browse All Services</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}