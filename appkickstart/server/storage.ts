// In-memory storage for development and testing
interface ILead {
  id: string;
  name: string;
  phone: string;
  email: string;
  projectBrief: string;
  budget: string;
  serviceId: string;
  serviceName: string;
  status: 'new' | 'contacted' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: Date;
}

interface IUser {
  id: string;
  name: string;
  email: string;
  role?: string;
}

class MemoryStorage {
  private leads: Map<string, ILead> = new Map();
  private users: Map<string, IUser> = new Map();
  private analytics: Map<string, { views: number; leads: number; serviceName: string }> = new Map();

  // Lead operations
  async createLead(leadData: Omit<ILead, 'id' | 'createdAt' | 'status'>): Promise<ILead> {
    const id = `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const lead: ILead = {
      ...leadData,
      id,
      status: 'new',
      createdAt: new Date()
    };
    
    this.leads.set(id, lead);
    
    // Update analytics
    const serviceAnalytics = this.analytics.get(leadData.serviceId) || {
      views: 0,
      leads: 0,
      serviceName: leadData.serviceName
    };
    serviceAnalytics.leads += 1;
    this.analytics.set(leadData.serviceId, serviceAnalytics);
    
    return lead;
  }

  async getLeads(status?: string): Promise<ILead[]> {
    const allLeads = Array.from(this.leads.values());
    if (!status || status === 'all') {
      return allLeads.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    return allLeads
      .filter(lead => lead.status === status)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async updateLeadStatus(id: string, status: ILead['status']): Promise<ILead | null> {
    const lead = this.leads.get(id);
    if (!lead) return null;
    
    lead.status = status;
    this.leads.set(id, lead);
    return lead;
  }

  async getAnalytics() {
    const allLeads = Array.from(this.leads.values());
    const totalLeads = allLeads.length;
    const newLeads = allLeads.filter(l => l.status === 'new').length;
    const inProgressLeads = allLeads.filter(l => l.status === 'in-progress').length;
    const completedLeads = allLeads.filter(l => l.status === 'completed').length;

    return {
      totalLeads,
      newLeads,
      inProgressLeads,
      completedLeads,
      serviceAnalytics: Array.from(this.analytics.entries()).map(([serviceId, data]) => ({
        serviceId,
        ...data
      }))
    };
  }

  // User operations
  async createUser(userData: Omit<IUser, 'id'>): Promise<IUser> {
    const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const user: IUser = { ...userData, id };
    this.users.set(id, user);
    return user;
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async incrementServiceViews(serviceId: string, serviceName: string) {
    const analytics = this.analytics.get(serviceId) || {
      views: 0,
      leads: 0,
      serviceName
    };
    analytics.views += 1;
    this.analytics.set(serviceId, analytics);
  }
}

export const storage = new MemoryStorage();
export type { ILead, IUser };