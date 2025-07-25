import { useQuery } from "@tanstack/react-query";
import { type Category } from "@shared/schema";
import CategoryCard from "@/components/ui/category-card";
import Testimonials from "@/components/ui/testimonials";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { trackUserActivity } from "@/lib/activityTracker";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const handleCategoryClick = async (categoryId: string) => {
    await trackUserActivity({
      activityType: 'category_browse',
      categoryId: categoryId,
      metadata: { source: 'home_page' }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-om-gray-50">
        <div className="animate-pulse">
          {/* Hero skeleton */}
          <div className="relative bg-om-blue h-96">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
              <div className="h-8 bg-gray-300 rounded w-3/4 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto mb-8"></div>
              <div className="h-12 bg-gray-300 rounded-full max-w-2xl mx-auto"></div>
            </div>
          </div>
          {/* Categories skeleton */}
          <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="w-12 h-12 bg-gray-300 rounded-lg mb-4"></div>
                  <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-3"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-om-blue to-blue-900 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')"
          }}
        ></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Transform Your Business with{" "}
            <span className="text-om-orange">Expert IT Services</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            From web development to AI automation, we deliver comprehensive digital transformation solutions for modern enterprises.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search for services (e.g., web development, mobile apps, AI automation)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 text-lg text-gray-900 bg-white rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-om-orange focus:ring-opacity-50 pr-16"
              />
              <Button 
                size="icon"
                asChild
                className="absolute right-2 top-2 bg-om-orange text-white p-3 rounded-full hover:bg-orange-600 transition-colors"
              >
                <Link href="/search">
                  <Search className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild
              size="lg"
              className="bg-om-orange text-white px-8 py-4 text-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              <Link href="#services">Explore Services</Link>
            </Button>
            <Button 
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-white text-white px-8 py-4 text-lg font-semibold hover:bg-white hover:text-om-blue transition-colors"
            >
              <Link href="/consultation">Schedule Consultation</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section id="services" className="py-20 bg-om-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-om-blue mb-4">
              Our Service Categories
            </h2>
            <p className="text-xl text-om-gray-500 max-w-3xl mx-auto">
              Comprehensive digital transformation services tailored for modern enterprises across all industries.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories?.map((category) => (
              <CategoryCard 
                key={category.id} 
                category={category} 
                onClick={() => handleCategoryClick(category.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-om-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Enterprises Worldwide
            </h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              We've helped hundreds of companies transform their digital presence and achieve their business goals.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-om-orange mb-2">500+</div>
              <div className="text-lg opacity-90">Projects Completed</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-om-orange mb-2">250+</div>
              <div className="text-lg opacity-90">Happy Clients</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-om-orange mb-2">10+</div>
              <div className="text-lg opacity-90">Years Experience</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-om-orange mb-2">50+</div>
              <div className="text-lg opacity-90">Team Members</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-om-orange to-red-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Let's discuss how our expert team can help you achieve your digital transformation goals.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-white text-om-orange px-8 py-4 text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Schedule Free Consultation
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="border-2 border-white text-white px-8 py-4 text-lg font-semibold hover:bg-white hover:text-om-orange transition-colors"
            >
              View Portfolio
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
