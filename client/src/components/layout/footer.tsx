import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-om-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-om-orange rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">OM</span>
              </div>
              <span className="text-xl font-bold">OrangeMantra</span>
            </div>
            <p className="text-gray-400 mb-4">
              Leading digital transformation company helping enterprises leverage technology for growth and innovation.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-om-orange transition-colors">
                <i className="fab fa-linkedin text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-om-orange transition-colors">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-om-orange transition-colors">
                <i className="fab fa-facebook text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-om-orange transition-colors">
                <i className="fab fa-github text-xl"></i>
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/category/web-development" className="hover:text-om-orange transition-colors">
                  Web Development
                </Link>
              </li>
              <li>
                <Link href="/category/mobile-app-dev" className="hover:text-om-orange transition-colors">
                  Mobile Apps
                </Link>
              </li>
              <li>
                <Link href="/category/devops" className="hover:text-om-orange transition-colors">
                  Cloud Solutions
                </Link>
              </li>
              <li>
                <Link href="/category/ai-automation" className="hover:text-om-orange transition-colors">
                  AI & Automation
                </Link>
              </li>
              <li>
                <Link href="/category/consulting" className="hover:text-om-orange transition-colors">
                  Digital Consulting
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-om-orange transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-om-orange transition-colors">Our Team</a></li>
              <li><a href="#" className="hover:text-om-orange transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-om-orange transition-colors">Case Studies</a></li>
              <li><a href="#" className="hover:text-om-orange transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center space-x-2">
                <i className="fas fa-envelope text-om-orange"></i>
                <span>hello@orangemantra.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <i className="fas fa-phone text-om-orange"></i>
                <span>+91 120 415 5252</span>
              </li>
              <li className="flex items-center space-x-2">
                <i className="fas fa-map-marker-alt text-om-orange"></i>
                <span>Noida, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 OrangeMantra. All rights reserved. | Privacy Policy | Terms of Service</p>
        </div>
      </div>
    </footer>
  );
}
