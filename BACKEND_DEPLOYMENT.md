# Backend Deployment Configuration

## Deploy to Render.com

### 1. Create a new Web Service on Render
- Connect your GitHub repository
- Choose "Web Service"
- Set the following configuration:

### 2. Build Settings
- **Build Command:** `npm install && npm run build:server`
- **Start Command:** `npm start`
- **Root Directory:** `/` (or leave blank)

### 3. Environment Variables
Set these in Render dashboard:
```
DATABASE_URL=your_neon_database_url
SESSION_SECRET=your_session_secret
NODE_ENV=production
PORT=10000
```

### 4. Backend URL
Your backend will be available at: `https://your-app-name.onrender.com`

## Deploy to Railway

### 1. Connect GitHub repository
### 2. Set environment variables:
```
DATABASE_URL=your_neon_database_url
SESSION_SECRET=your_session_secret
NODE_ENV=production
```

### 3. Railway will auto-detect and run: `npm start`

## Deploy to Heroku

### 1. Install Heroku CLI
### 2. Create Heroku app:
```bash
heroku create your-backend-app
```

### 3. Set environment variables:
```bash
heroku config:set DATABASE_URL=your_neon_database_url
heroku config:set SESSION_SECRET=your_session_secret
heroku config:set NODE_ENV=production
```

### 4. Deploy:
```bash
git push heroku main
```

## Update Frontend Configuration

After deploying backend, update your frontend to use the backend URL:

**In `client/.env`:**
```
VITE_API_URL=https://your-backend-url.onrender.com
```

**Then redeploy frontend to Vercel.**
