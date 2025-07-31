import "dotenv/config";
import express from 'express';
import session from "express-session";
import connectPg from "connect-pg-simple";
import { storage } from "../server/storage.js";
import { insertLeadSchema, insertUserSchema, insertUserActivitySchema } from "../shared/schema.js";
import { z } from "zod";
import { randomUUID } from "crypto";

// Create Express app
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

// Session configuration - only if DATABASE_URL is available
if (process.env.DATABASE_URL) {
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
} else {
  // Fallback to memory store for development
  app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  }));
}

// Initialize database if available
let dbInitialized = false;
async function initializeDb() {
  if (!dbInitialized && process.env.DATABASE_URL) {
    try {
      await storage.initializeData();
      dbInitialized = true;
      console.log("✅ Database initialized successfully");
    } catch (error) {
      console.error("❌ Database initialization failed:", error);
    }
  }
}

// Health check
app.get("/api/health", async (req, res) => {
  await initializeDb();
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: process.env.DATABASE_URL ? 'connected' : 'not configured'
  });
});

// Authentication routes
app.get("/api/auth/user", async (req, res) => {
  await initializeDb();
  try {
    if (req.session.userId && process.env.DATABASE_URL) {
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

// Categories routes
app.get("/api/categories", async (req, res) => {
  await initializeDb();
  try {
    if (process.env.DATABASE_URL) {
      const categories = await storage.getCategories();
      res.json(categories);
    } else {
      // Fallback mock data
      res.json([
        { id: '1', name: 'Web Development', slug: 'web-development', description: 'Modern web applications', icon: '🌐', serviceCount: 5 },
        { id: '2', name: 'Mobile Apps', slug: 'mobile-apps', description: 'iOS and Android apps', icon: '📱', serviceCount: 3 }
      ]);
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});

// Services routes
app.get("/api/services", async (req, res) => {
  await initializeDb();
  try {
    const { category } = req.query;
    if (process.env.DATABASE_URL) {
      const services = await storage.getServices(category);
      res.json(services);
    } else {
      // Fallback mock data
      res.json([
        { id: '1', title: 'React Website', slug: 'react-website', description: 'Modern React website', category: 'web-development' },
        { id: '2', title: 'Mobile App', slug: 'mobile-app', description: 'Native mobile app', category: 'mobile-apps' }
      ]);
    }
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ message: "Failed to fetch services" });
  }
});

// Export the Express app for Vercel
export default app;
