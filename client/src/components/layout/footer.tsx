import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import SignupModal from "@/components/auth/signup-modal";

export default function Footer() {
  const { isAuthenticated } = useAuth();
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const handleJoinNow = () => {
    setIsSignupModalOpen(true);
  };

  return (
    <>
      <footer className="bg-gray-900 text-white">
        {/* Join Now Section for Non-Authenticated Users */}
        {!isAuthenticated && (
          <div className="bg-orange-600 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Transform Your Business?
              </h2>
              <p className="text-xl mb-8 text-orange-100">
                Join thousands of businesses that trust OrangeMantra for their digital transformation needs.
              </p>
              <Button
                onClick={handleJoinNow}
                size="lg"
                className="bg-white text-orange-600 hover:bg-gray-100 font-semibold px-8 py-3"
              >
                Join Now - It's Free
              </Button>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="text-2xl font-bold text-orange-400 mb-4">
                OrangeMantra
              </div>
              <p className="text-gray-300 mb-6 max-w-md">
                Leading digital transformation company helping businesses thrive in the digital age with innovative technology solutions.
              </p>
              <div className="space-y-2 text-sm text-gray-400">
                <p>📧 contact@orangemantra.com</p>
                <p>📞 +1 (555) 123-4567</p>
                <p>🏢 123 Business Ave, Tech City, TC 12345</p>
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="/search?category=design-creative" className="hover:text-orange-400 transition-colors">
                    Design & Creative
                  </Link>
                </li>
                <li>
                  <Link href="/search?category=web-development" className="hover:text-orange-400 transition-colors">
                    Web Development
                  </Link>
                </li>
                <li>
                  <Link href="/search?category=mobile-app-dev" className="hover:text-orange-400 transition-colors">
                    Mobile Apps
                  </Link>
                </li>
                <li>
                  <Link href="/search?category=ecommerce" className="hover:text-orange-400 transition-colors">
                    E-commerce
                  </Link>
                </li>
                <li>
                  <Link href="/search?category=devops" className="hover:text-orange-400 transition-colors">
                    DevOps
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="/" className="hover:text-orange-400 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/consultation" className="hover:text-orange-400 transition-colors">
                    Free Consultation
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-orange-400 transition-colors">
                    Case Studies
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-orange-400 transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-orange-400 transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © 2024 OrangeMantra. All rights reserved.
            </div>
            <div className="mt-4 md:mt-0 flex space-x-6 text-sm text-gray-400">
              <Link href="/" className="hover:text-orange-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/" className="hover:text-orange-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="/" className="hover:text-orange-400 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>

      <SignupModal 
        isOpen={isSignupModalOpen} 
        onClose={() => setIsSignupModalOpen(false)} 
      />
    </>
  );
}