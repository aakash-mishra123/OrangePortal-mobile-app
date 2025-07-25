import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import { registerRoutes } from '../../server/routes';
import type { Server } from 'http';

describe('API Routes Tests', () => {
  let app: express.Application;
  let server: Server;

  beforeAll(async () => {
    app = express();
    server = await registerRoutes(app);
  });

  afterAll(() => {
    server.close();
  });

  describe('Authentication Routes', () => {
    it('should return null for unauthenticated user', async () => {
      const response = await request(app)
        .get('/api/auth/user')
        .expect(200);

      expect(response.body).toBeNull();
    });

    it('should register a new user', async () => {
      const userData = {
        email: 'testuser@example.com',
        name: 'Test User',
        mobile: '+1234567890'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe('testuser@example.com');
      expect(response.body.name).toBe('Test User');
      expect(response.body.mobile).toBe('+1234567890');
    });

    it('should prevent duplicate user registration', async () => {
      const userData = {
        email: 'duplicate@example.com',
        name: 'Duplicate User',
        mobile: '+1234567891'
      };

      // First registration should succeed
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(200);

      // Second registration with same email should fail
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.message).toBe('User already exists with this email');
    });

    it('should validate user registration data', async () => {
      const invalidUserData = {
        email: 'invalid-email', // Invalid email format
        name: '', // Empty name
        mobile: '123' // Invalid mobile format
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUserData)
        .expect(400);

      expect(response.body.message).toBe('Invalid user data');
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('Categories Routes', () => {
    it('should fetch all categories', async () => {
      const response = await request(app)
        .get('/api/categories')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      const firstCategory = response.body[0];
      expect(firstCategory).toHaveProperty('id');
      expect(firstCategory).toHaveProperty('name');
      expect(firstCategory).toHaveProperty('description');
      expect(firstCategory).toHaveProperty('icon');
      expect(firstCategory).toHaveProperty('slug');
      expect(firstCategory).toHaveProperty('serviceCount');
    });
  });

  describe('Services Routes', () => {
    it('should fetch all services', async () => {
      const response = await request(app)
        .get('/api/services')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should fetch services by category', async () => {
      const categoryId = 'web-development';
      const response = await request(app)
        .get(`/api/services?category=${categoryId}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      
      // All services should belong to the specified category
      response.body.forEach((service: any) => {
        expect(service.categoryId).toBe(categoryId);
      });
    });

    it('should fetch service by slug', async () => {
      // First get all services to find a valid slug
      const servicesResponse = await request(app)
        .get('/api/services')
        .expect(200);

      if (servicesResponse.body.length > 0) {
        const firstService = servicesResponse.body[0];
        const response = await request(app)
          .get(`/api/service/${firstService.slug}`)
          .expect(200);

        expect(response.body.id).toBe(firstService.id);
        expect(response.body.slug).toBe(firstService.slug);
      }
    });

    it('should return 404 for non-existent service slug', async () => {
      const response = await request(app)
        .get('/api/service/non-existent-slug')
        .expect(404);

      expect(response.body.message).toBe('Service not found');
    });
  });

  describe('Leads Routes', () => {
    it('should create a new lead', async () => {
      const leadData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        serviceId: 'test-service-id',
        serviceName: 'Test Service',
        message: 'I need help with this service'
      };

      const response = await request(app)
        .post('/api/leads')
        .send(leadData)
        .expect(201);

      expect(response.body.message).toBe('Lead created successfully');
      expect(response.body.lead).toHaveProperty('id');
      expect(response.body.lead.name).toBe('John Doe');
      expect(response.body.lead.email).toBe('john.doe@example.com');
    });

    it('should validate lead data', async () => {
      const invalidLeadData = {
        name: '', // Empty name
        email: 'invalid-email', // Invalid email
        phone: '123', // Invalid phone
        serviceId: '',
        serviceName: ''
      };

      const response = await request(app)
        .post('/api/leads')
        .send(invalidLeadData)
        .expect(400);

      expect(response.body.message).toBe('Invalid lead data');
      expect(response.body.errors).toBeDefined();
    });

    it('should fetch all leads', async () => {
      // Create a test lead first
      const leadData = {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '+1234567891',
        serviceId: 'test-service-2',
        serviceName: 'Test Service 2',
        message: 'Need consultation'
      };

      await request(app)
        .post('/api/leads')
        .send(leadData)
        .expect(201);

      const response = await request(app)
        .get('/api/leads')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      const createdLead = response.body.find((lead: any) => 
        lead.email === 'jane.smith@example.com'
      );
      expect(createdLead).toBeDefined();
      expect(createdLead.name).toBe('Jane Smith');
    });
  });

  describe('Activity Tracking Routes', () => {
    it('should create user activity', async () => {
      const activityData = {
        activityType: 'category_browse',
        categoryId: 'web-development',
        metadata: { source: 'home_page' }
      };

      const response = await request(app)
        .post('/api/activities')
        .send(activityData)
        .expect(201);

      expect(response.body.message).toBe('Activity tracked successfully');
      expect(response.body.activity).toHaveProperty('id');
      expect(response.body.activity.activityType).toBe('category_browse');
      expect(response.body.activity.categoryId).toBe('web-development');
    });

    it('should validate activity data', async () => {
      const invalidActivityData = {
        activityType: '', // Empty activity type
        categoryId: null,
        serviceId: null
      };

      const response = await request(app)
        .post('/api/activities')
        .send(invalidActivityData)
        .expect(400);

      expect(response.body.message).toBe('Invalid activity data');
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('Admin Routes', () => {
    it('should fetch user activities', async () => {
      // Create a test activity first
      const activityData = {
        activityType: 'service_view',
        serviceId: 'test-service-admin',
        metadata: { test: true }
      };

      await request(app)
        .post('/api/activities')
        .send(activityData)
        .expect(201);

      const response = await request(app)
        .get('/api/admin/activities')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      const testActivity = response.body.find((activity: any) => 
        activity.serviceId === 'test-service-admin'
      );
      expect(testActivity).toBeDefined();
    });

    it('should fetch analytics data', async () => {
      const response = await request(app)
        .get('/api/admin/analytics')
        .expect(200);

      expect(response.body).toHaveProperty('totalActivities');
      expect(response.body).toHaveProperty('serviceViews');
      expect(response.body).toHaveProperty('categoryBrowses');
      expect(response.body).toHaveProperty('serviceInquiries');
      
      expect(typeof response.body.totalActivities).toBe('number');
      expect(typeof response.body.serviceViews).toBe('number');
      expect(typeof response.body.categoryBrowses).toBe('number');
      expect(typeof response.body.serviceInquiries).toBe('number');
    });
  });
});