import {
  type Category,
  type Service,
  type Lead,
  type User,
  type UserActivity,
  type InsertCategory,
  type InsertService,
  type InsertLead,
  type InsertUser,
  type UpsertUser,
  type InsertUserActivity,
  categories,
  services,
  leads,
  users,
  userActivities
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  
  // Services
  getServices(): Promise<Service[]>;
  getServicesByCategory(categoryId: string): Promise<Service[]>;
  getServiceBySlug(slug: string): Promise<Service | undefined>;
  
  // Leads
  createLead(lead: InsertLead): Promise<Lead>;
  getLeads(): Promise<Lead[]>;
  
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // User Activities
  createUserActivity(activity: InsertUserActivity): Promise<UserActivity>;
  getUserActivities(userId?: string): Promise<UserActivity[]>;
  getActivityAnalytics(): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category;
  }

  async getServices(): Promise<Service[]> {
    return await db.select().from(services);
  }

  async getServicesByCategory(categoryId: string): Promise<Service[]> {
    return await db.select().from(services).where(eq(services.categoryId, categoryId));
  }

  async getServiceBySlug(slug: string): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.slug, slug));
    return service;
  }

  async createLead(lead: InsertLead): Promise<Lead> {
    const [newLead] = await db.insert(leads).values(lead).returning();
    return newLead;
  }

  async getLeads(): Promise<Lead[]> {
    return await db.select().from(leads).orderBy(desc(leads.createdAt));
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async createUserActivity(activity: InsertUserActivity): Promise<UserActivity> {
    const [newActivity] = await db.insert(userActivities).values(activity).returning();
    return newActivity;
  }

  async getUserActivities(userId?: string): Promise<UserActivity[]> {
    if (userId) {
      return await db.select().from(userActivities)
        .where(eq(userActivities.userId, userId))
        .orderBy(desc(userActivities.createdAt));
    }
    return await db.select().from(userActivities).orderBy(desc(userActivities.createdAt));
  }

  async getActivityAnalytics(): Promise<any> {
    // Get activity analytics for admin dashboard
    const activities = await db.select().from(userActivities);
    
    const analytics = {
      totalActivities: activities.length,
      serviceViews: activities.filter(a => a.activityType === 'service_view').length,
      categoryBrowses: activities.filter(a => a.activityType === 'category_browse').length,
      serviceInquiries: activities.filter(a => a.activityType === 'service_inquiry').length,
      recentActivities: activities.slice(0, 10)
    };
    
    return analytics;
  }

  // Initialize database with sample data
  async initializeData(): Promise<void> {
    // Check if data already exists and if we have the new services
    const existingCategories = await this.getCategories();
    const existingServices = await this.getServices();
    
    // If we have the old limited services, clear and reinitialize
    if (existingServices.length > 0 && existingServices.length < 16) {
      console.log("Updating database with comprehensive service data...");
      // Clear existing data in proper order (leads first, then services, then categories)
      await db.delete(leads);
      await db.delete(userActivities);
      await db.delete(services);
      await db.delete(categories);
    } else if (existingCategories.length > 0) {
      return; // Data already initialized with comprehensive services
    }

    // Initialize categories
    const categoriesData = [
      {
        id: "mobile-app-dev",
        name: "Mobile App Development",
        description: "Android, iOS, Flutter, React Native, Backend API, UI/UX Design",
        icon: "fas fa-mobile-alt",
        slug: "mobile-app-dev",
        serviceCount: 6
      },
      {
        id: "web-development",
        name: "Web Development",
        description: "Frontend, Backend, Full-Stack, CMS, PWA, E-commerce",
        icon: "fas fa-code",
        slug: "web-development",
        serviceCount: 6
      },
      {
        id: "design-creative",
        name: "Design & Creative",
        description: "UI/UX Design, Branding, Logo Design, Graphic Design",
        icon: "fas fa-palette",
        slug: "design-creative",
        serviceCount: 4
      },
      {
        id: "ecommerce",
        name: "E-commerce Solutions",
        description: "Shopify, WooCommerce, Magento, Custom E-commerce Platforms",
        icon: "fas fa-shopping-cart",
        slug: "ecommerce",
        serviceCount: 4
      },
      {
        id: "devops",
        name: "DevOps & Cloud",
        description: "CI/CD, AWS/Azure/GCP, Docker, Kubernetes, Infrastructure",
        icon: "fas fa-cloud",
        slug: "devops",
        serviceCount: 5
      },
      {
        id: "consulting",
        name: "Digital Consulting",
        description: "Strategy, Digital Transformation, Tech Consulting",
        icon: "fas fa-lightbulb",
        slug: "consulting",
        serviceCount: 3
      },
      {
        id: "ai-automation",
        name: "AI & Automation",
        description: "Machine Learning, AI Integration, Process Automation",
        icon: "fas fa-robot",
        slug: "ai-automation",
        serviceCount: 4
      },
      {
        id: "data-analytics",
        name: "Data & Analytics",
        description: "Data Science, Business Intelligence, Analytics Dashboards",
        icon: "fas fa-chart-line",
        slug: "data-analytics",
        serviceCount: 3
      }
    ];

    await db.insert(categories).values(categoriesData);

    // Initialize services with real rates and comprehensive data
    const servicesData = [
      // Mobile App Development Services
      {
        id: "android-native-development",
        title: "Android Native Development",
        description: "Professional Android app development using Kotlin and Java with native performance and latest Material Design principles.",
        longDescription: "Build powerful, scalable Android applications with our expert development team. We use the latest Android technologies including Jetpack Compose, Room database, and modern architecture patterns like MVVM and Clean Architecture. Our apps are optimized for performance, security, and user experience across all Android devices.",
        categoryId: "mobile-app-dev",
        hourlyRate: 2500,
        monthlyRate: 180000,
        features: ["Native Android Development with Kotlin/Java", "Jetpack Compose UI Development", "Material Design 3 Implementation", "Room Database Integration", "Firebase Integration", "Google Play Console Setup", "Performance Optimization", "Security Implementation", "Push Notifications", "In-App Purchases", "Testing & Debugging", "App Store Deployment"],
        technologies: ["Kotlin", "Java", "Android Studio", "Jetpack Compose", "Room", "Firebase", "Retrofit", "Dagger Hilt", "Coroutines", "Material Design"],
        imageUrl: "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=800&h=600&fit=crop",
        slug: "android-native-development"
      },
      {
        id: "ios-native-development", 
        title: "iOS Native Development",
        description: "Expert iOS app development using Swift and SwiftUI with native performance and Apple's Human Interface Guidelines.",
        longDescription: "Create stunning iOS applications that leverage the full power of Apple's ecosystem. Our iOS development team specializes in Swift, SwiftUI, and UIKit to build apps that feel native to Apple devices. We follow Apple's design guidelines and best practices for optimal App Store approval and user satisfaction.",
        categoryId: "mobile-app-dev",
        hourlyRate: 2800,
        monthlyRate: 200000,
        features: ["Native iOS Development with Swift", "SwiftUI & UIKit Implementation", "Core Data Integration", "CloudKit Synchronization", "Apple Pay Integration", "HealthKit & ARKit Support", "App Store Connect Setup", "Push Notifications via APNs", "TestFlight Beta Testing", "App Store Optimization", "Universal App Support", "Accessibility Compliance"],
        technologies: ["Swift", "SwiftUI", "UIKit", "Xcode", "Core Data", "CloudKit", "Combine", "ARKit", "HealthKit", "MapKit"],
        imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop",
        slug: "ios-native-development"
      },
      {
        id: "flutter-development",
        title: "Flutter Cross-Platform Development", 
        description: "High-performance cross-platform mobile apps using Flutter with single codebase for iOS and Android.",
        longDescription: "Develop beautiful, natively compiled applications for mobile, web, and desktop from a single codebase using Google's Flutter framework. Our Flutter experts create fast, expressive, and flexible apps with custom animations and seamless user experiences that work perfectly on both iOS and Android.",
        categoryId: "mobile-app-dev",
        hourlyRate: 2200,
        monthlyRate: 160000,
        features: ["Cross-Platform Development", "Single Codebase for iOS & Android", "Custom Widget Development", "State Management (Riverpod/Bloc)", "Firebase Integration", "REST API Integration", "Local Database (SQLite/Hive)", "Push Notifications", "App Store Deployment", "Performance Optimization", "Custom Animations", "Platform-Specific Features"],
        technologies: ["Flutter", "Dart", "Firebase", "Riverpod", "Bloc", "Dio", "Hive", "SQLite", "GetX", "Provider"],
        imageUrl: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop", 
        slug: "flutter-development"
      },
      {
        id: "react-native-development",
        title: "React Native Development",
        description: "Cross-platform mobile app development using React Native with JavaScript/TypeScript for faster development cycles.",
        longDescription: "Build cross-platform mobile applications using React Native that share code between iOS and Android while maintaining native performance. Our React Native team leverages the power of JavaScript and React to create apps with shorter development cycles and easier maintenance.",
        categoryId: "mobile-app-dev", 
        hourlyRate: 2000,
        monthlyRate: 145000,
        features: ["Cross-Platform Mobile Development", "JavaScript/TypeScript Implementation", "Native Module Integration", "Redux/Context State Management", "REST API & GraphQL Integration", "Expo Development Tools", "React Navigation", "AsyncStorage Data Persistence", "Push Notifications", "Code Push Updates", "Performance Optimization", "Third-Party Library Integration"],
        technologies: ["React Native", "JavaScript", "TypeScript", "Expo", "Redux", "React Navigation", "Async Storage", "Firebase", "GraphQL"],
        imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop",
        slug: "react-native-development"
      },
      {
        id: "backend-api-development",
        title: "Backend API Development",
        description: "Robust and scalable backend API development for mobile apps with cloud deployment and database management.",
        longDescription: "Build powerful, secure, and scalable backend systems that power your mobile applications. Our backend development team specializes in creating RESTful APIs, GraphQL endpoints, real-time features, and cloud-based solutions that can handle millions of users with high availability and performance.",
        categoryId: "mobile-app-dev",
        hourlyRate: 2300,
        monthlyRate: 165000,
        features: ["RESTful API Development", "GraphQL Implementation", "Database Design & Optimization", "Authentication & Authorization", "Real-time Features (WebSocket)", "Cloud Deployment (AWS/GCP/Azure)", "Auto-scaling Configuration", "API Documentation", "Security Implementation", "Performance Monitoring", "Data Analytics Integration", "Third-Party API Integration"],
        technologies: ["Node.js", "Python", "PostgreSQL", "MongoDB", "Redis", "AWS", "Docker", "Kubernetes", "GraphQL", "Socket.io"],
        imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop",
        slug: "backend-api-development"
      },
      {
        id: "mobile-ui-design",
        title: "Mobile App UI/UX Design",
        description: "Professional mobile app design services with user research, wireframing, prototyping, and design systems.",
        longDescription: "Create exceptional mobile app experiences with our comprehensive UI/UX design services. Our design team conducts thorough user research, creates detailed wireframes and interactive prototypes, and develops complete design systems that ensure consistent and intuitive user experiences across your mobile application.",
        categoryId: "mobile-app-dev",
        hourlyRate: 2000,
        monthlyRate: 140000,
        features: ["User Research & Persona Development", "Information Architecture", "Wireframing & User Flow Design", "High-Fidelity Mockups", "Interactive Prototyping", "Design System Creation", "Icon & Illustration Design", "Usability Testing", "Accessibility Design", "Platform-Specific Guidelines", "Design Handoff to Developers", "Post-Launch Optimization"],
        technologies: ["Figma", "Adobe XD", "Sketch", "InVision", "Principle", "Framer", "Zeplin", "Abstract", "Marvel", "Maze"],
        imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
        slug: "mobile-ui-design"
      },

      // Web Development Services
      {
        id: "frontend-development",
        title: "Frontend Development",
        description: "Modern responsive web development using React, Vue.js, Angular with latest web technologies and best practices.",
        longDescription: "Build stunning, responsive, and high-performance web applications using cutting-edge frontend technologies. Our frontend development team specializes in creating interactive user interfaces, implementing modern design systems, and ensuring optimal performance across all devices and browsers.",
        categoryId: "web-development",
        hourlyRate: 2000,
        monthlyRate: 145000,
        features: ["Responsive Web Development", "Modern JavaScript Frameworks", "Progressive Web Apps (PWA)", "Component-Based Architecture", "State Management", "API Integration", "Performance Optimization", "SEO Implementation", "Cross-Browser Compatibility", "Accessibility Standards", "Testing & Debugging", "Deployment & CI/CD"],
        technologies: ["React", "Vue.js", "Angular", "TypeScript", "Next.js", "Nuxt.js", "Tailwind CSS", "SASS", "Webpack", "Vite"],
        imageUrl: "https://images.unsplash.com/photo-1593720219276-0b1eacd0aef4?w=800&h=600&fit=crop",
        slug: "frontend-development"
      },
      {
        id: "fullstack-development", 
        title: "Full-Stack Web Development",
        description: "Complete web application development with frontend, backend, database, and deployment services.",
        longDescription: "Get comprehensive web development services from our full-stack team. We handle everything from database design and backend API development to frontend implementation and cloud deployment, ensuring your web application is scalable, secure, and performant.",
        categoryId: "web-development",
        hourlyRate: 2500,
        monthlyRate: 180000,
        features: ["End-to-End Web Development", "Database Design & Implementation", "Backend API Development", "Frontend User Interface", "Authentication & Authorization", "Payment Gateway Integration", "Real-time Features", "Cloud Deployment", "Performance Optimization", "Security Implementation", "Testing & Quality Assurance", "Maintenance & Support"],
        technologies: ["MERN Stack", "MEAN Stack", "Django", "Laravel", "Ruby on Rails", "PostgreSQL", "MongoDB", "AWS", "Docker", "Redis"],
        imageUrl: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=600&fit=crop",
        slug: "fullstack-development"
      },
      {
        id: "cms-development",
        title: "CMS Development",
        description: "Custom content management system development and WordPress/Drupal customization with advanced features.",
        longDescription: "Develop custom content management systems or customize existing CMS platforms to fit your specific business needs. We ensure easy content management, scalable architecture, and powerful admin interfaces that make content updates simple and efficient.",
        categoryId: "web-development",
        hourlyRate: 1800,
        monthlyRate: 130000,
        features: ["Custom CMS Development", "WordPress Customization", "Drupal Development", "Content Architecture", "User Management", "SEO Optimization", "Multi-language Support", "Media Management", "Custom Post Types", "Advanced Admin Panel", "API Development", "Third-party Integrations"],
        technologies: ["WordPress", "Drupal", "Strapi", "Sanity", "Contentful", "Ghost", "Craft CMS", "ProcessWire"],
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
        slug: "cms-development"
      },
      {
        id: "ecommerce-development",
        title: "E-commerce Development",
        description: "Custom e-commerce platform development with shopping cart, payment integration, and inventory management.",
        longDescription: "Build powerful e-commerce solutions that drive sales and provide exceptional shopping experiences. Our e-commerce development team specializes in creating custom online stores with advanced features like inventory management, payment processing, and analytics.",
        categoryId: "web-development",
        hourlyRate: 2200,
        monthlyRate: 160000,
        features: ["Custom E-commerce Platform", "Shopping Cart Development", "Payment Gateway Integration", "Inventory Management", "Order Management System", "Customer Portal", "Admin Dashboard", "Mobile Responsive Design", "SEO Optimization", "Analytics Integration", "Multi-currency Support", "Shipping Integration"],
        technologies: ["Shopify", "WooCommerce", "Magento", "Next.js Commerce", "Medusa", "Saleor", "BigCommerce"],
        imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
        slug: "ecommerce-development"
      },
      {
        id: "progressive-web-app",
        title: "Progressive Web App (PWA)",
        description: "Modern PWA development that combines web and mobile app features with offline capabilities.",
        longDescription: "Create progressive web applications that provide native app-like experiences on the web. Our PWA development includes offline functionality, push notifications, app-like navigation, and installation capabilities across all devices.",
        categoryId: "web-development",
        hourlyRate: 2100,
        monthlyRate: 150000,
        features: ["App-like Experience", "Offline Functionality", "Push Notifications", "Service Workers", "App Installation", "Fast Loading", "Responsive Design", "Cross-platform Compatibility", "Native Device Features", "App Store Distribution", "Performance Optimization", "Security Implementation"],
        technologies: ["React", "Vue.js", "Angular", "Service Workers", "Web App Manifest", "IndexedDB", "Push API"],
        imageUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop",
        slug: "progressive-web-app"
      },
      {
        id: "api-development",
        title: "API Development & Integration",
        description: "RESTful API and GraphQL development with comprehensive documentation and third-party integrations.",
        longDescription: "Build robust, scalable APIs that power your web and mobile applications. Our API development services include RESTful APIs, GraphQL endpoints, comprehensive documentation, and seamless third-party service integrations.",
        categoryId: "web-development",
        hourlyRate: 2000,
        monthlyRate: 145000,
        features: ["RESTful API Development", "GraphQL Implementation", "API Documentation", "Authentication & Authorization", "Rate Limiting", "Caching Strategies", "Third-party Integrations", "Webhook Implementation", "API Testing", "Version Management", "Security Implementation", "Performance Monitoring"],
        technologies: ["Node.js", "Express.js", "GraphQL", "PostgreSQL", "MongoDB", "Redis", "Swagger", "Postman"],
        imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop",
        slug: "api-development"
      },

      // Design & Creative Services
      {
        id: "ui-ux-design",
        title: "UI/UX Design",
        description: "Complete user interface and experience design for web and mobile applications with user research and testing.",
        longDescription: "Our UI/UX design service focuses on creating intuitive, user-friendly interfaces that enhance user experience and drive business results. We follow design thinking methodology and conduct thorough user research to ensure the final product meets both user needs and business objectives.",
        categoryId: "design-creative",
        hourlyRate: 1800,
        monthlyRate: 130000,
        features: ["User Research & Analysis", "Information Architecture", "Wireframing & Prototyping", "Visual Design", "Interactive Prototypes", "Design Systems", "Usability Testing", "Accessibility Design", "Design Handoff", "Post-launch Optimization"],
        technologies: ["Figma", "Adobe XD", "Sketch", "InVision", "Principle", "Framer", "Maze", "Hotjar"],
        imageUrl: "https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=800&h=600&fit=crop",
        slug: "ui-ux-design"
      },
      {
        id: "branding-design",
        title: "Branding & Logo Design",
        description: "Complete brand identity design including logos, color schemes, typography, and comprehensive brand guidelines.",
        longDescription: "Build a strong brand identity that resonates with your target audience. Our branding service includes logo design, color palette selection, typography, and comprehensive brand guidelines to ensure consistency across all touchpoints.",
        categoryId: "design-creative",
        hourlyRate: 1500,
        monthlyRate: 110000,
        features: ["Logo Design", "Brand Strategy", "Brand Guidelines", "Color Palette", "Typography Selection", "Brand Assets", "Business Cards", "Letterhead Design", "Social Media Assets", "Brand Application", "Market Research", "Competitor Analysis"],
        technologies: ["Adobe Illustrator", "Adobe Photoshop", "Figma", "Adobe InDesign", "Adobe After Effects"],
        imageUrl: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=600&fit=crop",
        slug: "branding-design"
      },
      {
        id: "graphic-design",
        title: "Graphic Design Services",
        description: "Professional graphic design for marketing materials, social media, presentations, and print materials.",
        longDescription: "Create visually compelling graphic designs that communicate your message effectively. Our graphic design services cover everything from marketing materials and social media graphics to presentations and print materials.",
        categoryId: "design-creative",
        hourlyRate: 1200,
        monthlyRate: 85000,
        features: ["Marketing Materials", "Social Media Graphics", "Presentation Design", "Print Design", "Infographics", "Banner Design", "Brochure Design", "Poster Design", "Business Card Design", "Packaging Design", "Icon Design", "Illustration"],
        technologies: ["Adobe Photoshop", "Adobe Illustrator", "Adobe InDesign", "Canva Pro", "Figma"],
        imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
        slug: "graphic-design"
      },
      {
        id: "web-design",
        title: "Web Design",
        description: "Modern, responsive web design with focus on user experience and conversion optimization.",
        longDescription: "Design beautiful, functional websites that engage users and drive conversions. Our web design process includes user research, wireframing, visual design, and optimization for all devices and screen sizes.",
        categoryId: "design-creative",
        hourlyRate: 1600,
        monthlyRate: 115000,
        features: ["Responsive Web Design", "Landing Page Design", "Website Redesign", "Conversion Optimization", "User Experience Design", "Visual Design", "Typography", "Color Theory", "Design Systems", "Accessibility Design", "Mobile-first Design", "Cross-browser Testing"],
        technologies: ["Figma", "Adobe XD", "Sketch", "Webflow", "Adobe Photoshop", "Adobe Illustrator"],
        imageUrl: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop",
        slug: "web-design"
      }
    ];

    await db.insert(services).values(servicesData);
  }
}

export const storage = new DatabaseStorage();