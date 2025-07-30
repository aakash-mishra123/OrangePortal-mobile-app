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
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Select Resource Type</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
        {resourceTypes.map((resource, index) => (
          <Card 
            key={resource.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-2xl hover-lift hover-glow animate-bounce-slow ${
              selectedResource === resource.id 
                ? 'ring-2 ring-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200' 
                : 'hover:bg-gradient-to-br hover:from-gray-50 hover:to-blue-50 interactive-card'
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => onResourceSelect(resource.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  {resource.title}
                </CardTitle>
                {selectedResource === resource.id && (
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-bounce-slow shadow-lg">
                    <Check className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-gray-600">{resource.description}</span>
                <Badge variant="outline" className="bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200 animate-pulse-custom">
                  ₹{resource.hourlyRate}/hr
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-2">
                {resource.skills.slice(0, 4).map((skill, skillIndex) => (
                  <Badge 
                    key={skill} 
                    variant="secondary" 
                    className="text-xs hover-scale transition-all duration-200 bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 border-purple-200 animate-in slide-in-from-bottom-2"
                    style={{ animationDelay: `${skillIndex * 50}ms` }}
                  >
                    {skill}
                  </Badge>
                ))}
                {resource.skills.length > 4 && (
                  <Badge variant="secondary" className="text-xs bg-gradient-to-r from-orange-50 to-red-50 text-orange-700 border-orange-200 animate-pulse-custom">
                    +{resource.skills.length - 4} more
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