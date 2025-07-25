// PostgreSQL database storage
import { db } from './db.js';
import { leads, users, activities, type InsertLead, type Lead, type User, type InsertUser } from '../shared/schema.js';
import { eq, desc, count } from 'drizzle-orm';

export interface IStorage {
  // Lead operations
  createLead(leadData: InsertLead): Promise<Lead>;
  getLeads(status?: string): Promise<Lead[]>;
  updateLeadStatus(id: string, status: 'new' | 'contacted' | 'in-progress' | 'completed' | 'cancelled'): Promise<Lead | null>;
  
  // User operations
  createUser(userData: InsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | null>;
  upsertUser(userData: InsertUser): Promise<User>;
  
  // Analytics
  getAnalytics(): Promise<any>;
  incrementServiceViews(serviceId: string, serviceName: string): Promise<void>;
}

class DatabaseStorage implements IStorage {

  // Lead operations
  async createLead(leadData: InsertLead): Promise<Lead> {
    const [lead] = await db.insert(leads).values({
      ...leadData,
      status: 'new'
    }).returning();
    return lead;
  }

  async getLeads(status?: string): Promise<Lead[]> {
    if (!status || status === 'all') {
      return await db.select().from(leads).orderBy(desc(leads.createdAt));
    }
    return await db.select().from(leads)
      .where(eq(leads.status, status))
      .orderBy(desc(leads.createdAt));
  }

  async updateLeadStatus(id: string, status: 'new' | 'contacted' | 'in-progress' | 'completed' | 'cancelled'): Promise<Lead | null> {
    const [lead] = await db.update(leads)
      .set({ status, updatedAt: new Date() })
      .where(eq(leads.id, id))
      .returning();
    return lead || null;
  }

  // User operations
  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || null;
  }

  async upsertUser(userData: InsertUser): Promise<User> {
    const existingUser = await this.getUserByEmail(userData.email!);
    if (existingUser) {
      const [user] = await db.update(users)
        .set({ ...userData, updatedAt: new Date() })
        .where(eq(users.email, userData.email!))
        .returning();
      return user;
    } else {
      return await this.createUser(userData);
    }
  }

  async getAnalytics() {
    const totalLeads = await db.select({ count: count() }).from(leads);
    const newLeads = await db.select({ count: count() }).from(leads).where(eq(leads.status, 'new'));
    const inProgressLeads = await db.select({ count: count() }).from(leads).where(eq(leads.status, 'in-progress'));
    const completedLeads = await db.select({ count: count() }).from(leads).where(eq(leads.status, 'completed'));

    return {
      totalLeads: totalLeads[0]?.count || 0,
      newLeads: newLeads[0]?.count || 0,
      inProgressLeads: inProgressLeads[0]?.count || 0,
      completedLeads: completedLeads[0]?.count || 0
    };
  }

  async incrementServiceViews(serviceId: string, serviceName: string): Promise<void> {
    // Track service views in activities table
    await db.insert(activities).values({
      userId: 'system',
      activityType: 'service_view',
      details: { serviceId, serviceName }
    });
  }
}

export const storage = new DatabaseStorage();