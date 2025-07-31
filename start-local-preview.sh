#!/bin/bash

echo "🚀 Starting local Vercel preview..."

# Build everything first
echo "Building client and server..."
./test-vercel-build.sh

if [ $? -ne 0 ]; then
    echo "❌ Build failed, aborting preview"
    exit 1
fi

# Start the local preview
echo ""
echo "Starting Vercel dev server..."
echo "This will simulate the production environment locally"
echo ""
vercel dev --listen 3000
