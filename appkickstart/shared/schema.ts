import { z } from 'zod';

// Service Categories Schema
export const serviceCategories = [
  { 
    id: 'design-creative', 
    name: 'Design & Creative', 
    description: 'UI/UX Design, Wireframing, Mobile UI',
    icon: 'fas fa-palette',
    slug: 'design-creative',
    serviceCount: 3
  },
  { 
    id: 'web-development', 
    name: 'Web Development', 
    description: 'Frontend, Backend, CMS, PWA',
    icon: 'fas fa-code',
    slug: 'web-development',
    serviceCount: 3
  },
  { 
    id: 'mobile-app-dev', 
    name: 'Mobile App Dev', 
    description: 'Android, iOS, React Native',
    icon: 'fas fa-mobile-alt',
    slug: 'mobile-app-dev',
    serviceCount: 3,
    featured: true
  },
  { 
    id: 'ecommerce', 
    name: 'E-commerce', 
    description: 'Shopify, Magento, Custom Store',
    icon: 'fas fa-shopping-cart',
    slug: 'ecommerce',
    serviceCount: 2
  },
  { 
    id: 'devops', 
    name: 'DevOps', 
    description: 'CI/CD, Cloud Migration, Terraform',
    icon: 'fas fa-cloud',
    slug: 'devops',
    serviceCount: 3
  },
  { 
    id: 'consulting', 
    name: 'Consulting', 
    description: 'Strategy, Digital Transformation',
    icon: 'fas fa-lightbulb',
    slug: 'consulting',
    serviceCount: 2
  }
] as const;

// Mobile App Development Sub-Services
export const mobileAppServices = [
  {
    id: 'android-native',
    title: 'Android Native App',
    description: 'High-performance native Android apps using Kotlin/Java',
    hourlyRate: 1250,
    features: ['Native Performance', 'Material Design', 'Play Store Ready']
  },
  {
    id: 'ios-native',
    title: 'iOS Native App',
    description: 'Premium iOS apps using Swift with App Store optimization',
    hourlyRate: 1250,
    features: ['iOS Guidelines', 'App Store Ready', 'Premium UX']
  },
  {
    id: 'flutter-app',
    title: 'Flutter App',
    description: 'Cross-platform apps with single codebase for iOS & Android',
    hourlyRate: 1250,
    features: ['Cross-Platform', 'Fast Development', 'Single Codebase']
  },
  {
    id: 'react-native-app',
    title: 'React Native App',
    description: 'Native mobile apps using React Native framework',
    hourlyRate: 1250,
    features: ['React Ecosystem', 'Hot Reload', 'Cross-Platform']
  },
  {
    id: 'backend-api',
    title: 'Backend API',
    description: 'Scalable backend APIs using Firebase or Node.js',
    hourlyRate: 1250,
    features: ['RESTful APIs', 'Real-time Database', 'Authentication']
  },
  {
    id: 'app-ui-design',
    title: 'App UI Design',
    description: 'Modern, user-friendly mobile app interface design',
    hourlyRate: 1250,
    features: ['Modern Design', 'User-Friendly', 'Figma Prototypes']
  }
] as const;

// Lead Form Schema
export const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  email: z.string().email('Please enter a valid email address'),
  projectBrief: z.string().min(10, 'Please provide more details about your project'),
  budget: z.string().min(1, 'Please select a budget range'),
  serviceId: z.string(),
  serviceName: z.string()
});

export type Lead = z.infer<typeof leadSchema> & {
  _id?: string;
  createdAt?: Date;
  status?: 'new' | 'contacted' | 'in-progress' | 'completed' | 'cancelled';
};

export type InsertLead = z.infer<typeof leadSchema>;

// Admin Schema
export const adminSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2)
});

export type Admin = z.infer<typeof adminSchema> & {
  _id?: string;
  createdAt?: Date;
};

// Google OAuth User Schema
export const googleUserSchema = z.object({
  googleId: z.string(),
  email: z.string().email(),
  name: z.string(),
  picture: z.string().optional()
});

export type GoogleUser = z.infer<typeof googleUserSchema> & {
  _id?: string;
  createdAt?: Date;
};

// Budget Options
export const budgetOptions = [
  '₹25,000 - ₹50,000',
  '₹50,000 - ₹1,00,000',
  '₹1,00,000 - ₹2,50,000',
  '₹2,50,000 - ₹5,00,000',
  '₹5,00,000+'
] as const;