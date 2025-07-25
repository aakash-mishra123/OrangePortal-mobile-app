import { Router } from 'express';
import { db } from './db.js';
import { leads, users, activities } from '../shared/schema.js';
import { leadSchema, mobileAppServices, serviceCategories } from '../shared/schema.js';
import { eq, desc, count } from 'drizzle-orm';

const router = Router();

// Public Routes

// Get all service categories
router.get('/api/categories', async (req, res) => {
  try {
    res.json(serviceCategories);
  } catch (error) {
    console.error('Categories error:', error);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
});

// Get mobile app services
router.get('/api/services/mobile-app', async (req, res) => {
  try {
    res.json(mobileAppServices);
  } catch (error) {
    console.error('Mobile app services error:', error);
    res.status(500).json({ message: 'Failed to fetch services' });
  }
});

// Get all services (fallback)
router.get('/api/services', async (req, res) => {
  try {
    // Return broader service list (includes UI/UX design services + mobile app services)
    const allServices = [
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
      ...mobileAppServices.map(s => ({
        ...s,
        longDescription: s.description,
        categoryId: "mobile-app-dev",
        hourlyRate: s.hourlyRate,
        monthlyRate: s.hourlyRate * 160,
        technologies: ["React Native", "Flutter", "Swift", "Kotlin"],
        imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500",
        slug: s.id
      }))
    ];
    
    res.json(allServices);
  } catch (error) {
    console.error('Services error:', error);
    res.status(500).json({ message: 'Failed to fetch services' });
  }
});

// Get single service
router.get('/api/service/:id', async (req, res) => {
  try {
    const serviceId = req.params.id;
    
    // Check mobile app services first
    const mobileService = mobileAppServices.find(s => s.id === serviceId);
    if (mobileService) {
      return res.json({
        ...mobileService,
        longDescription: mobileService.description,
        categoryId: "mobile-app-dev",
        monthlyRate: mobileService.hourlyRate * 160,
        technologies: ["React Native", "Flutter", "Swift", "Kotlin"],
        imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500",
        slug: serviceId
      });
    }
    
    // Check UI/UX services
    if (serviceId === 'ui-ux-design') {
      return res.json({
        id: "ui-ux-design",
        title: "UI/UX Design",
        description: "Complete user interface and experience design for web and mobile applications",
        longDescription: "Our UI/UX design service focuses on creating intuitive, user-friendly interfaces that enhance user experience and drive business results.",
        categoryId: "design-creative",
        hourlyRate: 75,
        monthlyRate: 12000,
        features: ["User Research", "Wireframing", "Prototyping", "Design Systems", "Usability Testing"],
        technologies: ["Figma", "Adobe XD", "Sketch", "InVision", "Principle"],
        imageUrl: "https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=500",
        slug: "ui-ux-design"
      });
    }
    
    res.status(404).json({ message: 'Service not found' });
  } catch (error) {
    console.error('Service error:', error);
    res.status(500).json({ message: 'Failed to fetch service' });
  }
});

// Search services
router.get('/api/search', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.json({ categories: [], services: [] });
    }
    
    const searchTerm = query.toString().toLowerCase();
    
    // Search in categories
    const categoryResults = serviceCategories.filter(cat => 
      cat.name.toLowerCase().includes(searchTerm) ||
      cat.description.toLowerCase().includes(searchTerm)
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
    console.error('Search error:', error);
    res.status(500).json({ message: 'Search failed' });
  }
});

// Submit lead
router.post('/api/leads', async (req, res) => {
  try {
    console.log('Received lead data:', req.body);
    
    // Validate the request body
    const validatedData = leadSchema.parse(req.body);
    console.log('Validated data:', validatedData);
    
    // Create the lead in database
    const [lead] = await db.insert(leads).values({
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone,
      projectBrief: validatedData.projectBrief,
      budget: validatedData.budget,
      serviceId: validatedData.serviceId,
      serviceName: validatedData.serviceName,
      status: 'new'
    }).returning();
    
    console.log('Created lead:', lead);
    
    res.status(201).json({ 
      message: 'Lead submitted successfully! Our manager will call you within 5 minutes.',
      leadId: lead.id
    });
  } catch (error: any) {
    console.error('Lead submission error details:', error);
    
    if (error.name === 'ZodError') {
      console.log('Zod validation errors:', error.errors);
      res.status(400).json({ 
        message: 'Validation failed',
        errors: error.errors
      });
    } else {
      res.status(500).json({ message: 'Failed to create lead' });
    }
  }
});

// Authentication routes
router.get('/api/auth/user', (req, res) => {
  if ((req as any).session?.user) {
    res.json((req as any).session.user);
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

router.post('/api/auth/login', async (req, res) => {
  try {
    const { name, email, mobile } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    // Check if user exists
    let [user] = await db.select().from(users).where(eq(users.email, email));
    
    if (!user) {
      // Create new user
      [user] = await db.insert(users).values({
        email,
        mobile,
        firstName: name,
        isGuest: 0
      }).returning();
    } else {
      // Update existing user
      [user] = await db.update(users)
        .set({ 
          mobile,
          firstName: name,
          updatedAt: new Date()
        })
        .where(eq(users.id, user.id))
        .returning();
    }
    
    // Store user in session
    (req as any).session.user = user;
    
    res.json({ 
      message: 'Logged in successfully', 
      user: { 
        id: user.id, 
        name: user.firstName, 
        email: user.email,
        mobile: user.mobile
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

router.post('/api/auth/logout', (req, res) => {
  (req as any).session.user = null;
  res.json({ message: 'Logged out successfully' });
});

// Activity tracking
router.post('/api/activities', async (req, res) => {
  try {
    const { userId, activityType, details } = req.body;
    
    await db.insert(activities).values({
      userId: userId || 'anonymous',
      activityType,
      details
    });
    
    res.json({ success: true });
  } catch (error: any) {
    console.error('Activity tracking error:', error);
    res.status(500).json({ message: 'Failed to track activity' });
  }
});

// Admin Routes

// Get all leads
router.get('/api/admin/leads', async (req, res) => {
  try {
    const { status } = req.query;
    
    let leadsQuery = db.select().from(leads);
    
    if (status && status !== 'all') {
      leadsQuery = leadsQuery.where(eq(leads.status, status as string));
    }
    
    const allLeads = await leadsQuery.orderBy(desc(leads.createdAt));
    res.json(allLeads);
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
    
    const [lead] = await db.update(leads)
      .set({ status, updatedAt: new Date() })
      .where(eq(leads.id, id))
      .returning();
    
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
    const totalLeads = await db.select({ count: count() }).from(leads);
    const newLeads = await db.select({ count: count() }).from(leads).where(eq(leads.status, 'new'));
    const inProgressLeads = await db.select({ count: count() }).from(leads).where(eq(leads.status, 'in-progress'));
    const completedLeads = await db.select({ count: count() }).from(leads).where(eq(leads.status, 'completed'));

    res.json({
      totalLeads: totalLeads[0]?.count || 0,
      newLeads: newLeads[0]?.count || 0,
      inProgressLeads: inProgressLeads[0]?.count || 0,
      completedLeads: completedLeads[0]?.count || 0
    });
  } catch (error: any) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
});

export function registerRoutes() {
  return router;
}