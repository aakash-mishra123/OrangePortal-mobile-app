import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Menu, X, User, LogOut, Download } from "lucide-react";
import { pwaManager } from "@/lib/pwa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AuthModal from "@/components/auth/auth-modal";

export default function Header() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [canInstallPWA, setCanInstallPWA] = useState(false);
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    setCanInstallPWA(pwaManager.canInstall());
    
    // Listen for PWA install state changes
    const checkInstallability = () => {
      setCanInstallPWA(pwaManager.canInstall());
    };

    window.addEventListener('beforeinstallprompt', checkInstallability);
    window.addEventListener('appinstalled', checkInstallability);

    return () => {
      window.removeEventListener('beforeinstallprompt', checkInstallability);
      window.removeEventListener('appinstalled', checkInstallability);
    };
  }, []);

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', '/api/auth/logout');
    },
    onSuccess: () => {
      toast({
        title: "Logged out successfully",
        description: "Thank you for using OrangeMantra services.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: () => {
      toast({
        title: "Logout failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/search" },
    { name: "Compare", href: "/compare" },
    { name: "Consultation", href: "/consultation" },
  ];

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  const handleLogin = () => {
    setIsSignupModalOpen(true);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleInstallPWA = async () => {
    const installed = await pwaManager.installApp();
    if (installed) {
      toast({
        title: "App installed successfully!",
        description: "AppKickstart is now available on your home screen.",
      });
    }
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div className="text-2xl font-bold text-orange-600">
                OrangeMantra
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "text-orange-600 border-b-2 border-orange-600"
                      : "text-gray-700 hover:text-orange-600"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* PWA Install Button & User Authentication */}
            <div className="hidden md:flex items-center space-x-4">
              {canInstallPWA && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleInstallPWA}
                  className="flex items-center space-x-2 border-orange-200 hover:bg-orange-50"
                >
                  <Download className="h-4 w-4" />
                  <span>Install App</span>
                </Button>
              )}
              
              {isLoading ? (
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
              ) : isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span className="hidden lg:inline">
                        {user.firstName} {user.lastName}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <div className="flex flex-col px-2 py-1">
                        <span className="font-medium">
                          {user.firstName} {user.lastName}
                        </span>
                        <span className="text-sm text-gray-500">{user.email}</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleLogout}
                      disabled={logoutMutation.isPending}
                      className="flex items-center space-x-2 text-red-600 focus:text-red-600"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>{logoutMutation.isPending ? "Logging out..." : "Logout"}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={handleLogin}
                    className="border-orange-600 text-orange-600 hover:bg-orange-50"
                  >
                    Sign Up
                  </Button>
                  <Button 
                    onClick={handleLogin}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Login
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="space-y-3">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block px-3 py-2 text-base font-medium transition-colors ${
                      isActive(item.href)
                        ? "text-orange-600 bg-orange-50"
                        : "text-gray-700 hover:text-orange-600 hover:bg-gray-50"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {/* Mobile Authentication */}
                <div className="pt-4 border-t border-gray-200">
                  {isAuthenticated && user ? (
                    <div className="space-y-3">
                      <div className="px-3 py-2">
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                      <Button
                        variant="ghost"
                        onClick={handleLogout}
                        disabled={logoutMutation.isPending}
                        className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        {logoutMutation.isPending ? "Logging out..." : "Logout"}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        onClick={handleLogin}
                        className="w-full border-orange-600 text-orange-600 hover:bg-orange-50"
                      >
                        Sign Up
                      </Button>
                      <Button
                        onClick={handleLogin}
                        className="w-full bg-orange-600 hover:bg-orange-700"
                      >
                        Login
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <AuthModal 
        isOpen={isSignupModalOpen} 
        onClose={() => setIsSignupModalOpen(false)} 
      />
    </>
  );
}