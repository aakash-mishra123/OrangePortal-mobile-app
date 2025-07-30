import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { type Service, type Category } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, X } from "lucide-react";
import ServiceCard from "@/components/ui/service-card";
import { Link, useLocation } from "wouter";

export default function SearchPage() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("relevance");

  const { data: services, isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const filteredServices = useMemo(() => {
    if (!services) return [];

    let filtered = services;

    // Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query) ||
        service.features.some(feature => feature.toLowerCase().includes(query)) ||
        service.technologies.some(tech => tech.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(service => service.categoryId === selectedCategory);
    }

    // Price range filter
    if (priceRange !== "all") {
      filtered = filtered.filter(service => {
        const hourlyRate = service.hourlyRate;
        switch (priceRange) {
          case "budget":
            return hourlyRate <= 1000;
          case "standard":
            return hourlyRate > 1000 && hourlyRate <= 1500;
          case "premium":
            return hourlyRate > 1500;
          default:
            return true;
        }
      });
    }

    // Sort results
    switch (sortBy) {
      case "price-low":
        return filtered.sort((a, b) => a.hourlyRate - b.hourlyRate);
      case "price-high":
        return filtered.sort((a, b) => b.hourlyRate - a.hourlyRate);
      case "name":
        return filtered.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return filtered;
    }
  }, [services, searchQuery, selectedCategory, priceRange, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setPriceRange("all");
    setSortBy("relevance");
  };

  const activeFiltersCount = [
    searchQuery.trim() !== "",
    selectedCategory !== "all",
    priceRange !== "all",
    sortBy !== "relevance"
  ].filter(Boolean).length;

  if (servicesLoading) {
    return (
      <div className="min-h-screen bg-om-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mb-8"></div>
            <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-12 bg-gray-300 rounded"></div>
                ))}
              </div>
            </div>
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

  return (
    <div className="min-h-screen bg-om-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-om-blue mb-2">Search Services</h1>
          <p className="text-om-gray-500">Find the perfect digital transformation service for your business</p>
        </div>

        {/* Search & Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-om-gray-400" />
                <Input
                  placeholder="Search services, technologies, or features..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 text-lg"
                />
              </div>

              {/* Filters Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {Array.isArray(categories) && categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="budget">Budget (≤₹1,000/hr)</SelectItem>
                    <SelectItem value="standard">Standard (₹1,000-1,500/hr)</SelectItem>
                    <SelectItem value="premium">Premium (&gt;₹1,500/hr)</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Most Relevant</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    disabled={activeFiltersCount === 0}
                    className="flex-1"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="px-2 py-1">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-om-blue">
              {Array.isArray(filteredServices) ? filteredServices.length : 0} Services Found
            </h2>
            
            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2">
                {searchQuery.trim() && (
                  <Badge variant="outline" className="px-3 py-1">
                    Search: "{searchQuery}"
                  </Badge>
                )}
                {selectedCategory !== "all" && (
                  <Badge variant="outline" className="px-3 py-1">
                    Category: {categories?.find(c => c.id === selectedCategory)?.name}
                  </Badge>
                )}
                {priceRange !== "all" && (
                  <Badge variant="outline" className="px-3 py-1">
                    Price: {priceRange.charAt(0).toUpperCase() + priceRange.slice(1)}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Services Grid */}
        {!Array.isArray(filteredServices) || filteredServices.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-om-blue mb-2">No Services Found</h3>
              <p className="text-om-gray-500 mb-6">
                Try adjusting your search criteria or browse our categories
              </p>
              <div className="space-x-4">
                <Button onClick={clearFilters} className="bg-om-orange text-white hover:bg-orange-600">
                  Clear All Filters
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/">Browse All Categories</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.isArray(filteredServices) && filteredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}