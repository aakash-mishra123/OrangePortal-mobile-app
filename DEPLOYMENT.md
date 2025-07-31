# OrangePortal - PWA Deployment Guide

## Vercel Deployment

### Prerequisites
1. Push your code to a GitHub repository
2. Create a Vercel account at vercel.com
3. Have your database URL ready (Neon PostgreSQL)

### Deploy to Vercel

1. **Connect GitHub Repository**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**
   - Root Directory: `/` (keep default)
   - Build Command: `npm run build:client`
   - Output Directory: `client/dist`
   - Install Command: `npm install`

3. **Set Environment Variables**
   Add these environment variables in Vercel dashboard:
   ```
   DATABASE_URL=your_neon_database_url
   SESSION_SECRET=your_session_secret_key
   NODE_ENV=production
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be available at `https://your-app-name.vercel.app`

### Post-Deployment

1. **Update Frontend API URL** (if needed)
   - If you encounter CORS issues, update `client/.env`:
   ```
   VITE_API_URL=https://your-app-name.vercel.app
   ```

2. **Test Your Deployment**
   - Visit your Vercel URL
   - Test user registration/login
   - Test service browsing
   - Test PWA installation

### Project Structure for Vercel
```
/
├── client/          # Frontend (React + Vite)
│   ├── dist/        # Build output (generated)
│   ├── src/
│   └── package.json
├── server/          # Backend (Express + Node.js)
├── shared/          # Shared schemas
├── api/             # Vercel serverless functions
├── vercel.json      # Vercel configuration
└── package.json     # Root package.json
```

### Troubleshooting

**Build Errors:**
- Check that all dependencies are in the correct package.json files
- Ensure TypeScript types are correct
- Verify environment variables are set

**Database Connection:**
- Verify DATABASE_URL is correctly set in Vercel
- Check that your Neon database allows connections
- Ensure session table exists

**PWA Features:**
- PWA install prompt should work on HTTPS (Vercel provides this)
- Service worker should cache properly
- Offline functionality should work

### Environment Variables Needed

**Production (Vercel):**
```
DATABASE_URL=postgresql://...
SESSION_SECRET=your-secret-key
NODE_ENV=production
```

**Development (Local):**
```
DATABASE_URL=postgresql://...
SESSION_SECRET=dev-secret-key
NODE_ENV=development
```

### Additional Notes

- The app is configured as a PWA with offline support
- Service worker caches API responses and static assets
- Install prompt appears automatically on supported browsers
- Works on mobile devices and can be installed as an app
