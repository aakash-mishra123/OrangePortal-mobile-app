#!/bin/bash

echo "🔧 Testing Frontend-Backend Integration..."

# Test if API endpoints are working
echo "1. Testing API Health Check:"
curl -s http://localhost:3002/api/health | jq '.'

echo -e "\n2. Testing API Categories:"
curl -s http://localhost:3002/api/categories | jq '.'

echo -e "\n3. Testing Frontend (should load without errors):"
curl -s http://localhost:3002/ | grep -q "<!DOCTYPE html" && echo "✅ Frontend HTML loads correctly" || echo "❌ Frontend not loading"

echo -e "\n4. API URL Configuration:"
if [ -f "client/.env" ]; then
    echo "VITE_API_URL in client/.env:"
    grep "VITE_API_URL" client/.env || echo "VITE_API_URL not found"
else
    echo "client/.env not found"
fi

echo -e "\n🚀 Integration Test Complete!"
echo "Your frontend will make API calls to:"
echo "- Local: http://localhost:3002/api/*"
echo "- Production: https://your-app.vercel.app/api/*"
