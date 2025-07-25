import { Router, type Express } from 'express';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import { Lead, Admin, GoogleUser, ServiceAnalytics } from './models.js';
import { leadSchema, adminSchema, mobileAppServices, serviceCategories } from '../shared/schema.js';

const router = Router();

// Middleware to check if user is authenticated admin
const requireAdmin = (req: any, res: any, next: any) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Admin access required' });
  }
};

// Middleware to check if user is authenticated (Google OAuth)
const requireAuth = (req: any, res: any, next: any) => {
  if (req.user) {
    next();
  } else {
    res.status(401).json({ message: 'Authentication required' });
  }
};

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
      await ServiceAnalytics.findOneAndUpdate(
        { serviceId: service.id },
        { 
          $inc: { views: 1 },
          serviceName: service.title
        },
        { upsert: true }
      );
    }
    
    res.json(mobileAppServices);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch services' });
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
    
    const lead = new Lead(validatedData);
    await lead.save();
    
    // Update service analytics
    await ServiceAnalytics.findOneAndUpdate(
      { serviceId: validatedData.serviceId },
      { 
        $inc: { leads: 1 },
        serviceName: validatedData.serviceName
      },
      { upsert: true }
    );
    
    res.status(201).json({ 
      message: 'Lead submitted successfully! Our manager will call you within 5 minutes.',
      leadId: lead._id
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      res.status(400).json({ 
        message: 'Validation failed',
        errors: error.errors
      });
    } else {
      res.status(500).json({ message: 'Failed to submit lead' });
    }
  }
});

// Authentication Routes

// Google OAuth
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res) => {
    try {
      const user = req.user as any;
      
      // Save or update Google user in database
      await GoogleUser.findOneAndUpdate(
        { googleId: user.googleId },
        user,
        { upsert: true, new: true }
      );
      
      res.redirect('/');
    } catch (error) {
      res.redirect('/login?error=auth_failed');
    }
  }
);

// Admin login
router.post('/auth/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    req.login({ ...admin.toObject(), role: 'admin' }, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Login failed' });
      }
      res.json({ message: 'Admin logged in successfully', admin: { name: admin.name, email: admin.email } });
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
});

// Create admin (only for initial setup)
router.post('/auth/admin/register', async (req, res) => {
  try {
    const validatedData = adminSchema.parse(req.body);
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: validatedData.email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);
    
    const admin = new Admin({
      ...validatedData,
      password: hashedPassword
    });
    
    await admin.save();
    
    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    if (error.name === 'ZodError') {
      res.status(400).json({ 
        message: 'Validation failed',
        errors: error.errors
      });
    } else {
      res.status(500).json({ message: 'Failed to create admin' });
    }
  }
});

// Check current user
router.get('/auth/user', (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

// Logout
router.post('/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

// Admin Routes

// Get all leads
router.get('/api/admin/leads', requireAdmin, async (req, res) => {
  try {
    const { status, sortBy = 'createdAt', order = 'desc' } = req.query;
    
    let query = {};
    if (status && status !== 'all') {
      query = { status };
    }
    
    const leads = await Lead.find(query)
      .sort({ [sortBy.toString()]: order === 'desc' ? -1 : 1 });
    
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch leads' });
  }
});

// Update lead status
router.patch('/api/admin/leads/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const lead = await Lead.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    
    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update lead' });
  }
});

// Get analytics
router.get('/api/admin/analytics', requireAdmin, async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const newLeads = await Lead.countDocuments({ status: 'new' });
    const inProgressLeads = await Lead.countDocuments({ status: 'in-progress' });
    const completedLeads = await Lead.countDocuments({ status: 'completed' });
    
    const serviceAnalytics = await ServiceAnalytics.find().sort({ leads: -1 });
    
    // Leads per day for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const dailyLeads = await Lead.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    res.json({
      totalLeads,
      newLeads,
      inProgressLeads,
      completedLeads,
      serviceAnalytics,
      dailyLeads
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
});

export function registerRoutes(app: Express) {
  app.use('/', router);
}