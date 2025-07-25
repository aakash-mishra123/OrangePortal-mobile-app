import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import express, { type Express } from 'express';
import session from 'express-session';
import { registerRoutes } from '../server/routes';
import { storage } from '../server/storage';

// Mock the storage module
vi.mock('../server/storage', () => ({
  storage: {
    initializeData: vi.fn(),
    getUserByEmail: vi.fn(),
    createUser: vi.fn(),
    getUser: vi.fn(),
    createUserActivity: vi.fn(),
  }
}));

describe('Authentication API', () => {
  let app: Express;
  let server: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    
    app = express();
    app.use(express.json());
    
    // Mock session middleware for testing
    app.use(session({
      secret: 'test-secret',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false }
    }));

    // Register routes without database initialization
    const mockStorage = storage as any;
    mockStorage.initializeData.mockResolvedValue(undefined);
    
    server = await registerRoutes(app);
  });

  describe('POST /api/auth/register', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        mobile: '1234567890',
        firstName: 'John',
        lastName: 'Doe'
      };

      const mockUser = {
        id: 'user-123',
        ...userData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const mockStorage = storage as any;
      mockStorage.getUserByEmail.mockResolvedValue(null);
      mockStorage.createUser.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(200);

      expect(response.body).toEqual(mockUser);
      expect(mockStorage.getUserByEmail).toHaveBeenCalledWith(userData.email);
      expect(mockStorage.createUser).toHaveBeenCalledWith(userData);
    });

    it('should return error when user already exists', async () => {
      const userData = {
        email: 'existing@example.com',
        mobile: '1234567890',
        firstName: 'John',
        lastName: 'Doe'
      };

      const existingUser = {
        id: 'existing-user',
        ...userData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const mockStorage = storage as any;
      mockStorage.getUserByEmail.mockResolvedValue(existingUser);

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toEqual({
        message: 'User already exists with this email'
      });
      expect(mockStorage.createUser).not.toHaveBeenCalled();
    });

    it('should validate required fields', async () => {
      const invalidData = {
        email: 'invalid-email',
        mobile: '123', // too short
        firstName: '', // too short
        lastName: 'Doe'
      };

      const mockStorage = storage as any;
      mockStorage.getUserByEmail.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidData)
        .expect(400);

      expect(response.body.message).toBe('Invalid user data');
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login existing user successfully', async () => {
      const loginData = {
        email: 'existing@example.com'
      };

      const existingUser = {
        id: 'user-123',
        email: 'existing@example.com',
        mobile: '1234567890',
        firstName: 'John',
        lastName: 'Doe',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const mockStorage = storage as any;
      mockStorage.getUserByEmail.mockResolvedValue(existingUser);

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toEqual(existingUser);
      expect(mockStorage.getUserByEmail).toHaveBeenCalledWith(loginData.email);
    });

    it('should return 404 when user not found', async () => {
      const loginData = {
        email: 'nonexistent@example.com'
      };

      const mockStorage = storage as any;
      mockStorage.getUserByEmail.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(404);

      expect(response.body).toEqual({
        message: 'No user found with this email address'
      });
      expect(mockStorage.getUserByEmail).toHaveBeenCalledWith(loginData.email);
    });

    it('should validate email format', async () => {
      const invalidData = {
        email: 'invalid-email-format'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(invalidData)
        .expect(400);

      expect(response.body.message).toBe('Invalid login data');
      expect(response.body.errors).toBeDefined();
    });

    it('should require email field', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({})
        .expect(400);

      expect(response.body.message).toBe('Invalid login data');
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('GET /api/auth/user', () => {
    it('should return user when logged in', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        mobile: '1234567890',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const mockStorage = storage as any;
      mockStorage.getUser.mockResolvedValue(mockUser);

      // Create a session with userId
      const agent = request.agent(app);
      
      // First register to create session
      mockStorage.getUserByEmail.mockResolvedValue(null);
      mockStorage.createUser.mockResolvedValue(mockUser);
      
      await agent
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          mobile: '1234567890', 
          firstName: 'John',
          lastName: 'Doe'
        });

      // Then check user endpoint
      const response = await agent
        .get('/api/auth/user')
        .expect(200);

      expect(response.body).toEqual(mockUser);
    });

    it('should return null when not logged in', async () => {
      const response = await request(app)
        .get('/api/auth/user')
        .expect(200);

      expect(response.body).toBeNull();
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout user successfully', async () => {
      const agent = request.agent(app);
      
      // First create a session by registering
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        mobile: '1234567890',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const mockStorage = storage as any;
      mockStorage.getUserByEmail.mockResolvedValue(null);
      mockStorage.createUser.mockResolvedValue(mockUser);
      
      await agent
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          mobile: '1234567890',
          firstName: 'John', 
          lastName: 'Doe'
        });

      // Then logout
      const response = await agent
        .post('/api/auth/logout')
        .expect(200);

      expect(response.body).toEqual({
        message: 'Logged out successfully'
      });
    });
  });

  describe('Authentication Flow', () => {
    it('should handle complete signup -> login -> logout flow', async () => {
      const userData = {
        email: 'flow@example.com',
        mobile: '1234567890',
        firstName: 'Flow',
        lastName: 'User'
      };

      const mockUser = {
        id: 'flow-user',
        ...userData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const mockStorage = storage as any;

      // Step 1: Signup
      mockStorage.getUserByEmail.mockResolvedValue(null);
      mockStorage.createUser.mockResolvedValue(mockUser);

      const signupResponse = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(200);

      expect(signupResponse.body).toEqual(mockUser);

      // Step 2: Login (simulate user exists now)
      mockStorage.getUserByEmail.mockResolvedValue(mockUser);

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({ email: userData.email })
        .expect(200);

      expect(loginResponse.body).toEqual(mockUser);

      // Step 3: Attempt login with non-existent user
      mockStorage.getUserByEmail.mockResolvedValue(null);

      const failedLoginResponse = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nonexistent@example.com' })
        .expect(404);

      expect(failedLoginResponse.body.message).toBe('No user found with this email address');
    });
  });
});