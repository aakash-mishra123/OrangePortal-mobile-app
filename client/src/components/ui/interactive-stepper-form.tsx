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
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  Phone, 
  FileText, 
  DollarSign, 
  Clock, 
  Calendar,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Rocket,
  Sparkles,
  Target,
  Zap
} from "lucide-react";

const step1Schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number")
});

const step2Schema = z.object({
  projectDetails: z.string().min(20, "Please provide more details about your project"),
  experienceLevel: z.string().min(1, "Please select experience level")
});

const step3Schema = z.object({
  projectDuration: z.string().min(1, "Please select project duration"),
  budget: z.string().min(1, "Please select budget range"),
  timeFrame: z.string().min(1, "Please select expected timeframe")
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;
type Step3Data = z.infer<typeof step3Schema>;
type FormData = Step1Data & Step2Data & Step3Data;

interface InteractiveStepperFormProps {
  serviceId: string;
  serviceName: string;
  resourceType: string;
  resourceTitle: string;
  hourlyRate: number;
  onSubmit: (data: FormData) => void;
  isSubmitting: boolean;
}

const steps = [
  {
    id: 1,
    title: "Contact Info",
    description: "Tell us about yourself",
    icon: User,
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: 2,
    title: "Project Details",
    description: "Describe your project",
    icon: FileText,
    color: "from-purple-500 to-pink-500"
  },
  {
    id: 3,
    title: "Budget & Timeline",
    description: "Project scope & timing",
    icon: Clock,
    color: "from-orange-500 to-red-500"
  }
];

export default function InteractiveStepperForm({
  serviceId,
  serviceName,
  resourceType,
  resourceTitle,
  hourlyRate,
  onSubmit,
  isSubmitting
}: InteractiveStepperFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<FormData>>({});

  const step1Form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: formData
  });

  const step2Form = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: formData
  });

  const step3Form = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: formData
  });

  const handleStep1Submit = (data: Step1Data) => {
    setFormData(prev => ({ ...prev, ...data }));
    setCurrentStep(2);
  };

  const handleStep2Submit = (data: Step2Data) => {
    setFormData(prev => ({ ...prev, ...data }));
    setCurrentStep(3);
  };

  const handleStep3Submit = (data: Step3Data) => {
    try {
      const finalData = { 
        ...formData, 
        ...data,
        // Map form fields to the expected API format
        projectTitle: formData.projectDetails || '',
        projectDescription: formData.projectDetails || '',
        message: data.timeFrame || ''
      } as FormData;
      
      console.log('Form submission data:', finalData);
      onSubmit(finalData);
    } catch (error) {
      console.error('Form submission error:', error);
      // Don't throw - handle gracefully
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepStatus = (stepNumber: number) => {
    if (stepNumber < currentStep) return "completed";
    if (stepNumber === currentStep) return "active";
    return "pending";
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => {
        const status = getStepStatus(step.id);
        const IconComponent = step.icon;
        
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg
                  transition-all duration-500 transform
                  ${status === "active" ? `stepper-active bg-gradient-to-r ${step.color} animate-pulse-custom` : ""}
                  ${status === "completed" ? "stepper-completed" : ""}
                  ${status === "pending" ? "stepper-pending" : ""}
                `}
              >
                {status === "completed" ? (
                  <CheckCircle2 className="h-8 w-8" />
                ) : (
                  <IconComponent className="h-8 w-8" />
                )}
              </div>
              <div className="mt-2 text-center">
                <div className={`font-semibold text-sm ${status === "active" ? "text-indigo-600" : "text-gray-600"}`}>
                  {step.title}
                </div>
                <div className="text-xs text-gray-500">{step.description}</div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div 
                className={`
                  w-24 h-1 mx-4 rounded-full transition-all duration-500
                  ${status === "completed" || (status === "active" && index < currentStep - 1) 
                    ? "bg-gradient-to-r from-green-400 to-blue-500" 
                    : "bg-gray-200"}
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );

  const renderStep1 = () => (
    <Card className="interactive-card border-0 shadow-2xl animate-bounce-slow">
      <CardHeader className="text-center pb-4">
        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center animate-glow">
          <User className="h-10 w-10 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Let's Get to Know You!
        </CardTitle>
        <p className="text-gray-600">We'll use this info to contact you about your project</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={step1Form.handleSubmit(handleStep1Submit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <User className="h-4 w-4 text-blue-500" />
                <span>Full Name *</span>
              </Label>
              <Input
                id="name"
                placeholder="Your full name"
                {...step1Form.register("name")}
                className="h-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-all duration-300 hover:border-blue-300"
              />
              {step1Form.formState.errors.name && step1Form.formState.isSubmitted && (
                <p className="text-red-500 text-sm animate-in slide-in-from-left-2">{step1Form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <Mail className="h-4 w-4 text-green-500" />
                <span>Email Address *</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                {...step1Form.register("email")}
                className="h-12 border-2 border-gray-200 rounded-xl focus:border-green-500 transition-all duration-300 hover:border-green-300"
              />
              {step1Form.formState.errors.email && step1Form.formState.isSubmitted && (
                <p className="text-red-500 text-sm animate-in slide-in-from-left-2">{step1Form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <Phone className="h-4 w-4 text-purple-500" />
                <span>Phone Number *</span>
              </Label>
              <Input
                id="phone"
                placeholder="+91 XXXXX XXXXX"
                {...step1Form.register("phone")}
                className="h-12 border-2 border-gray-200 rounded-xl focus:border-purple-500 transition-all duration-300 hover:border-purple-300"
              />
              {step1Form.formState.errors.phone && step1Form.formState.isSubmitted && (
                <p className="text-red-500 text-sm animate-in slide-in-from-left-2">{step1Form.formState.errors.phone.message}</p>
              )}
            </div>
          </div>

          <Button 
            type="submit" 
            size="lg"
            className="w-full h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 rounded-xl"
          >
            <span className="flex items-center space-x-2">
              <span>Continue to Project Details</span>
              <ArrowRight className="h-5 w-5" />
            </span>
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <Card className="interactive-card border-0 shadow-2xl animate-bounce-slow">
      <CardHeader className="text-center pb-4">
        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-glow">
          <FileText className="h-10 w-10 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Tell Us About Your Project
        </CardTitle>
        <p className="text-gray-600">Help us understand your vision and requirements</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={step2Form.handleSubmit(handleStep2Submit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="projectDetails" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-purple-500" />
              <span>Project Details *</span>
            </Label>
            <Textarea
              id="projectDetails"
              placeholder="Describe your project vision, key features, target audience, and any specific requirements or technologies you have in mind..."
              rows={6}
              {...step2Form.register("projectDetails")}
              className="border-2 border-gray-200 rounded-xl focus:border-purple-500 transition-all duration-300 hover:border-purple-300 resize-none"
            />
            {step2Form.formState.errors.projectDetails && step2Form.formState.isSubmitted && (
              <p className="text-red-500 text-sm animate-in slide-in-from-left-2">{step2Form.formState.errors.projectDetails.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
              <Target className="h-4 w-4 text-indigo-500" />
              <span>Experience Level Required *</span>
            </Label>
            <select 
              onChange={(e) => step2Form.setValue("experienceLevel", e.target.value)}
              value={step2Form.watch("experienceLevel") || ""}
              className="h-12 w-full border-2 border-gray-200 rounded-xl focus:border-indigo-500 transition-all duration-300 hover:border-indigo-300 px-3 bg-white"
            >
              <option value="">Select experience level</option>
              <option value="junior">Junior</option>
              <option value="mid">Mid-level</option>
              <option value="senior">Senior</option>
              <option value="lead">Lead/Expert</option>
            </select>
            {step2Form.formState.errors.experienceLevel && step2Form.formState.isSubmitted && (
              <p className="text-red-500 text-sm animate-in slide-in-from-left-2">{step2Form.formState.errors.experienceLevel.message}</p>
            )}
          </div>

          <div className="flex space-x-4">
            <Button 
              type="button"
              variant="outline"
              size="lg"
              onClick={goToPreviousStep}
              className="h-14 px-8 border-2 border-gray-300 hover:border-gray-400 rounded-xl transition-all duration-300"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </Button>
            <Button 
              type="submit" 
              size="lg"
              className="flex-1 h-14 bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 rounded-xl"
            >
              <span className="flex items-center space-x-2">
                <span>Continue to Budget & Timeline</span>
                <ArrowRight className="h-5 w-5" />
              </span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  const renderStep3 = () => (
    <Card className="interactive-card border-0 shadow-2xl animate-bounce-slow">
      <CardHeader className="text-center pb-4">
        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center animate-glow">
          <DollarSign className="h-10 w-10 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          Budget & Timeline
        </CardTitle>
        <p className="text-gray-600">Let's finalize the project scope and timing</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={step3Form.handleSubmit(handleStep3Submit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span>Project Duration *</span>
              </Label>
              <select 
                onChange={(e) => step3Form.setValue("projectDuration", e.target.value)}
                value={step3Form.watch("projectDuration") || ""}
                className="h-12 w-full border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-all duration-300 hover:border-blue-300 px-3 bg-white"
              >
                <option value="">Select duration</option>
                <option value="1week">1 Week</option>
                <option value="2-4weeks">2-4 Weeks</option>
                <option value="1-3months">1-3 Months</option>
                <option value="3-6months">3-6 Months</option>
                <option value="6months+">6+ Months</option>
              </select>
              {step3Form.formState.errors.projectDuration && step3Form.formState.isSubmitted && (
                <p className="text-red-500 text-sm animate-in slide-in-from-left-2">{step3Form.formState.errors.projectDuration.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-green-500" />
                <span>Budget Range *</span>
              </Label>
              <select 
                onChange={(e) => step3Form.setValue("budget", e.target.value)}
                value={step3Form.watch("budget") || ""}
                className="h-12 w-full border-2 border-gray-200 rounded-xl focus:border-green-500 transition-all duration-300 hover:border-green-300 px-3 bg-white"
              >
                <option value="">Select budget range</option>
                <option value="under-50k">Under 50K</option>
                <option value="50k-100k">50K - 100K</option>
                <option value="100k-200k">100K - 200K</option>
                <option value="200k-500k">200K - 500K</option>
                <option value="500k-plus">500K+</option>
              </select>
              {step3Form.formState.errors.budget && step3Form.formState.isSubmitted && (
                <p className="text-red-500 text-sm animate-in slide-in-from-left-2">{step3Form.formState.errors.budget.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-purple-500" />
              <span>Expected Start Time *</span>
            </Label>
            <select 
              onChange={(e) => step3Form.setValue("timeFrame", e.target.value)}
              value={step3Form.watch("timeFrame") || ""}
              className="h-12 w-full border-2 border-gray-200 rounded-xl focus:border-purple-500 transition-all duration-300 hover:border-purple-300 px-3 bg-white"
            >
              <option value="">When would you like to start?</option>
              <option value="immediately">Immediately</option>
              <option value="1week">Within 1 week</option>
              <option value="2weeks">Within 2 weeks</option>
              <option value="1month">Within 1 month</option>
              <option value="flexible">Flexible</option>
            </select>
            {step3Form.formState.errors.timeFrame && step3Form.formState.isSubmitted && (
              <p className="text-red-500 text-sm animate-in slide-in-from-left-2">{step3Form.formState.errors.timeFrame.message}</p>
            )}
          </div>

          <div className="flex space-x-4">
            <Button 
              type="button"
              variant="outline"
              size="lg"
              onClick={goToPreviousStep}
              className="h-14 px-8 border-2 border-gray-300 hover:border-gray-400 rounded-xl transition-all duration-300"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </Button>
            <Button 
              type="submit" 
              size="lg"
              disabled={isSubmitting}
              className="flex-1 h-14 bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 rounded-xl"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Launching Your Project...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Rocket className="h-5 w-5" />
                  <span>🚀 Kickstart Your Project!</span>
                  <Zap className="h-5 w-5" />
                </div>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Project Summary Header */}
      <Card className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white animate-gradient border-0 shadow-2xl">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Rocket className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{serviceName}</h3>
              <div className="flex items-center space-x-4 text-sm">
                <span>Resource: {resourceTitle}</span>
                <span>•</span>
                <span>Rate: ₹{hourlyRate}/hour</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Indicator */}
      {renderStepIndicator()}

      {/* Step Content */}
      <div className="max-w-2xl mx-auto">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </div>
    </div>
  );
}