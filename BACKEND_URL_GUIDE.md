# Frontend-Backend URL Configuration Guide

## How Frontend Takes Backend Base URL

The frontend automatically determines the correct backend URL based on the environment:

### 1. **Production (Vercel Deployment)**
```javascript
// In production, frontend and backend are on the same domain
// Uses relative URLs: /api/categories, /api/services, etc.
```

### 2. **Development with Vercel Dev**
```bash
# Vercel dev server runs both frontend and backend on same port
vercel dev --listen 3003
# Frontend: http://localhost:3003
# Backend API: http://localhost:3003/api/*
```

### 3. **Development with Separate Backend**
```bash
# Option A: Set environment variable
export VITE_BACKEND_URL=http://localhost:3002
npm run dev

# Option B: Set in .env.local file
echo "VITE_BACKEND_URL=http://localhost:3002" >> .env.local
npm run dev
```

## Configuration Files

### `client/src/lib/config.ts`
This file contains the logic for determining the backend URL:

```typescript
function getApiBaseUrl(): string {
  // 1. Production: Use relative URLs (same domain)
  if (import.meta.env.PROD) {
    return '';
  }
  
  // 2. Custom backend URL from environment
  const customBackendUrl = import.meta.env.VITE_BACKEND_URL;
  if (customBackendUrl) {
    return customBackendUrl;
  }
  
  // 3. Development: Check for custom port
  if (import.meta.env.DEV) {
    const backendPort = import.meta.env.VITE_BACKEND_PORT || '3001';
    return `http://localhost:${backendPort}`;
  }
  
  // 4. Fallback: Relative URLs
  return '';
}
```

### `client/src/lib/queryClient.ts`
Updated to use the configuration:

```typescript
export async function apiRequest(method: string, url: string, data?: unknown) {
  // Automatically builds full URL using config
  const fullUrl = getApiUrl(url);
  
  const res = await fetch(fullUrl, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });
  
  return res;
}
```

## Environment Variables

### `.env.local` (for development)
```bash
# Backend running on different port
VITE_BACKEND_URL=http://localhost:3002

# Or specify just the port
VITE_BACKEND_PORT=3002
```

### `vercel.json` (for production)
```json
{
  "version": 2,
  "buildCommand": "npm run build:client",
  "outputDirectory": "client/dist",
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/simple.js"
    },
    {
      "src": "/(.*)",
      "dest": "/client/dist/$1"
    }
  ]
}
```

## Usage Examples

### Scenario 1: All-in-one Vercel Deployment
```bash
# Deploy to Vercel
vercel --prod

# Frontend: https://yourapp.vercel.app
# Backend API: https://yourapp.vercel.app/api/*
```

### Scenario 2: Separate Backend Service
```bash
# Backend on different service (e.g., Railway, Heroku)
export VITE_BACKEND_URL=https://your-backend.railway.app
npm run build:client
vercel --prod

# Frontend: https://yourapp.vercel.app
# Backend API: https://your-backend.railway.app/api/*
```

### Scenario 3: Local Development
```bash
# Terminal 1: Backend server
cd server && npm start  # Runs on http://localhost:3002

# Terminal 2: Frontend with custom backend URL
export VITE_BACKEND_URL=http://localhost:3002
npm run dev  # Runs on http://localhost:5173
```

## Current Working Setup

✅ **Vercel Dev Server**: `http://localhost:3003`
- Frontend and backend on same port
- API endpoints working: `/api/health`, `/api/categories`, `/api/services`
- Ready for production deployment

✅ **Environment Configuration**: 
- Automatic URL detection
- Support for custom backend URLs
- Production and development modes

✅ **API Endpoints**:
- Health check: `/api/health`
- Categories: `/api/categories` 
- Services: `/api/services`
- All endpoints return JSON responses

## Next Steps

1. **Deploy to Vercel Production**:
   ```bash
   vercel --prod
   ```

2. **Test with Custom Backend**:
   ```bash
   echo "VITE_BACKEND_URL=http://localhost:3002" >> .env.local
   npm run dev
   ```

3. **Add Environment Variables** (if needed):
   ```bash
   vercel env add VARIABLE_NAME
   ```
