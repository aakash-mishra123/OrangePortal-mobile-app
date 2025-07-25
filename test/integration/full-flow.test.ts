import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import { registerRoutes } from '../../server/routes';
import type { Server } from 'http';

describe('Full Application Flow Integration Tests', () => {
  let app: express.Application;
  let server: Server;

  beforeAll(async () => {
    app = express();
    server = await registerRoutes(app);
  });

  afterAll(() => {
    server.close();
  });

  describe('User Registration and Activity Tracking Flow', () => {
    let userSession: any;

    it('should complete full user journey', async () => {
      // 1. User visits home page and browses categories (guest user)
      const categoryActivity = await request(app)
        .post('/api/activities')
        .send({
          activityType: 'category_browse',
          categoryId: 'web-development',
          metadata: { source: 'home_page' }
        })
        .expect(201);

      expect(categoryActivity.body.message).toBe('Activity tracked successfully');
      expect(categoryActivity.body.activity.activityType).toBe('category_browse');

      // 2. User views a specific service
      const serviceActivity = await request(app)
        .post('/api/activities')
        .send({
          activityType: 'service_view',
          serviceId: 'custom-web-development',
          metadata: { referrer: 'category_page' }
        })
        .expect(201);

      expect(serviceActivity.body.activity.activityType).toBe('service_view');

      // 3. User decides to register
      const userRegistration = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'testuser@integration.com',
          name: 'Integration Test User',
          mobile: '+1555123456'
        })
        .expect(200);

      expect(userRegistration.body.email).toBe('testuser@integration.com');
      expect(userRegistration.body.name).toBe('Integration Test User');

      // Store session for subsequent requests
      userSession = userRegistration.headers['set-cookie'];

      // 4. Registered user submits a lead
      const leadSubmission = await request(app)
        .post('/api/leads')
        .set('Cookie', userSession)
        .send({
          name: 'Integration Test User',
          email: 'testuser@integration.com',
          phone: '+1555123456',
          serviceId: 'custom-web-development',
          serviceName: 'Custom Web Development',
          message: 'I need a custom web application for my business'
        })
        .expect(201);

      expect(leadSubmission.body.message).toBe('Lead created successfully');
      expect(leadSubmission.body.lead.name).toBe('Integration Test User');

      // 5. Verify user can fetch their profile
      const userProfile = await request(app)
        .get('/api/auth/user')
        .set('Cookie', userSession)
        .expect(200);

      expect(userProfile.body.email).toBe('testuser@integration.com');
      expect(userProfile.body.name).toBe('Integration Test User');

      // 6. Admin can see all activities
      const allActivities = await request(app)
        .get('/api/admin/activities')
        .expect(200);

      expect(allActivities.body.length).toBeGreaterThanOrEqual(3); // At least our 3 activities
      
      // Find our specific activities
      const categoryBrowse = allActivities.body.find((activity: any) =>
        activity.activityType === 'category_browse' && activity.categoryId === 'web-development'
      );
      const serviceView = allActivities.body.find((activity: any) =>
        activity.activityType === 'service_view' && activity.serviceId === 'custom-web-development'
      );
      const serviceInquiry = allActivities.body.find((activity: any) =>
        activity.activityType === 'service_inquiry'
      );

      expect(categoryBrowse).toBeDefined();
      expect(serviceView).toBeDefined();
      expect(serviceInquiry).toBeDefined();

      // 7. Admin can see analytics
      const analytics = await request(app)
        .get('/api/admin/analytics')
        .expect(200);

      expect(analytics.body.totalActivities).toBeGreaterThan(0);
      expect(analytics.body.serviceViews).toBeGreaterThan(0);
      expect(analytics.body.categoryBrowses).toBeGreaterThan(0);
      expect(analytics.body.serviceInquiries).toBeGreaterThan(0);

      // 8. Admin can see all leads
      const allLeads = await request(app)
        .get('/api/leads')
        .expect(200);

      expect(allLeads.body.length).toBeGreaterThan(0);
      
      const userLead = allLeads.body.find((lead: any) =>
        lead.email === 'testuser@integration.com'
      );
      expect(userLead).toBeDefined();
      expect(userLead.name).toBe('Integration Test User');
      expect(userLead.serviceName).toBe('Custom Web Development');
    });
  });

  describe('Service Discovery Flow', () => {
    it('should handle complete service discovery journey', async () => {
      // 1. Fetch all categories
      const categoriesResponse = await request(app)
        .get('/api/categories')
        .expect(200);

      expect(categoriesResponse.body.length).toBeGreaterThan(0);
      const webDevCategory = categoriesResponse.body.find((cat: any) => 
        cat.id === 'web-development'
      );
      expect(webDevCategory).toBeDefined();

      // 2. Browse services in a category
      const servicesResponse = await request(app)
        .get('/api/services?category=web-development')
        .expect(200);

      expect(Array.isArray(servicesResponse.body)).toBe(true);
      
      // 3. View a specific service (if any exist)
      const allServicesResponse = await request(app)
        .get('/api/services')
        .expect(200);

      if (allServicesResponse.body.length > 0) {
        const firstService = allServicesResponse.body[0];
        
        const serviceDetailResponse = await request(app)
          .get(`/api/service/${firstService.slug}`)
          .expect(200);

        expect(serviceDetailResponse.body.id).toBe(firstService.id);
        expect(serviceDetailResponse.body.slug).toBe(firstService.slug);

        // Track service view
        await request(app)
          .post('/api/activities')
          .send({
            activityType: 'service_view',
            serviceId: firstService.id,
            metadata: { page: 'service_detail' }
          })
          .expect(201);
      }
    });
  });

  describe('Error Handling Flow', () => {
    it('should handle invalid requests gracefully', async () => {
      // Invalid user registration
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          name: '',
          mobile: '123'
        })
        .expect(400);

      // Invalid lead creation
      await request(app)
        .post('/api/leads')
        .send({
          name: '',
          email: 'invalid-email',
          phone: '123'
        })
        .expect(400);

      // Invalid activity tracking
      await request(app)
        .post('/api/activities')
        .send({
          activityType: '',
          metadata: 'invalid-metadata'
        })
        .expect(400);

      // Non-existent service
      await request(app)
        .get('/api/service/non-existent-service')
        .expect(404);
    });
  });

  describe('Session Management', () => {
    it('should maintain user session across requests', async () => {
      // Register user
      const registration = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'session.test@example.com',
          name: 'Session Test User',
          mobile: '+1555999888'
        })
        .expect(200);

      const cookies = registration.headers['set-cookie'];

      // Verify session persists
      const userCheck1 = await request(app)
        .get('/api/auth/user')
        .set('Cookie', cookies)
        .expect(200);

      expect(userCheck1.body.email).toBe('session.test@example.com');

      // Create activity with session
      await request(app)
        .post('/api/activities')
        .set('Cookie', cookies)
        .send({
          activityType: 'profile_view',
          metadata: { authenticated: true }
        })
        .expect(201);

      // Verify session still works
      const userCheck2 = await request(app)
        .get('/api/auth/user')
        .set('Cookie', cookies)
        .expect(200);

      expect(userCheck2.body.email).toBe('session.test@example.com');
    });
  });
});