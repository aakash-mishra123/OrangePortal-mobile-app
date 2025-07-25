import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-om-orange rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">OM</span>
            </div>
            <span className="text-2xl font-bold text-om-blue">OrangeMantra</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-om-gray-700 hover:text-om-orange transition-colors">
              Services
            </Link>
            <Link href="/search" className="text-om-gray-700 hover:text-om-orange transition-colors">
              Search
            </Link>
            <Link href="/compare" className="text-om-gray-700 hover:text-om-orange transition-colors">
              Compare
            </Link>
            <a href="#" className="text-om-gray-700 hover:text-om-orange transition-colors">
              About
            </a>
            <Link href="/admin" className="text-om-gray-700 hover:text-om-orange transition-colors">
              Admin
            </Link>
            <Button className="bg-om-orange text-white px-6 py-2 hover:bg-orange-600 transition-colors">
              Get Quote
            </Button>
          </div>
          
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6 text-om-gray-700" />
          </Button>
        </div>
      </nav>
    </header>
  );
}
