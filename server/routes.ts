import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema, insertUserSchema, insertUserActivitySchema } from "@shared/schema";
import { z } from "zod";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { randomUUID } from "crypto";

// Extend session interface to include user
declare module 'express-session' {
  interface SessionData {
    userId?: string;
    sessionId?: string;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure session middleware
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });

  app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-secret-key',
    store: sessionStore,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      maxAge: sessionTtl,
    },
  }));

  // Initialize database with sample data
  await storage.initializeData();

  // Authentication routes
  app.get("/api/auth/user", async (req: Request, res: Response) => {
    try {
      if (req.session.userId) {
        const user = await storage.getUser(req.session.userId);
        if (user) {
          return res.json(user);
        }
      }
      res.json(null);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists with this email
      if (userData.email) {
        const existingUser = await storage.getUserByEmail(userData.email);
        if (existingUser) {
          return res.status(400).json({ message: "User already exists with this email" });
        }
      }

      const user = await storage.createUser(userData);
      req.session.userId = user.id;
      
      res.json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Registration error:", error);
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.post("/api/auth/logout", async (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Activity tracking
  app.post("/api/activities", async (req: Request, res: Response) => {
    try {
      const activityData = insertUserActivitySchema.parse({
        ...req.body,
        userId: req.session.userId || null,
        sessionId: req.session.sessionId || req.sessionID,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      await storage.createUserActivity(activityData);
      res.json({ success: true });
    } catch (error) {
      console.error("Activity tracking error:", error);
      res.status(500).json({ message: "Failed to track activity" });
    }
  });

  // Get all categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Get services by category or all services
  app.get("/api/services", async (req, res) => {
    try {
      const { category } = req.query;
      
      if (category) {
        // Find category by slug to get the ID
        const categoryData = await storage.getCategoryBySlug(category as string);
        if (!categoryData) {
          return res.status(404).json({ message: "Category not found" });
        }
        const services = await storage.getServicesByCategory(categoryData.id);
        res.json(services);
      } else {
        const services = await storage.getServices();
        res.json(services);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  // Get single service by slug
  app.get("/api/service/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const service = await storage.getServiceBySlug(slug);
      
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      
      res.json(service);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch service" });
    }
  });

  // Create a new lead
  app.post("/api/leads", async (req, res) => {
    try {
      const leadData = insertLeadSchema.parse({
        ...req.body,
        userId: req.session.userId || null
      });
      const lead = await storage.createLead(leadData);
      
      // Track service inquiry activity
      if (req.session.userId || req.sessionID) {
        await storage.createUserActivity({
          userId: req.session.userId || null,
          sessionId: req.sessionID,
          activityType: 'service_inquiry',
          serviceId: leadData.serviceId,
          metadata: { leadId: lead.id },
          ipAddress: req.ip,
          userAgent: req.get('User-Agent')
        });
      }
      
      res.status(201).json({ 
        message: "Lead created successfully",
        lead: lead 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid lead data",
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create lead" });
    }
  });

  // Get all leads (admin endpoint)
  app.get("/api/leads", async (req, res) => {
    try {
      const leads = await storage.getLeads();
      res.json(leads);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch leads" });
    }
  });

  // User activity tracking
  app.post("/api/activities", async (req, res) => {
    try {
      const activityData = insertUserActivitySchema.parse({
        ...req.body,
        userId: req.session.userId || null,
        sessionId: req.sessionID,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });
      
      const activity = await storage.createUserActivity(activityData);
      res.status(201).json({ message: "Activity tracked successfully", activity });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid activity data",
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to track activity" });
    }
  });

  // Admin routes for user activities
  app.get("/api/admin/activities", async (req, res) => {
    try {
      const activities = await storage.getUserActivities();
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  app.get("/api/admin/analytics", async (req, res) => {
    try {
      const analytics = await storage.getActivityAnalytics();
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
