import { type Category } from "@shared/schema";
import { Link } from "wouter";

interface CategoryCardProps {
  category: Category;
  onClick?: () => void;
}

const iconMap: Record<string, string> = {
  "fas fa-palette": "🎨",
  "fas fa-code": "💻",
  "fas fa-mobile-alt": "📱",
  "fas fa-shopping-cart": "🛒",
  "fas fa-cloud": "☁️",
  "fas fa-chart-line": "📈",
  "fas fa-database": "🗄️",
  "fas fa-robot": "🤖",
  "fas fa-bullhorn": "📢",
  "fas fa-sync-alt": "🔄",
  "fas fa-check-circle": "✅",
  "fas fa-life-ring": "🛟",
};

const gradientMap: Record<string, string> = {
  "design-creative": "from-purple-500 to-pink-600",
  "web-development": "from-blue-500 to-cyan-600",
  "mobile-app-dev": "from-green-500 to-emerald-600",
  "ecommerce": "from-orange-500 to-red-600",
  "devops": "from-indigo-500 to-purple-600",
  "consulting": "from-yellow-500 to-orange-600",
  "crm-erp": "from-teal-500 to-blue-600",
  "ai-automation": "from-red-500 to-pink-600",
  "seo-marketing": "from-pink-500 to-rose-600",
  "modernization": "from-violet-500 to-purple-600",
  "qa": "from-emerald-500 to-teal-600",
  "support": "from-amber-500 to-yellow-600",
};

export default function CategoryCard({ category, onClick }: CategoryCardProps) {
  const icon = iconMap[category.icon] || "🔧";
  const gradient = gradientMap[category.id] || "from-gray-500 to-gray-600";

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <Link href={`/category/${category.slug}`}>
      <div 
        className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-300 hover:-translate-y-2 cursor-pointer group border border-gray-200/50 hover:border-blue-200"
        onClick={handleClick}
      >
        <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
          <span className="text-white text-lg sm:text-xl">{icon}</span>
        </div>
        <h3 className="text-base sm:text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2 group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
          {category.name}
        </h3>
        <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2">{category.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            {category.serviceCount} Services
          </span>
          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-white text-xs">→</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
