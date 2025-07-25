import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Search, ArrowRight, Smartphone, Palette, Users, Globe, ShoppingCart, Server, Brain, CheckCircle, Wrench } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Header from '@/components/Header';

const iconMap = {
  'palette': Palette,
  'users': Users,
  'smartphone': Smartphone,
  'globe': Globe,
  'shopping-cart': ShoppingCart,
  'server': Server,
  'brain': Brain,
  'check-circle': CheckCircle,
  'wrench': Wrench
};

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      return response.json();
    }
  });

  const { data: searchResults } = useQuery({
    queryKey: ['search', searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return null;
      const response = await fetch(`/api/search?query=${encodeURIComponent(searchQuery)}`);
      return response.json();
    },
    enabled: searchQuery.length > 2
  });

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section with Moving Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-20">
        <motion.div 
          className="absolute inset-0 bg-blue-600 opacity-20"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%']
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
          style={{
            backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.1) 75%)',
            backgroundSize: '30px 30px'
          }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.h1 
              className="text-5xl md:text-6xl font-bold mb-6"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{
                backgroundImage: 'linear-gradient(90deg, #ffffff, #fbbf24, #ffffff)',
                backgroundSize: '200% 100%',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent'
              }}
            >
              Kickstart Your App or Website in Just 1 Hour!
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl mb-8 opacity-90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Expert-led project kickoff • Lightning-fast delivery • Premium quality
            </motion.p>

            {/* Search Bar */}
            <motion.div 
              className="max-w-2xl mx-auto relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search for mobile app development, UI design, or any service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 py-4 text-lg bg-white/95 backdrop-blur-sm border-0 shadow-xl"
                />
              </div>
              
              {/* Search Results Dropdown */}
              {searchResults && (
                <motion.div 
                  className="absolute top-full left-0 right-0 bg-white rounded-lg shadow-2xl mt-2 p-4 z-50 text-gray-800"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {searchResults.categories?.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-sm text-gray-600 mb-2">Categories</h4>
                      {searchResults.categories.map((category: any) => (
                        <Link key={category.id} href={`/category/${category.id}`}>
                          <div className="flex items-center p-2 hover:bg-blue-50 rounded cursor-pointer">
                            <span className="font-medium">{category.name}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                  
                  {searchResults.services?.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600 mb-2">Services</h4>
                      {searchResults.services.map((service: any) => (
                        <Link key={service.id} href="/category/mobile-app-dev">
                          <div className="flex items-center justify-between p-2 hover:bg-blue-50 rounded cursor-pointer">
                            <div>
                              <span className="font-medium">{service.title}</span>
                              <p className="text-sm text-gray-600">{service.description}</p>
                            </div>
                            <span className="text-blue-600 font-bold">₹{service.hourlyRate}/hr</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Service Categories Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Service Category
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From mobile apps to web development, our expert team delivers premium solutions with lightning-fast turnaround times.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories?.map((category: any, index: number) => {
              const IconComponent = iconMap[category.icon as keyof typeof iconMap] || Smartphone;
              const isFeatured = category.featured;
              
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                  className={`relative overflow-hidden rounded-2xl p-8 cursor-pointer transition-all duration-300 ${
                    isFeatured 
                      ? 'bg-gradient-to-br from-blue-600 to-purple-700 text-white shadow-2xl' 
                      : 'bg-white shadow-lg hover:shadow-2xl border border-gray-100'
                  }`}
                >
                  {isFeatured && (
                    <motion.div
                      className="absolute -top-2 -right-2 bg-yellow-400 text-blue-900 px-3 py-1 rounded-full text-sm font-bold"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      POPULAR
                    </motion.div>
                  )}
                  
                  <Link href={`/category/${category.id}`}>
                    <div className="text-center">
                      <motion.div
                        className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center ${
                          isFeatured ? 'bg-white/20' : 'bg-blue-100'
                        }`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <IconComponent className={`h-8 w-8 ${isFeatured ? 'text-white' : 'text-blue-600'}`} />
                      </motion.div>
                      
                      <h3 className={`text-xl font-bold mb-3 ${isFeatured ? 'text-white' : 'text-gray-900'}`}>
                        {category.name}
                      </h3>
                      
                      <div className="flex items-center justify-center">
                        <Button 
                          variant={isFeatured ? "secondary" : "default"}
                          className="group"
                        >
                          Explore Services
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { number: '500+', label: 'Projects Delivered', icon: '🚀' },
              { number: '1 Hour', label: 'Average Kickoff Time', icon: '⚡' },
              { number: '99%', label: 'Client Satisfaction', icon: '⭐' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <div className="text-4xl mb-4">{stat.icon}</div>
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Kickstart Your Project?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join hundreds of satisfied clients who've transformed their ideas into reality with our expert team.
            </p>
            <Link href="/category/mobile-app-dev">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}