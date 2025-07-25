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
  // Categories
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
    // Check if data already exists
    const existingCategories = await this.getCategories();
    if (existingCategories.length > 0) {
      return; // Data already initialized
    }

    // Initialize categories
    const categoriesData = [
      {
        id: "design-creative",
        name: "Design & Creative",
        description: "UI/UX Design, Wireframing, Mobile UI",
        icon: "fas fa-palette",
        slug: "design-creative",
        serviceCount: 3
      },
      {
        id: "web-development",
        name: "Web Development",
        description: "Frontend, Backend, CMS, PWA",
        icon: "fas fa-code",
        slug: "web-development",
        serviceCount: 3
      },
      {
        id: "mobile-app-dev",
        name: "Mobile App Dev",
        description: "Android, iOS, React Native",
        icon: "fas fa-mobile-alt",
        slug: "mobile-app-dev",
        serviceCount: 3
      },
      {
        id: "ecommerce",
        name: "E-commerce",
        description: "Shopify, Magento, Custom Store",
        icon: "fas fa-shopping-cart",
        slug: "ecommerce",
        serviceCount: 2
      },
      {
        id: "devops",
        name: "DevOps",
        description: "CI/CD, Cloud Migration, Terraform",
        icon: "fas fa-cloud",
        slug: "devops",
        serviceCount: 3
      },
      {
        id: "consulting",
        name: "Consulting",
        description: "Strategy, Digital Transformation",
        icon: "fas fa-lightbulb",
        slug: "consulting",
        serviceCount: 2
      }
    ];

    await db.insert(categories).values(categoriesData);

    // Initialize services
    const servicesData = [
      // Design & Creative Services
      {
        id: "ui-ux-design",
        title: "UI/UX Design",
        description: "Complete user interface and experience design for web and mobile applications",
        longDescription: "Our UI/UX design service focuses on creating intuitive, user-friendly interfaces that enhance user experience and drive business results. We follow design thinking methodology and conduct thorough user research to ensure the final product meets both user needs and business objectives.",
        categoryId: "design-creative",
        hourlyRate: 75,
        monthlyRate: 12000,
        features: ["User Research", "Wireframing", "Prototyping", "Design Systems", "Usability Testing"],
        technologies: ["Figma", "Adobe XD", "Sketch", "InVision", "Principle"],
        imageUrl: "https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=500",
        slug: "ui-ux-design"
      },
      {
        id: "mobile-ui-design",
        title: "Mobile UI Design",
        description: "Specialized mobile interface design for iOS and Android applications",
        longDescription: "Mobile-first design approach ensuring your app provides an excellent user experience across all mobile devices. We focus on touch-friendly interfaces, optimal navigation patterns, and platform-specific design guidelines.",
        categoryId: "design-creative",
        hourlyRate: 65,
        monthlyRate: 10500,
        features: ["iOS Design Guidelines", "Material Design", "Touch Interface", "Responsive Mobile", "App Store Assets"],
        technologies: ["Figma", "Sketch", "Adobe XD", "Framer", "Zeplin"],
        imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500",
        slug: "mobile-ui-design"
      },
      {
        id: "branding-design",
        title: "Branding & Logo Design",
        description: "Complete brand identity design including logos, color schemes, and brand guidelines",
        longDescription: "Build a strong brand identity that resonates with your target audience. Our branding service includes logo design, color palette selection, typography, and comprehensive brand guidelines to ensure consistency across all touchpoints.",
        categoryId: "design-creative",
        hourlyRate: 80,
        monthlyRate: 13000,
        features: ["Logo Design", "Brand Guidelines", "Color Palette", "Typography", "Brand Assets"],
        technologies: ["Adobe Illustrator", "Adobe Photoshop", "Figma", "Adobe InDesign"],
        imageUrl: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=500",
        slug: "branding-design"
      },
      // Web Development Services
      {
        id: "frontend-development",
        title: "Frontend Development",
        description: "Modern, responsive frontend development using latest technologies",
        longDescription: "Build fast, responsive, and interactive frontend applications using cutting-edge technologies. We focus on performance optimization, accessibility, and seamless user experience across all devices and browsers.",
        categoryId: "web-development",
        hourlyRate: 85,
        monthlyRate: 14000,
        features: ["Responsive Design", "PWA Development", "Performance Optimization", "Cross-browser Compatibility", "Accessibility"],
        technologies: ["React", "Vue.js", "Angular", "TypeScript", "Tailwind CSS"],
        imageUrl: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=500",
        slug: "frontend-development"
      },
      {
        id: "fullstack-development",
        title: "Full-stack Development",
        description: "Complete web application development from backend to frontend",
        longDescription: "End-to-end web application development covering both frontend and backend. We build scalable, secure, and maintainable applications using modern technology stacks and best practices.",
        categoryId: "web-development",
        hourlyRate: 95,
        monthlyRate: 16000,
        features: ["API Development", "Database Design", "Authentication", "Payment Integration", "Deployment"],
        technologies: ["Node.js", "React", "PostgreSQL", "MongoDB", "Express.js"],
        imageUrl: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=500",
        slug: "fullstack-development"
      },
      {
        id: "cms-development",
        title: "CMS Development",
        description: "Custom content management system development and customization",
        longDescription: "Develop custom content management systems or customize existing CMS platforms to fit your specific business needs. We ensure easy content management and scalable architecture.",
        categoryId: "web-development",
        hourlyRate: 75,
        monthlyRate: 12500,
        features: ["Custom CMS", "WordPress", "Drupal", "Content Architecture", "User Management"],
        technologies: ["WordPress", "Drupal", "Strapi", "Sanity", "Contentful"],
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500",
        slug: "cms-development"
      }
    ];

    await db.insert(services).values(servicesData);
  }
}

export const storage = new DatabaseStorage();