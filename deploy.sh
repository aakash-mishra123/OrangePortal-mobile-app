#!/bin/bash

# Production Deployment Script for Vercel
echo "🚀 Starting production deployment..."

# Clean up any previous builds
echo "🧹 Cleaning up previous builds..."
rm -rf client/dist
rm -rf dist
rm -rf .vercel

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the client
echo "🏗️  Building client..."
cd client
npm install
npm run build

# Verify build output
echo "✅ Verifying build output..."
if [ ! -d "dist" ]; then
    echo "❌ Client build failed - dist directory not found"
    exit 1
fi

if [ ! -f "dist/index.html" ]; then
    echo "❌ Client build failed - index.html not found"
    exit 1
fi

echo "📁 Build output contents:"
ls -la dist/

cd ..

# Verify API function exists
echo "🔍 Verifying API function..."
if [ ! -f "api/simple.js" ]; then
    echo "❌ API function not found at api/simple.js"
    exit 1
fi

# Test API function syntax
echo "🧪 Testing API function syntax..."
node -c api/simple.js
if [ $? -ne 0 ]; then
    echo "❌ API function has syntax errors"
    exit 1
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment completed!"
echo ""
echo "🔗 Your app should be available at:"
echo "   Frontend: https://your-project.vercel.app"
echo "   API Health: https://your-project.vercel.app/api/health"
echo ""
echo "🧪 Test the API endpoints:"
echo "   curl https://your-project.vercel.app/api/health"
echo "   curl https://your-project.vercel.app/api/categories"
