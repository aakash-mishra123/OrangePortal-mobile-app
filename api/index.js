import "dotenv/config";
import express from 'express';
import session from "express-session";
import connectPg from "connect-pg-simple";
import { storage } from "../server/storage.js";
import { insertLeadSchema, insertUserSchema, insertUserActivitySchema } from "../shared/schema.js";
import { z } from "zod";
import { randomUUID } from "crypto";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  next();
});

// Session configuration
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
    secure: process.env.NODE_ENV === 'production',
    maxAge: sessionTtl,
  },
}));

// Initialize database with sample data
await storage.initializeData();

// Authentication routes
app.get("/api/auth/user", async (req, res) => {
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

app.post("/api/auth/register", async (req, res) => {
  try {
    const userData = insertUserSchema.parse(req.body);
    
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
      return res.status(400).json({ message: "Invalid user data", errors: error.errors });
    }
    console.error("Registration error:", error);
    res.status(500).json({ message: "Failed to register user" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await storage.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    req.session.userId = user.id;
    res.json(user);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Failed to login" });
  }
});

app.post("/api/auth/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ message: "Failed to logout" });
    }
    res.json({ message: "Logged out successfully" });
  });
});

// Categories routes
app.get("/api/categories", async (req, res) => {
  try {
    const categories = await storage.getCategories();
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});

// Services routes
app.get("/api/services", async (req, res) => {
  try {
    const { category } = req.query;
    const services = await storage.getServices(category);
    res.json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ message: "Failed to fetch services" });
  }
});

app.get("/api/service/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const service = await storage.getServiceBySlug(slug);
    
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    
    res.json(service);
  } catch (error) {
    console.error("Error fetching service:", error);
    res.status(500).json({ message: "Failed to fetch service" });
  }
});

// Leads routes
app.post("/api/leads", async (req, res) => {
  try {
    const leadData = insertLeadSchema.parse(req.body);
    
    // Add session ID for guest users
    if (!req.session.userId) {
      leadData.sessionId = req.session.id || randomUUID();
    }
    
    const lead = await storage.createLead(leadData);
    res.status(201).json(lead);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid lead data", errors: error.errors });
    }
    console.error("Error creating lead:", error);
    res.status(500).json({ message: "Failed to create lead" });
  }
});

app.get("/api/leads", async (req, res) => {
  try {
    const leads = await storage.getLeads();
    res.json(leads);
  } catch (error) {
    console.error("Error fetching leads:", error);
    res.status(500).json({ message: "Failed to fetch leads" });
  }
});

// User activities routes
app.post("/api/activities", async (req, res) => {
  try {
    const activityData = insertUserActivitySchema.parse(req.body);
    
    // Add user ID if logged in, otherwise use session ID
    if (req.session.userId) {
      activityData.userId = req.session.userId;
    } else {
      activityData.sessionId = req.session.id || randomUUID();
    }
    
    const activity = await storage.trackUserActivity(activityData);
    res.status(201).json(activity);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid activity data", errors: error.errors });
    }
    console.error("Error tracking activity:", error);
    res.status(500).json({ message: "Failed to track activity" });
  }
});

// Admin routes
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

// PWA Routes
app.get('/manifest.json', (req, res) => {
  res.setHeader('Content-Type', 'application/manifest+json');
  res.sendFile('manifest.json', { root: 'public' });
});

app.get('/sw.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.setHeader('Service-Worker-Allowed', '/');
  res.sendFile('sw.js', { root: 'public' });
});

app.get('/offline.html', (req, res) => {
  res.sendFile('offline.html', { root: 'public' });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Export the Express app
export default app;
