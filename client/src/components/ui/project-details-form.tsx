import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Rocket, Clock, DollarSign, Calendar, User, Mail, Phone, FileText } from "lucide-react";

const projectFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  projectDetails: z.string().min(20, "Please provide more details about your project"),
  experienceLevel: z.string().min(1, "Please select experience level"),
  projectDuration: z.string().min(1, "Please select project duration"),
  budget: z.string().min(1, "Please select budget range"),
  timeFrame: z.string().min(1, "Please select expected timeframe")
});

type ProjectFormData = z.infer<typeof projectFormSchema>;

interface ProjectDetailsFormProps {
  serviceId: string;
  serviceName: string;
  resourceType: string;
  resourceTitle: string;
  hourlyRate: number;
  onSubmit: (data: ProjectFormData) => void;
  isSubmitting: boolean;
}

export default function ProjectDetailsForm({ 
  serviceId, 
  serviceName, 
  resourceType, 
  resourceTitle, 
  hourlyRate,
  onSubmit, 
  isSubmitting 
}: ProjectDetailsFormProps) {
  const { toast } = useToast();
  
  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      projectDetails: "",
      experienceLevel: "",
      projectDuration: "",
      budget: "",
      timeFrame: ""
    }
  });

  const handleSubmit = (data: ProjectFormData) => {
    onSubmit(data);
  };

  return (
    <div className="space-y-6">
      {/* Project Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-800">
            <Rocket className="h-5 w-5" />
            <span>Project Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-blue-700">Service:</span>
              <p className="text-blue-800">{serviceName}</p>
            </div>
            <div>
              <span className="font-medium text-blue-700">Resource:</span>
              <p className="text-blue-800">{resourceTitle}</p>
            </div>
            <div>
              <span className="font-medium text-blue-700">Rate:</span>
              <p className="text-blue-800">₹{hourlyRate}/hour</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Details Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-800">Project Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700 flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Contact Information</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Your full name"
                    {...form.register("name")}
                    className="mt-1"
                  />
                  {form.formState.errors.name && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.name.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    {...form.register("email")}
                    className="mt-1"
                  />
                  {form.formState.errors.email && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    placeholder="+91 XXXXX XXXXX"
                    {...form.register("phone")}
                    className="mt-1"
                  />
                  {form.formState.errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.phone.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Project Requirements */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700 flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Project Requirements</span>
              </h4>
              
              <div>
                <Label htmlFor="projectDetails">Project Details *</Label>
                <Textarea
                  id="projectDetails"
                  placeholder="Describe your project requirements, features needed, target audience, and any specific technologies or integrations required..."
                  rows={4}
                  {...form.register("projectDetails")}
                  className="mt-1"
                />
                {form.formState.errors.projectDetails && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.projectDetails.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Experience Level Required *</Label>
                  <Select onValueChange={(value) => form.setValue("experienceLevel", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="junior">Junior (1-2 years)</SelectItem>
                      <SelectItem value="mid">Mid-level (3-5 years)</SelectItem>
                      <SelectItem value="senior">Senior (5+ years)</SelectItem>
                      <SelectItem value="lead">Lead/Expert (8+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.experienceLevel && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.experienceLevel.message}</p>
                  )}
                </div>

                <div>
                  <Label>Project Duration *</Label>
                  <Select onValueChange={(value) => form.setValue("projectDuration", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1week">1 Week or less</SelectItem>
                      <SelectItem value="2-4weeks">2-4 Weeks</SelectItem>
                      <SelectItem value="1-3months">1-3 Months</SelectItem>
                      <SelectItem value="3-6months">3-6 Months</SelectItem>
                      <SelectItem value="6months+">6+ Months</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.projectDuration && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.projectDuration.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Budget Range *</Label>
                  <Select onValueChange={(value) => form.setValue("budget", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="<50k">Less than ₹50,000</SelectItem>
                      <SelectItem value="50k-1lakh">₹50,000 - ₹1,00,000</SelectItem>
                      <SelectItem value="1-2lakh">₹1,00,000 - ₹2,00,000</SelectItem>
                      <SelectItem value="2-5lakh">₹2,00,000 - ₹5,00,000</SelectItem>
                      <SelectItem value="5lakh+">₹5,00,000+</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.budget && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.budget.message}</p>
                  )}
                </div>

                <div>
                  <Label>Expected Start Time *</Label>
                  <Select onValueChange={(value) => form.setValue("timeFrame", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="When to start?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediately">Immediately</SelectItem>
                      <SelectItem value="1week">Within 1 week</SelectItem>
                      <SelectItem value="2weeks">Within 2 weeks</SelectItem>
                      <SelectItem value="1month">Within 1 month</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.timeFrame && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.timeFrame.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              size="lg"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting Request...
                </>
              ) : (
                <>
                  <Rocket className="h-4 w-4 mr-2" />
                  Kickstart Your Project
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}