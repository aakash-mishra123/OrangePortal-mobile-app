#!/bin/bash

echo "🚀 Setting up OrangeMantra Mobile Development Environment"
echo "================================================"

# Check if we're in the mobile directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the mobile directory"
    echo "   cd mobile && ./start-mobile.sh"
    exit 1
fi

echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully!"
echo ""
echo "🔧 Mobile Development Options:"
echo ""
echo "1. Web Preview (Recommended for Replit):"
echo "   npm run web"
echo ""
echo "2. Expo Development Server:"
echo "   npm start"
echo "   Then scan QR code with Expo Go app"
echo ""
echo "3. Type Checking:"
echo "   npm run type-check"
echo ""
echo "4. Linting:"
echo "   npm run lint"
echo ""
echo "⚠️  Important: Update API_BASE_URL in src/services/api.ts"
echo "   Replace 'your-repl-name' with your actual Replit domain"
echo ""
echo "🎉 Mobile development environment is ready!"
echo "   Run 'npm run web' to start testing in the browser"