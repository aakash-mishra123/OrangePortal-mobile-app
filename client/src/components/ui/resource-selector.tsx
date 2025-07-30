import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface ResourceType {
  id: string;
  title: string;
  description: string;
  hourlyRate: number;
  skills: string[];
}

const resourceTypes: ResourceType[] = [
  {
    id: "frontend",
    title: "Frontend Developer",
    description: "Specializes in user interfaces and user experience",
    hourlyRate: 1250,
    skills: ["React", "Vue.js", "Angular", "TypeScript", "CSS", "HTML"]
  },
  {
    id: "backend",
    title: "Backend Developer", 
    description: "Focuses on server-side logic and database management",
    hourlyRate: 1400,
    skills: ["Node.js", "Python", "Java", "PostgreSQL", "MongoDB", "APIs"]
  },
  {
    id: "fullstack",
    title: "Fullstack Developer",
    description: "Expertise in both frontend and backend development",
    hourlyRate: 1600,
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS", "Docker"]
  },
  {
    id: "uiux",
    title: "UI/UX Designer",
    description: "Creates intuitive and beautiful user experiences",
    hourlyRate: 1100,
    skills: ["Figma", "Adobe XD", "Sketch", "Prototyping", "User Research", "Wireframing"]
  },
  {
    id: "qa",
    title: "QA Engineer",
    description: "Ensures product quality through comprehensive testing",
    hourlyRate: 950,
    skills: ["Test Automation", "Selenium", "Jest", "Manual Testing", "API Testing", "Performance Testing"]
  }
];

interface ResourceSelectorProps {
  selectedResource: string | null;
  onResourceSelect: (resourceId: string) => void;
}

export default function ResourceSelector({ selectedResource, onResourceSelect }: ResourceSelectorProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Select Resource Type</h3>
      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        {resourceTypes.map((resource, index) => (
          <Card 
            key={resource.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-bounce-slow ${
              selectedResource === resource.id 
                ? 'ring-2 ring-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-lg' 
                : 'hover:bg-gradient-to-br hover:from-gray-50 hover:to-blue-50 interactive-card border-gray-200'
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => onResourceSelect(resource.id)}
          >
            <CardHeader className="pb-3 sm:pb-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base sm:text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    {resource.title}
                  </CardTitle>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">{resource.description}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {selectedResource === resource.id && (
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-bounce-slow shadow-lg">
                      <Check className="h-3 w-3 sm:h-5 sm:w-5 text-white" />
                    </div>
                  )}
                  <Badge variant="outline" className="bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200 text-xs font-semibold">
                    ₹{resource.hourlyRate}/hr
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {resource.skills.slice(0, 3).map((skill, skillIndex) => (
                  <Badge 
                    key={skill} 
                    variant="secondary" 
                    className="text-xs transition-all duration-200 bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 border-purple-200 animate-in slide-in-from-bottom-2"
                    style={{ animationDelay: `${skillIndex * 50}ms` }}
                  >
                    {skill}
                  </Badge>
                ))}
                {resource.skills.length > 3 && (
                  <Badge variant="secondary" className="text-xs bg-gradient-to-r from-orange-50 to-red-50 text-orange-700 border-orange-200">
                    +{resource.skills.length - 3} more
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export { resourceTypes };
export type { ResourceType };