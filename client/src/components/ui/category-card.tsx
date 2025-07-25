import { type Category } from "@shared/schema";
import { Link } from "wouter";

interface CategoryCardProps {
  category: Category;
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

export default function CategoryCard({ category }: CategoryCardProps) {
  const icon = iconMap[category.icon] || "🔧";
  const gradient = gradientMap[category.id] || "from-gray-500 to-gray-600";

  return (
    <Link href={`/category/${category.slug}`}>
      <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group border border-gray-100">
        <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
          <span className="text-white text-xl">{icon}</span>
        </div>
        <h3 className="text-lg font-semibold text-om-blue mb-2">{category.name}</h3>
        <p className="text-om-gray-500 text-sm mb-3">{category.description}</p>
        <span className="text-xs text-om-orange font-medium">
          {category.serviceCount} Services
        </span>
      </div>
    </Link>
  );
}
