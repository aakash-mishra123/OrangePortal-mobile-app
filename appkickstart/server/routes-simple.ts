import { Router } from 'express';
import { storage } from './storage.js';
import { leadSchema, mobileAppServices, serviceCategories } from '../shared/schema.js';

const router = Router();

// Public Routes

// Get all service categories
router.get('/api/categories', async (req, res) => {
  try {
    res.json(serviceCategories);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
});

// Get mobile app services
router.get('/api/services/mobile-app', async (req, res) => {
  try {
    // Track analytics for mobile app category
    for (const service of mobileAppServices) {
      await storage.incrementServiceViews(service.id, service.title);
    }
    
    res.json(mobileAppServices);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch services' });
  }
});

// Get all services (fallback)
router.get('/api/services', async (req, res) => {
  try {
    res.json(mobileAppServices);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch services' });
  }
});

// Get single service
router.get('/api/service/:id', async (req, res) => {
  try {
    const service = mobileAppServices.find(s => s.id === req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch service' });
  }
});

// Search services
router.get('/api/search', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.json([]);
    }
    
    const searchTerm = query.toString().toLowerCase();
    
    // Search in categories
    const categoryResults = serviceCategories.filter(cat => 
      cat.name.toLowerCase().includes(searchTerm)
    );
    
    // Search in mobile app services
    const serviceResults = mobileAppServices.filter(service =>
      service.title.toLowerCase().includes(searchTerm) ||
      service.description.toLowerCase().includes(searchTerm) ||
      service.features.some(feature => feature.toLowerCase().includes(searchTerm))
    );
    
    res.json({
      categories: categoryResults,
      services: serviceResults
    });
  } catch (error) {
    res.status(500).json({ message: 'Search failed' });
  }
});

// Submit lead
router.post('/api/leads', async (req, res) => {
  try {
    const validatedData = leadSchema.parse(req.body);
    
    const lead = await storage.createLead(validatedData);
    
    res.status(201).json({ 
      message: 'Lead submitted successfully! Our manager will call you within 5 minutes.',
      leadId: lead.id
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ 
        message: 'Validation failed',
        errors: error.errors
      });
    } else {
      console.error('Lead submission error:', error);
      res.status(500).json({ message: 'Failed to create lead' });
    }
  }
});

// Simple login endpoint for testing
router.post('/api/auth/login', async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    
    let user = await storage.getUserByEmail(email);
    if (!user) {
      user = await storage.createUser({ name, email });
    }
    
    // Simple session storage
    (req as any).user = user;
    
    res.json({ 
      message: 'Logged in successfully', 
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

// Check current user
router.get('/api/auth/user', (req, res) => {
  if ((req as any).user) {
    res.json((req as any).user);
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

// Logout
router.post('/api/auth/logout', (req, res) => {
  (req as any).user = null;
  res.json({ message: 'Logged out successfully' });
});

// Google OAuth fallback
router.get('/auth/google', (req, res) => {
  // For demo purposes, redirect to a simple login form
  res.redirect('/?login=google');
});

// Admin Routes (simplified)

// Get all leads
router.get('/api/admin/leads', async (req, res) => {
  try {
    const { status } = req.query;
    const leads = await storage.getLeads(status?.toString());
    res.json(leads);
  } catch (error: any) {
    console.error('Fetch leads error:', error);
    res.status(500).json({ message: 'Failed to fetch leads' });
  }
});

// Update lead status
router.patch('/api/admin/leads/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const lead = await storage.updateLeadStatus(id, status);
    
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    
    res.json(lead);
  } catch (error: any) {
    console.error('Update lead error:', error);
    res.status(500).json({ message: 'Failed to update lead' });
  }
});

// Get analytics
router.get('/api/admin/analytics', async (req, res) => {
  try {
    const analytics = await storage.getAnalytics();
    res.json(analytics);
  } catch (error: any) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
});

// Admin login (simplified)
router.post('/auth/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Simple admin check (for demo)
    if (email === 'admin@appkickstart.com' && password === 'admin123') {
      (req as any).user = { 
        id: 'admin_1', 
        name: 'Admin User', 
        email: 'admin@appkickstart.com', 
        role: 'admin' 
      };
      res.json({ 
        message: 'Admin logged in successfully', 
        admin: { name: 'Admin User', email: 'admin@appkickstart.com' }
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error: any) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

export function registerRoutes() {
  return router;
}