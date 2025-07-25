import mongoose from 'mongoose';

// Lead Model
const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  projectBrief: { type: String, required: true },
  budget: { type: String, required: true },
  serviceId: { type: String, required: true },
  serviceName: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['new', 'contacted', 'in-progress', 'completed', 'cancelled'],
    default: 'new'
  }
}, {
  timestamps: true
});

export const Lead = mongoose.model('Lead', leadSchema);

// Admin Model
const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, default: 'admin' }
}, {
  timestamps: true
});

export const Admin = mongoose.model('Admin', adminSchema);

// Google User Model
const googleUserSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  picture: { type: String }
}, {
  timestamps: true
});

export const GoogleUser = mongoose.model('GoogleUser', googleUserSchema);

// Service Analytics Model (for tracking popular services)
const serviceAnalyticsSchema = new mongoose.Schema({
  serviceId: { type: String, required: true },
  serviceName: { type: String, required: true },
  views: { type: Number, default: 0 },
  leads: { type: Number, default: 0 }
}, {
  timestamps: true
});

export const ServiceAnalytics = mongoose.model('ServiceAnalytics', serviceAnalyticsSchema);