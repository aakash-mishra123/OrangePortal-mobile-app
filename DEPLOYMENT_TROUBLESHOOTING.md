# Vercel Deployment Troubleshooting Guide

## Common Issues and Solutions

### 1. CSS/Static Files Not Loading

**Problem**: Styles not applied, images not showing
**Cause**: Incorrect routing in vercel.json

**Solution**: Updated vercel.json with proper static asset routing:
```json
{
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/simple.js" },
    { "src": "/manifest.json", "dest": "/client/dist/manifest.json" },
    { "src": "/icons/(.*)", "dest": "/client/dist/icons/$1" },
    { "src": "/(.*\\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot))", "dest": "/client/dist/$1" },
    { "src": "/(.*)", "dest": "/client/dist/index.html" }
  ]
}
```

### 2. API Responses Not Working

**Problem**: API calls failing in production
**Cause**: CORS issues or incorrect API routing

**Solutions**:
- ✅ Updated CORS headers for production domains
- ✅ Added proper error logging
- ✅ Ensured API routes are processed before static routes

### 3. Build Issues

**Problem**: Build fails or incomplete
**Solution**: Use the deployment script:
```bash
./deploy.sh
```

## Deployment Checklist

### Pre-deployment
- [ ] Client builds successfully (`npm run build:client`)
- [ ] API function syntax is valid (`node -c api/simple.js`)
- [ ] All environment variables are set in Vercel dashboard

### Post-deployment Testing
- [ ] Frontend loads: `https://your-project.vercel.app`
- [ ] API health check: `https://your-project.vercel.app/api/health`
- [ ] Categories API: `https://your-project.vercel.app/api/categories`
- [ ] CSS/styles loading properly
- [ ] PWA features working (manifest, service worker)

## Debug Commands

### Test API locally
```bash
# Start Vercel dev server
vercel dev --listen 3003

# Test endpoints
curl http://localhost:3003/api/health
curl http://localhost:3003/api/categories
```

### Check build output
```bash
cd client && npm run build
ls -la dist/
```

### View Vercel logs
```bash
vercel logs --follow
```

## Environment Variables

Add these in Vercel dashboard if needed:
- `NODE_ENV=production`
- `DATABASE_URL` (if using database)
- `SESSION_SECRET` (if using sessions)

## File Structure Verification

Your deployment should have:
```
/
├── api/
│   └── simple.js          # Serverless API function
├── client/
│   └── dist/              # Built frontend
│       ├── index.html
│       ├── assets/        # CSS, JS files
│       ├── manifest.json
│       └── icons/
└── vercel.json           # Deployment config
```
