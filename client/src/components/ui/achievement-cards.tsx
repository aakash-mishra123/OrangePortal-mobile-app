import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Users, Clock, Award, CheckCircle, Zap } from "lucide-react";

const achievements = [
  {
    id: "satisfaction",
    icon: Star,
    title: "Client Satisfaction",
    value: "95%",
    description: "Happy clients worldwide",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200"
  },
  {
    id: "availability",
    icon: Users,
    title: "Team Availability",
    value: "24/7",
    description: "Round-the-clock support",
    color: "text-green-600", 
    bgColor: "bg-green-50",
    borderColor: "border-green-200"
  },
  {
    id: "response",
    icon: Clock,
    title: "Response Time",
    value: "5 Minutes",
    description: "Average initial response",
    color: "text-blue-600",
    bgColor: "bg-blue-50", 
    borderColor: "border-blue-200"
  },
  {
    id: "delivery",
    icon: CheckCircle,
    title: "On-Time Delivery",
    value: "98%",
    description: "Projects delivered on schedule",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200"
  },
  {
    id: "projects",
    icon: Award,
    title: "Projects Completed",
    value: "500+",
    description: "Successful implementations",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200"
  },
  {
    id: "expertise",
    icon: Zap,
    title: "Technical Expertise",
    value: "10+ Years",
    description: "Industry experience",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200"
  }
];

export default function AchievementCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
      {achievements.map((achievement, index) => {
        const IconComponent = achievement.icon;
        return (
          <Card 
            key={achievement.id}
            className={`${achievement.bgColor} ${achievement.borderColor} hover:shadow-md transition-all duration-200 hover-lift animate-in slide-in-from-bottom-4 duration-500`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-4 text-center">
              <div className={`w-12 h-12 mx-auto mb-3 ${achievement.bgColor} rounded-full flex items-center justify-center`}>
                <IconComponent className={`h-6 w-6 ${achievement.color}`} />
              </div>
              <div className={`text-2xl font-bold ${achievement.color} mb-1`}>
                {achievement.value}
              </div>
              <div className="text-sm font-medium text-gray-700 mb-1">
                {achievement.title}
              </div>
              <div className="text-xs text-gray-600">
                {achievement.description}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}