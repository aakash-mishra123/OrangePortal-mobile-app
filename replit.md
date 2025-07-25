# OrangeMantra Service Portal

## Overview

This is a full-stack responsive service portal for OrangeMantra, a digital transformation company. The application is built similar to UrbanClap but focuses on IT and enterprise services. It allows users to browse service categories, view individual services, and submit lead generation forms for business inquiries.

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
- **Data Storage**: In-memory storage with interface for future database integration
- **Schema Validation**: Zod for request/response validation
- **Development**: Hot module replacement via Vite middleware

### Database Design
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Schema**: Three main entities - Categories, Services, and Leads
- **Migration**: Drizzle Kit for schema migrations
- **Current State**: In-memory storage implementation with database-ready schema

## Key Components

### Core Entities
- **Categories**: Service categories with icons, descriptions, and service counts
- **Services**: Individual services with pricing, features, and detailed descriptions
- **Leads**: Contact form submissions for CRM integration

### Frontend Pages
- **Home**: Hero section with category grid display, testimonials, and stats
- **Category**: Service listings filtered by category
- **Service Detail**: Comprehensive service information with contact form
- **Search**: Advanced search with filters for category, price, and sorting
- **Compare**: Side-by-side service comparison (up to 3 services)
- **Admin Dashboard**: Lead management, analytics, and data export
- **Consultation**: Multi-step booking form for free consultations
- **Layout**: Consistent header and footer across all pages

### Backend Routes
- `GET /api/categories` - Fetch all service categories
- `GET /api/services` - Fetch all services or filter by category
- `GET /api/service/:slug` - Fetch individual service details
- `POST /api/leads` - Create new lead from contact form
- `GET /api/leads` - Fetch all leads (admin access)

## Data Flow

1. **Category Browsing**: User visits homepage → Frontend fetches categories → Displays category grid
2. **Service Discovery**: User clicks category → Frontend fetches category services → Displays service cards
3. **Service Inquiry**: User views service detail → Fills contact form → Backend creates lead → Success notification
4. **Lead Management**: All leads stored in memory (ready for database/CRM integration)

## External Dependencies

### Frontend Dependencies
- **UI/UX**: Radix UI components, Lucide React icons, Tailwind CSS
- **Data Fetching**: TanStack Query for caching and synchronization
- **Form Handling**: React Hook Form, Hookform Resolvers
- **Validation**: Zod for schema validation
- **Routing**: Wouter for lightweight routing

### Backend Dependencies
- **Framework**: Express.js for server framework
- **Database**: Neon Database serverless PostgreSQL (configured but not active)
- **ORM**: Drizzle ORM with PostgreSQL adapter
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

### Database Migration
- **Current**: In-memory storage for immediate functionality
- **Future**: Drizzle migrations ready for PostgreSQL deployment
- **Command**: `npm run db:push` for schema deployment when database is provisioned