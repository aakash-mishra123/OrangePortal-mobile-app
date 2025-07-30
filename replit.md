# AppKickstart - Mobile App Development Platform

## Overview

AppKickstart is a full-stack web application that helps users discover and request mobile app development services with the tagline "Kickstart Your App or Website in Just 1 Hour!" The platform focuses on speed, simplicity, and expert-led project kickoff for mobile app development services.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with custom OrangeMantra branding colors
- **State Management**: TanStack Query for server state management
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API endpoints
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Google OAuth for customers, Email/Password for admins
- **Session Management**: Express sessions with secure configuration

### Database Design
- **Database**: MongoDB
- **Models**: Leads, Admins, Google Users, Service Analytics
- **Authentication**: Passport.js with Google OAuth strategy
- **Admin Features**: Lead management, analytics dashboard, data export

## Key Components

### Core Entities
- **Service Categories**: 9 main categories including Mobile App Development (featured)
- **Mobile App Services**: 6 sub-services (Android Native, iOS Native, Flutter, React Native, Backend API, App UI Design)
- **Leads**: Project requests with automatic lead generation for authenticated users
- **Users**: Google OAuth authentication and local email/phone signup

### Frontend Pages
- **Auth Page** (Root /): Primary signup/login page with email and mobile number
- **Home** (/home): Category grid with moving banner and search functionality
- **Category Page**: Mobile app development services with simplified "Kickstart" buttons
- **Admin Login**: Separate admin authentication portal
- **Admin Dashboard**: Lead management, analytics, and user administration

### Backend Routes
- `GET /api/categories` - Fetch all service categories
- `GET /api/services/mobile-app` - Fetch mobile app development services
- `GET /api/search` - Real-time search functionality
- `POST /api/leads` - Create new lead (simplified for authenticated users)
- `GET /auth/google` - Google OAuth authentication
- `POST /auth/admin/login` - Admin login
- `GET /api/admin/leads` - Admin lead management
- `GET /api/admin/analytics` - Analytics dashboard

## Data Flow

1. **User Authentication**: User visits root → Auth page with signup/login → Google OAuth or email signup
2. **Service Discovery**: Authenticated user visits /home → Browses categories → Clicks mobile app development
3. **Quick Kickstart**: User clicks "Kickstart Project" → If logged in: automatic lead creation → "Expert will call in 5 minutes"
4. **Lead Management**: All leads stored in MongoDB with admin dashboard for management

## External Dependencies

### Frontend Dependencies
- **UI/UX**: Radix UI components, Lucide React icons, Tailwind CSS
- **Data Fetching**: TanStack Query for caching and synchronization
- **Form Handling**: React Hook Form, Hookform Resolvers
- **Validation**: Zod for schema validation
- **Routing**: Wouter for lightweight routing

### Backend Dependencies
- **Framework**: Express.js for server framework
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Passport.js with Google OAuth strategy
- **Session**: Express sessions with secure configuration
- **Validation**: Zod for schema validation
- **Development**: tsx for TypeScript execution, esbuild for production builds

### Shared Dependencies
- **Validation**: Drizzle-Zod for schema-to-validation bridging
- **Utilities**: Class Variance Authority, clsx, date-fns

## Deployment Strategy

### Development
- **Frontend**: Vite dev server with HMR
- **Backend**: tsx with file watching for auto-restart
- **Integration**: Vite middleware serves frontend through Express in development

### Production Build
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Serving**: Express serves both API and static files from single process

### Environment Configuration
- **Database**: PostgreSQL connection via DATABASE_URL environment variable
- **Development**: NODE_ENV determines build mode and middleware setup
- **Replit Integration**: Special handling for Replit development environment

### Database Configuration
- **Current**: MongoDB with comprehensive models for leads, users, and analytics
- **Authentication**: Google OAuth for customers, email/password for admins
- **Lead Management**: Automatic lead creation for authenticated users
- **Analytics**: Service tracking and lead analytics for admin dashboard

## Recent Changes (January 30, 2025)
- **Interactive 3-Step Stepper Form**: Implemented beautiful animated multi-step form with glassmorphism design
- **Enhanced UI/UX**: Added comprehensive animation system with bounce, glow, gradient effects throughout
- **Authentication Pages**: Created dedicated auth page with stunning animations and enhanced user experience
- **Visual Enhancements**: Upgraded all pages with interactive cards, hover effects, and vibrant color schemes
- **Performance Optimization**: Optimized animations for smooth 60fps performance across all devices
- **Comprehensive Testing**: Created extensive test suite covering all functionality and user flows
- **Bug Fixes**: Fixed experience level selector error and improved form validation
- **Mobile Enhancement**: Improved mobile experience with touch-friendly animations and responsive design

## Legacy Mobile Application
- **Status**: Maintained separately in `mobile/` directory
- **Platform**: React Native with Expo framework (OrangeMantra mobile app)
- **Integration**: Can be adapted for AppKickstart if needed