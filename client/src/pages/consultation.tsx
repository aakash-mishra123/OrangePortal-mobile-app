import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Calendar, Clock, User, Mail, Phone, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";

const consultationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  company: z.string().min(2, "Company name is required"),
  projectType: z.string().min(1, "Please select a project type"),
  budget: z.string().min(1, "Please select a budget range"),
  timeline: z.string().min(1, "Please select a timeline"),
  preferredDate: z.string().min(1, "Please select a preferred date"),
  preferredTime: z.string().min(1, "Please select a preferred time"),
  message: z.string().optional(),
});

type ConsultationFormData = z.infer<typeof consultationSchema>;

const projectTypes = [
  "Web Development",
  "Mobile App Development",
  "E-commerce Platform",
  "Cloud Migration",
  "AI & Automation",
  "Digital Transformation",
  "CRM/ERP Implementation",
  "UI/UX Design",
  "DevOps Setup",
  "Quality Assurance",
  "Other"
];

const budgetRanges = [
  "₹50,000 - ₹2,00,000",
  "₹2,00,000 - ₹5,00,000",
  "₹5,00,000 - ₹10,00,000",
  "₹10,00,000 - ₹25,00,000",
  "₹25,00,000+"
];

const timelines = [
  "1-2 weeks",
  "1 month",
  "2-3 months",
  "3-6 months",
  "6+ months"
];

const timeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
];

export default function Consultation() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [step, setStep] = useState(1);

  const form = useForm<ConsultationFormData>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      projectType: "",
      budget: "",
      timeline: "",
      preferredDate: "",
      preferredTime: "",
      message: "",
    },
  });

  // Auto-skip step 1 and pre-fill form if user is authenticated
  useEffect(() => {
    if (isAuthenticated && user && step === 1) {
      // Pre-fill form with user data
      form.setValue("name", `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || '');
      form.setValue("email", user.email || '');
      
      // Skip to step 2 (Project Details) since contact info is already available
      setStep(2);
      
      toast({
        title: "Welcome back!",
        description: "We've pre-filled your contact information. Please provide your project details.",
      });
    }
  }, [isAuthenticated, user, step, form, toast]);

  const bookConsultationMutation = useMutation({
    mutationFn: async (data: ConsultationFormData) => {
      // For now, we'll store as a lead with consultation type
      const leadData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        serviceId: "consultation",
        serviceName: `Consultation - ${data.projectType}`,
        message: `Company: ${data.company}\nBudget: ${data.budget}\nTimeline: ${data.timeline}\nPreferred Date: ${data.preferredDate}\nPreferred Time: ${data.preferredTime}\nMessage: ${data.message || 'No additional message'}`
      };
      
      const response = await apiRequest("POST", "/api/leads", leadData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Consultation Booked Successfully!",
        description: "We'll send you a calendar invite and contact you within 24 hours to confirm the details.",
      });
      form.reset();
      setStep(3);
    },
    onError: (error) => {
      console.error("Failed to book consultation:", error);
      toast({
        title: "Booking Issue",
        description: "Unable to book consultation right now. Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ConsultationFormData) => {
    bookConsultationMutation.mutate(data);
  };

  const nextStep = () => {
    const fieldsToValidate = step === 1 ? 
      ['name', 'email', 'phone', 'company'] : 
      ['projectType', 'budget', 'timeline', 'preferredDate', 'preferredTime'];
    
    form.trigger(fieldsToValidate as any).then((isValid) => {
      if (isValid) {
        setStep(step + 1);
      }
    });
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading...</h2>
            <p className="text-gray-600">Checking your account details</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="min-h-screen bg-om-gray-50 flex items-center justify-center">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="text-3xl font-bold text-om-blue mb-4">
              Consultation Booked Successfully!
            </h1>
            <p className="text-xl text-om-gray-600 mb-8">
              Thank you for choosing OrangeMantra. We'll send you a calendar invite and our team will contact you within 24 hours to confirm the consultation details.
            </p>
            <div className="space-y-4">
              <Button 
                onClick={() => { setStep(1); form.reset(); }}
                className="bg-om-orange text-white hover:bg-orange-600 mr-4"
              >
                Book Another Consultation
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/'}>
                Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-om-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-om-blue mb-4">
            Schedule Free Consultation
          </h1>
          <p className="text-xl text-om-gray-500 max-w-3xl mx-auto">
            Book a 30-minute consultation with our experts to discuss your project requirements and get personalized recommendations.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {/* Step 1: Contact Info (Skip if authenticated) */}
            {!isAuthenticated && (
              <>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-orange-500 text-white' : 'bg-gray-300'}`}>
                  <User className="h-4 w-4" />
                </div>
                <div className={`w-16 h-1 ${step >= 2 ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
              </>
            )}
            
            {/* Step 2: Project Details */}
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-orange-500 text-white' : 'bg-gray-300'}`}>
              <MessageSquare className="h-4 w-4" />
            </div>
            
            <div className={`w-16 h-1 ${step >= 3 ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
            
            {/* Step 3: Confirmation */}
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-orange-500 text-white' : 'bg-gray-300'}`}>
              <Calendar className="h-4 w-4" />
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-orange-600">
              {step === 1 && !isAuthenticated ? "Let's Get to Know You!" : "Project Details & Scheduling"}
            </CardTitle>
            {isAuthenticated && step === 2 && (
              <p className="text-gray-600 mt-2">
                Welcome back! We've pre-filled your contact information. Please provide your project details.
              </p>
            )}
          </CardHeader>
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {step === 1 && !isAuthenticated && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address *</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="john@company.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number *</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="+91 98765 43210" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Your Company" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button 
                        type="button" 
                        onClick={nextStep}
                        className="bg-orange-600 text-white hover:bg-orange-700"
                      >
                        Continue to Project Details
                      </Button>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    {/* Show contact info summary for authenticated users */}
                    {isAuthenticated && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <h3 className="text-lg font-semibold text-blue-800 mb-2">Your Contact Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-blue-700">Name:</span> {form.getValues("name") || "Not provided"}
                          </div>
                          <div>
                            <span className="font-medium text-blue-700">Email:</span> {form.getValues("email") || "Not provided"}
                          </div>
                        </div>
                        <p className="text-xs text-blue-600 mt-2">
                          We'll use this information to contact you about your consultation.
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="projectType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Project Type *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select project type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {projectTypes.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="budget"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Budget Range *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select budget range" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {budgetRanges.map((range) => (
                                  <SelectItem key={range} value={range}>
                                    {range}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="timeline"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Project Timeline *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select timeline" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {timelines.map((timeline) => (
                                  <SelectItem key={timeline} value={timeline}>
                                    {timeline}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="preferredDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preferred Date *</FormLabel>
                            <FormControl>
                              <Input 
                                type="date" 
                                min={new Date().toISOString().split('T')[0]}
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="preferredTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preferred Time *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select time slot" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {timeSlots.map((time) => (
                                  <SelectItem key={time} value={time}>
                                    {time}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Information</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us more about your project requirements, goals, or any specific questions you have..."
                              rows={4}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-between">
                      {/* Only show Previous button for non-authenticated users who started from step 1 */}
                      {!isAuthenticated && (
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setStep(1)}
                        >
                          Previous
                        </Button>
                      )}
                      
                      {/* For authenticated users, show a cancel button instead */}
                      {isAuthenticated && (
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => window.location.href = '/'}
                        >
                          Cancel
                        </Button>
                      )}
                      
                      <Button 
                        type="submit"
                        disabled={bookConsultationMutation.isPending}
                        className="bg-orange-600 text-white hover:bg-orange-700"
                      >
                        {bookConsultationMutation.isPending ? "Booking..." : "Book Consultation"}
                      </Button>
                    </div>
                  </>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Benefits */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-om-blue text-center mb-8">
            What to Expect in Your Consultation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Calendar className="h-12 w-12 text-om-orange mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-om-blue mb-2">Personalized Discussion</h4>
              <p className="text-om-gray-600">
                30-minute one-on-one discussion about your specific project requirements and goals.
              </p>
            </div>
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-om-orange mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-om-blue mb-2">Expert Recommendations</h4>
              <p className="text-om-gray-600">
                Get tailored technology recommendations and project roadmap from our experts.
              </p>
            </div>
            <div className="text-center">
              <Clock className="h-12 w-12 text-om-orange mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-om-blue mb-2">Timeline & Budget</h4>
              <p className="text-om-gray-600">
                Receive realistic timeline estimates and transparent pricing for your project.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}