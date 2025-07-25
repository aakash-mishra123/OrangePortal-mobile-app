import { describe, it, expect, beforeEach } from 'vitest';
import { storage } from '../../server/storage';
import type { InsertUser, InsertLead, InsertUserActivity } from '../../shared/schema';

describe('Storage Layer Tests', () => {
  beforeEach(async () => {
    // Initialize data before each test
    await storage.initializeData();
  });

  describe('User Management', () => {
    it('should create a new user', async () => {
      const userData: InsertUser = {
        email: 'test@example.com',
        name: 'Test User',
        mobile: '+1234567890'
      };

      const user = await storage.createUser(userData);
      
      expect(user).toBeDefined();
      expect(user.email).toBe('test@example.com');
      expect(user.name).toBe('Test User');
      expect(user.mobile).toBe('+1234567890');
      expect(user.id).toBeDefined();
      expect(user.createdAt).toBeInstanceOf(Date);
    });

    it('should retrieve user by ID', async () => {
      const userData: InsertUser = {
        email: 'test2@example.com',
        name: 'Test User 2',
        mobile: '+1234567891'
      };

      const createdUser = await storage.createUser(userData);
      const retrievedUser = await storage.getUser(createdUser.id);
      
      expect(retrievedUser).toBeDefined();
      expect(retrievedUser?.id).toBe(createdUser.id);
      expect(retrievedUser?.email).toBe('test2@example.com');
    });

    it('should retrieve user by email', async () => {
      const userData: InsertUser = {
        email: 'test3@example.com',
        name: 'Test User 3',
        mobile: '+1234567892'
      };

      await storage.createUser(userData);
      const retrievedUser = await storage.getUserByEmail('test3@example.com');
      
      expect(retrievedUser).toBeDefined();
      expect(retrievedUser?.email).toBe('test3@example.com');
      expect(retrievedUser?.name).toBe('Test User 3');
    });

    it('should return undefined for non-existent user', async () => {
      const user = await storage.getUser('non-existent-id');
      expect(user).toBeUndefined();
    });
  });

  describe('Categories and Services', () => {
    it('should retrieve all categories', async () => {
      const categories = await storage.getCategories();
      
      expect(categories).toBeDefined();
      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBeGreaterThan(0);
      
      // Check first category structure
      const firstCategory = categories[0];
      expect(firstCategory).toHaveProperty('id');
      expect(firstCategory).toHaveProperty('name');
      expect(firstCategory).toHaveProperty('description');
      expect(firstCategory).toHaveProperty('icon');
      expect(firstCategory).toHaveProperty('slug');
      expect(firstCategory).toHaveProperty('serviceCount');
    });

    it('should retrieve all services', async () => {
      const services = await storage.getServices();
      
      expect(services).toBeDefined();
      expect(Array.isArray(services)).toBe(true);
      expect(services.length).toBeGreaterThan(0);
      
      // Check first service structure
      const firstService = services[0];
      expect(firstService).toHaveProperty('id');
      expect(firstService).toHaveProperty('name');
      expect(firstService).toHaveProperty('description');
      expect(firstService).toHaveProperty('categoryId');
      expect(firstService).toHaveProperty('price');
      expect(firstService).toHaveProperty('features');
    });

    it('should retrieve services by category', async () => {
      const categoryId = 'web-development';
      const services = await storage.getServicesByCategory(categoryId);
      
      expect(services).toBeDefined();
      expect(Array.isArray(services)).toBe(true);
      
      // All services should belong to the specified category
      services.forEach(service => {
        expect(service.categoryId).toBe(categoryId);
      });
    });

    it('should retrieve service by slug', async () => {
      const services = await storage.getServices();
      if (services.length > 0) {
        const firstService = services[0];
        const retrievedService = await storage.getServiceBySlug(firstService.slug);
        
        expect(retrievedService).toBeDefined();
        expect(retrievedService?.id).toBe(firstService.id);
        expect(retrievedService?.slug).toBe(firstService.slug);
      }
    });
  });

  describe('Lead Management', () => {
    it('should create a new lead', async () => {
      const leadData: InsertLead = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        serviceId: 'test-service-id',
        serviceName: 'Test Service',
        message: 'I need help with this service'
      };

      const lead = await storage.createLead(leadData);
      
      expect(lead).toBeDefined();
      expect(lead.name).toBe('John Doe');
      expect(lead.email).toBe('john@example.com');
      expect(lead.phone).toBe('+1234567890');
      expect(lead.serviceId).toBe('test-service-id');
      expect(lead.serviceName).toBe('Test Service');
      expect(lead.message).toBe('I need help with this service');
      expect(lead.id).toBeDefined();
      expect(lead.createdAt).toBeInstanceOf(Date);
    });

    it('should retrieve all leads', async () => {
      // Create a test lead first
      const leadData: InsertLead = {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1234567891',
        serviceId: 'test-service-id-2',
        serviceName: 'Test Service 2',
        message: 'Need consultation'
      };

      await storage.createLead(leadData);
      const leads = await storage.getLeads();
      
      expect(leads).toBeDefined();
      expect(Array.isArray(leads)).toBe(true);
      expect(leads.length).toBeGreaterThan(0);
      
      // Find our created lead
      const createdLead = leads.find(lead => lead.email === 'jane@example.com');
      expect(createdLead).toBeDefined();
      expect(createdLead?.name).toBe('Jane Smith');
    });
  });

  describe('User Activity Tracking', () => {
    it('should create user activity', async () => {
      const activityData: InsertUserActivity = {
        userId: null,
        sessionId: 'test-session-123',
        activityType: 'category_browse',
        categoryId: 'web-development',
        metadata: { source: 'home_page' },
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0 Test Browser'
      };

      const activity = await storage.createUserActivity(activityData);
      
      expect(activity).toBeDefined();
      expect(activity.sessionId).toBe('test-session-123');
      expect(activity.activityType).toBe('category_browse');
      expect(activity.categoryId).toBe('web-development');
      expect(activity.metadata).toEqual({ source: 'home_page' });
      expect(activity.ipAddress).toBe('192.168.1.1');
      expect(activity.id).toBeDefined();
      expect(activity.createdAt).toBeInstanceOf(Date);
    });

    it('should retrieve user activities', async () => {
      // Create test activities
      const activityData1: InsertUserActivity = {
        userId: null,
        sessionId: 'test-session-456',
        activityType: 'service_view',
        serviceId: 'test-service-1',
        ipAddress: '192.168.1.2'
      };

      const activityData2: InsertUserActivity = {
        userId: null,
        sessionId: 'test-session-456',
        activityType: 'service_inquiry',
        serviceId: 'test-service-2',
        ipAddress: '192.168.1.2'
      };

      await storage.createUserActivity(activityData1);
      await storage.createUserActivity(activityData2);
      
      const activities = await storage.getUserActivities();
      
      expect(activities).toBeDefined();
      expect(Array.isArray(activities)).toBe(true);
      expect(activities.length).toBeGreaterThan(0);
      
      // Find our created activities
      const sessionActivities = activities.filter(activity => 
        activity.sessionId === 'test-session-456'
      );
      expect(sessionActivities.length).toBe(2);
    });

    it('should get activity analytics', async () => {
      // Create various activities
      await storage.createUserActivity({
        userId: null,
        sessionId: 'analytics-test-1',
        activityType: 'service_view',
        serviceId: 'service-1',
        ipAddress: '192.168.1.3'
      });

      await storage.createUserActivity({
        userId: null,
        sessionId: 'analytics-test-2',
        activityType: 'category_browse',
        categoryId: 'web-development',
        ipAddress: '192.168.1.4'
      });

      await storage.createUserActivity({
        userId: null,
        sessionId: 'analytics-test-3',
        activityType: 'service_inquiry',
        serviceId: 'service-2',
        ipAddress: '192.168.1.5'
      });

      const analytics = await storage.getActivityAnalytics();
      
      expect(analytics).toBeDefined();
      expect(analytics).toHaveProperty('totalActivities');
      expect(analytics).toHaveProperty('serviceViews');
      expect(analytics).toHaveProperty('categoryBrowses');
      expect(analytics).toHaveProperty('serviceInquiries');
      
      expect(typeof analytics.totalActivities).toBe('number');
      expect(typeof analytics.serviceViews).toBe('number');
      expect(typeof analytics.categoryBrowses).toBe('number');
      expect(typeof analytics.serviceInquiries).toBe('number');
      
      expect(analytics.totalActivities).toBeGreaterThan(0);
    });
  });
});