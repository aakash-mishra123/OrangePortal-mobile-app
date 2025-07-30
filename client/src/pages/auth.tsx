import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Rocket, 
  Sparkles, 
  Zap, 
  Star, 
  Shield, 
  Clock,
  CheckCircle2,
  Phone,
  Mail,
  User,
  ArrowRight,
  Code,
  Smartphone,
  Palette,
  Globe
} from "lucide-react";

export default function AuthPage() {
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Welcome to AppKickstart! 🚀",
      description: "Your account is ready. Let's kickstart your app!",
    });
    // Handle auth logic here
  };

  const features = [
    { icon: Rocket, title: "1-Hour Kickstart", desc: "Get your project started instantly" },
    { icon: Shield, title: "Expert Developers", desc: "Pre-vetted professionals only" },
    { icon: Zap, title: "Rapid Prototyping", desc: "See results in real-time" },
    { icon: Star, title: "Premium Support", desc: "24/7 dedicated assistance" }
  ];

  const services = [
    { icon: Smartphone, name: "Mobile Apps", count: "200+ Projects" },
    { icon: Globe, name: "Web Development", count: "150+ Sites" },
    { icon: Palette, name: "UI/UX Design", count: "300+ Designs" },
    { icon: Code, name: "Backend APIs", count: "100+ APIs" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white opacity-5 rounded-full animate-float"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-orange-400 opacity-10 rounded-full animate-pulse-custom" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-blue-400 opacity-5 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-purple-400 opacity-10 rounded-full animate-bounce-slow" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-1/4 left-1/2 w-20 h-20 bg-green-400 opacity-8 rounded-full animate-float" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen">
          {/* Left Side - Branding & Features */}
          <div className="text-white space-y-8 animate-in slide-in-from-left-8 duration-1000">
            {/* Logo & Tagline */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start space-x-3 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl flex items-center justify-center animate-pulse-custom">
                  <Rocket className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                    AppKickstart
                  </h1>
                  <p className="text-lg opacity-90">Your App, In Just 1 Hour!</p>
                </div>
              </div>
              
              <h2 className="text-3xl lg:text-5xl font-bold mb-6 leading-tight">
                Turn Your App Ideas Into 
                <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent animate-gradient"> Reality</span>
              </h2>
              
              <p className="text-xl opacity-90 mb-8 max-w-2xl">
                Connect with expert developers instantly. Get professional consultation, 
                rapid prototyping, and kickstart your mobile app or website project today.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div 
                  key={feature.title}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300 animate-bounce-slow"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                      <feature.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{feature.title}</h3>
                      <p className="text-sm opacity-80">{feature.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Service Stats */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold mb-4 text-center">Our Expertise</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {services.map((service, index) => (
                  <div 
                    key={service.name}
                    className="text-center animate-bounce-slow"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <service.icon className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-sm">{service.name}</h4>
                    <p className="text-xs opacity-80">{service.count}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Auth Form */}
          <div className="animate-in slide-in-from-right-8 duration-1000" style={{ animationDelay: '300ms' }}>
            <Card className="interactive-card border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center animate-glow">
                  <User className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {mode === "signup" ? "Start Your Journey" : "Welcome Back"}
                </CardTitle>
                <p className="text-gray-600">
                  {mode === "signup" 
                    ? "Join thousands of successful app creators" 
                    : "Continue building amazing apps"}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === "signup" && (
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                        <User className="h-4 w-4 text-indigo-500" />
                        <span>Full Name *</span>
                      </Label>
                      <Input
                        id="name"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="h-12 border-2 border-gray-200 rounded-xl focus:border-indigo-500 transition-all duration-300 hover:border-indigo-300"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-green-500" />
                      <span>Email Address *</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="h-12 border-2 border-gray-200 rounded-xl focus:border-green-500 transition-all duration-300 hover:border-green-300"
                    />
                  </div>

                  {mode === "signup" && (
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-purple-500" />
                        <span>Phone Number *</span>
                      </Label>
                      <Input
                        id="phone"
                        placeholder="+91 XXXXX XXXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="h-12 border-2 border-gray-200 rounded-xl focus:border-purple-500 transition-all duration-300 hover:border-purple-300"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-red-500" />
                      <span>Password *</span>
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a secure password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="h-12 border-2 border-gray-200 rounded-xl focus:border-red-500 transition-all duration-300 hover:border-red-300"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    size="lg"
                    className="w-full h-14 bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 rounded-xl"
                  >
                    <div className="flex items-center space-x-2">
                      <Rocket className="h-5 w-5" />
                      <span>{mode === "signup" ? "🚀 Start Kickstarting" : "Continue Journey"}</span>
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  </Button>
                </form>

                {/* Mode Toggle */}
                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-gray-600 mb-3">
                    {mode === "signup" ? "Already have an account?" : "New to AppKickstart?"}
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setMode(mode === "signup" ? "login" : "signup")}
                    className="w-full h-12 border-2 border-gray-300 hover:border-indigo-300 rounded-xl transition-all duration-300"
                  >
                    {mode === "signup" ? "Sign In Instead" : "Create Account"}
                  </Button>
                </div>

                {/* Trust Indicators */}
                <div className="flex items-center justify-center space-x-4 pt-4">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Secure
                  </Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <Clock className="h-3 w-3 mr-1" />
                    1-Hour Setup
                  </Badge>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    <Star className="h-3 w-3 mr-1" />
                    Expert Team
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}