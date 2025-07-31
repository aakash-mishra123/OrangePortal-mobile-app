#!/bin/bash

echo "🔧 Testing Vercel deployment locally..."

# Test client build
echo "1. Testing client build..."
cd client
npm install --silent
npm run build
if [ $? -eq 0 ]; then
    echo "✅ Client build successful"
else
    echo "❌ Client build failed"
    exit 1
fi

# Go back to root
cd ..

# Test server build  
echo "2. Testing server build..."
npm run build:server
if [ $? -eq 0 ]; then
    echo "✅ Server build successful"
else
    echo "❌ Server build failed"
    exit 1
fi

# Check if required files exist
echo "3. Checking required files..."
if [ -f "client/dist/index.html" ]; then
    echo "✅ Client build output exists"
else
    echo "❌ Client build output missing"
    exit 1
fi

if [ -f "dist/index.js" ]; then
    echo "✅ Server build output exists"
else
    echo "❌ Server build output missing"
    exit 1
fi

if [ -f "vercel.json" ]; then
    echo "✅ Vercel config exists"
else
    echo "❌ Vercel config missing"
    exit 1
fi

# Check environment variables
echo "4. Checking environment setup..."
if [ -f ".env" ]; then
    echo "✅ Root .env file exists"
    if grep -q "DATABASE_URL" .env; then
        echo "✅ DATABASE_URL configured"
    else
        echo "⚠️  DATABASE_URL not found in .env"
    fi
else
    echo "⚠️  Root .env file not found"
fi

echo ""
echo "🚀 Pre-deployment check complete!"
echo ""
echo "To deploy to Vercel:"
echo "1. Run: vercel --prod"
echo "2. Or push to GitHub and auto-deploy via Vercel dashboard"
echo ""
echo "Environment variables needed on Vercel:"
echo "- DATABASE_URL"
echo "- SESSION_SECRET"
echo "- NODE_ENV=production"
