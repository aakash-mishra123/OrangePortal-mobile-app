import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'wouter';
import { ArrowRight, Clock, CheckCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { leadSchema } from '../../shared/schema';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';

export default function CategoryPage() {
  const { categoryId } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: services, isLoading } = useQuery({
    queryKey: ['services', categoryId],
    queryFn: async () => {
      if (categoryId === 'mobile-app-dev') {
        const response = await fetch('/api/services/mobile-app');
        return response.json();
      }
      return [];
    }
  });

  const leadMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit lead');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Project Kickstarted! 🎉",
        description: "Our expert will call you within 5 minutes to discuss your project!",
        duration: 8000,
      });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    }
  });

  const handleKickstartClick = (service: any) => {
    if (!user) {
      toast({
        title: "Please Sign In",
        description: "Sign up or log in to kickstart your project. Our expert will call you within 5 minutes!",
        variant: "default",
      });
      // Redirect to login
      setTimeout(() => {
        window.location.href = '/auth/google';
      }, 2000);
      return;
    }

    // User is logged in, create lead automatically
    const leadData = {
      name: user.name,
      phone: 'To be collected',
      email: user.email,
      projectBrief: `Interested in ${service.title} service`,
      budget: 'To be discussed',
      serviceId: service.id,
      serviceName: service.title
    };

    leadMutation.mutate(leadData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-xl text-gray-600">Loading services...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl font-bold mb-6">Mobile App Development</h1>
            <p className="text-xl opacity-90 mb-8">
              Transform your ideas into powerful mobile applications with our expert development team. 
              From native iOS and Android apps to cross-platform solutions.
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm">
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>1 Hour Kickoff</span>
              </div>
              <div className="flex items-center">
                <Star className="h-5 w-5 mr-2" />
                <span>Expert Team</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>Premium Quality</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Mobile App Solution
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Select the perfect service for your mobile app needs. Our expert team will kickstart your project within just 1 hour!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services?.map((service: any, index: number) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <Card className="h-full bg-white shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 pb-6">
                    <div className="flex justify-between items-start mb-4">
                      <CardTitle className="text-xl font-bold text-gray-900">
                        {service.title}
                      </CardTitle>
                      <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                        ₹{service.hourlyRate}/hr
                      </div>
                    </div>
                    <CardDescription className="text-gray-600 text-base">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    <div className="space-y-3 mb-6">
                      {service.features.map((feature: string, featureIndex: number) => (
                        <motion.div
                          key={featureIndex}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: featureIndex * 0.1 }}
                          className="flex items-center text-gray-700"
                        >
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                          <span>{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                    
                    <Button 
                      onClick={() => handleKickstartClick(service)}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 group"
                      size="lg"
                      disabled={leadMutation.isPending}
                    >
                      {leadMutation.isPending ? 'Kickstarting...' : 'Kickstart Your Project'}
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


    </div>
  );
}