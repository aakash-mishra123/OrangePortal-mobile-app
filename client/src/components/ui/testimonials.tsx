import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Rajesh Kumar",
    company: "TechCorp Solutions",
    role: "CTO",
    content: "OrangeMantra transformed our legacy system into a modern, scalable platform. Their expertise in cloud migration saved us months of development time.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    project: "Cloud Migration & Modernization"
  },
  {
    id: 2,
    name: "Priya Sharma",
    company: "RetailMax",
    role: "Head of Digital",
    content: "The e-commerce platform they built for us increased our online sales by 300%. The team's attention to detail and user experience is exceptional.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    project: "Custom E-commerce Development"
  },
  {
    id: 3,
    name: "Michael Chen",
    company: "FinanceFlow",
    role: "Product Manager",
    content: "Outstanding mobile app development. The React Native solution works seamlessly across platforms and our user engagement has tripled.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    project: "Mobile App Development"
  },
  {
    id: 4,
    name: "Sarah Williams",
    company: "HealthTech Pro",
    role: "CEO",
    content: "Their AI automation solutions streamlined our patient management system. We've reduced processing time by 60% while improving accuracy.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    project: "AI & Automation"
  },
  {
    id: 5,
    name: "David Thompson",
    company: "ManufacturingPlus",
    role: "Operations Director",
    content: "The ERP implementation was flawless. OrangeMantra's team understood our complex requirements and delivered exactly what we needed.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    project: "ERP Implementation"
  },
  {
    id: 6,
    name: "Anita Patel",
    company: "StartupHub",
    role: "Founder",
    content: "From concept to launch in just 3 months. Their full-stack development team is incredibly efficient and professional.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    project: "Full Stack Development"
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-om-blue mb-4">
            What Our Clients Say
          </h2>
          <p className="text-xl text-om-gray-500 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what leading companies say about our digital transformation services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="h-full hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                {/* Rating */}
                <div className="flex items-center mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Content */}
                <blockquote className="text-om-gray-600 mb-6">
                  "{testimonial.content}"
                </blockquote>

                {/* Project */}
                <div className="mb-4">
                  <span className="inline-block bg-om-orange-light text-om-orange text-xs font-medium px-3 py-1 rounded-full">
                    {testimonial.project}
                  </span>
                </div>

                {/* Author */}
                <div className="flex items-center">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-om-blue">{testimonial.name}</div>
                    <div className="text-sm text-om-gray-500">
                      {testimonial.role}, {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-om-gray-500 mb-6">
            Ready to join our list of satisfied clients?
          </p>
          <div className="space-x-4">
            <a
              href="#"
              className="inline-block bg-om-orange text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Start Your Project
            </a>
            <a
              href="#"
              className="inline-block border-2 border-om-orange text-om-orange px-8 py-3 rounded-lg font-semibold hover:bg-om-orange hover:text-white transition-colors"
            >
              View Case Studies
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}