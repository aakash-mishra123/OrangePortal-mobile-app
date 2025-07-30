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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white py-20 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white opacity-10 rounded-full animate-float"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-orange-400 opacity-20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-blue-400 opacity-10 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-purple-400 opacity-15 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6 animate-in slide-in-from-bottom-8 duration-1000">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 text-orange-300 text-sm font-medium backdrop-blur-sm">
              🚀 Trusted by 500+ Companies • 10+ Years Experience
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 sm:mb-8 animate-in slide-in-from-bottom-8 duration-1000" style={{ animationDelay: '200ms' }}>
            <span className="block bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent leading-tight">
              Kickstart Your
            </span>
            <span className="block bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent font-extrabold leading-tight">
              App or Website
            </span>
            <span className="block text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl mt-2 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent font-bold animate-glow">
              in Just 1 Hour! ⚡
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-12 max-w-4xl mx-auto opacity-90 animate-in slide-in-from-bottom-8 duration-1000" style={{ animationDelay: '400ms' }}>
            Connect with expert developers instantly. Get your mobile app or website project kickstarted with professional consultation, rapid prototyping, and world-class development.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12 animate-in slide-in-from-bottom-8 duration-1000" style={{ animationDelay: '400ms' }}>
            <div className="relative gradient-border">
              <div className="relative z-10">
                <Input
                  type="text"
                  placeholder="Search for services (e.g., Mobile Apps, Web Development, UI/UX Design)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 text-lg text-gray-900 bg-white/95 backdrop-blur-sm rounded-full shadow-2xl focus:outline-none focus:ring-4 focus:ring-orange-400 focus:ring-opacity-50 pr-16 border-0"
                />
                <Button 
                  size="icon"
                  asChild
                  className="absolute right-2 top-2 bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-full hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110"
                >
                  <Link href="/search">
                    <Search className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-in slide-in-from-bottom-8 duration-1000" style={{ animationDelay: '800ms' }}>
            <Button 
              asChild
              size="lg"
              className="group bg-gradient-to-r from-orange-500 to-red-500 text-white px-10 py-5 text-xl font-bold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-2xl hover:shadow-orange-500/25 transform hover:scale-110 hover:-translate-y-1 rounded-2xl"
            >
              <Link href="#services">
                <span className="flex items-center space-x-3">
                  <span>🚀</span>
                  <span>Explore Services</span>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                </span>
              </Link>
            </Button>
            <Button 
              asChild
              variant="outline"
              size="lg"
              className="group border-3 border-white/80 backdrop-blur-sm text-white px-10 py-5 text-xl font-bold hover:bg-white/95 hover:text-slate-900 transition-all duration-300 shadow-2xl hover:shadow-white/25 transform hover:scale-110 hover:-translate-y-1 rounded-2xl"
            >
              <Link href="/consultation">
                <span className="flex items-center space-x-3">
                  <span>💬</span>
                  <span>Free Consultation</span>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section id="services" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Running Message */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 sm:p-4 rounded-2xl shadow-lg mb-8 sm:mb-12 animate-in slide-in-from-top-4 duration-500">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-sm sm:text-base font-medium text-center">
                🚀 Professional development services • Real market rates • 500+ successful projects • Get started in 1 hour
              </span>
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>

          <div className="text-center mb-12 sm:mb-16 lg:mb-20 animate-fade-in-up">
            <div className="mb-4 sm:mb-6">
              <span className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-xs sm:text-sm font-medium border border-blue-200">
                ⚡ Lightning-Fast Development
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent mb-4 sm:mb-6">
              Our Service Categories
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Comprehensive digital transformation services with <span className="font-bold text-orange-600">world-class expertise</span> tailored for modern enterprises across all industries.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {Array.isArray(categories) && categories.map((category, index) => (
              <div 
                key={category.id}
                className="transform transition-all duration-300 hover:scale-105 animate-in slide-in-from-bottom-8"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CategoryCard 
                  category={category} 
                  onClick={() => handleCategoryClick(category.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Trusted by Enterprises Worldwide
            </h2>
            <p className="text-base sm:text-lg md:text-xl opacity-90 max-w-3xl mx-auto">
              We've helped hundreds of companies transform their digital presence and achieve their business goals.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 hover:bg-white/20 transition-all duration-300">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-2">500+</div>
              <div className="text-sm sm:text-base lg:text-lg opacity-90">Projects Completed</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 hover:bg-white/20 transition-all duration-300">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-2">250+</div>
              <div className="text-sm sm:text-base lg:text-lg opacity-90">Happy Clients</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 hover:bg-white/20 transition-all duration-300">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-2">10+</div>
              <div className="text-sm sm:text-base lg:text-lg opacity-90">Years Experience</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 hover:bg-white/20 transition-all duration-300">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-2">50+</div>
              <div className="text-sm sm:text-base lg:text-lg opacity-90">Team Members</div>
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
