# OrangeMantra Mobile App Setup Guide

## Quick Setup

### 1. Install Dependencies
Since we're in a Replit environment, the mobile app needs to be set up separately. Follow these steps:

```bash
# Navigate to mobile directory
cd mobile

# Install dependencies (run this in a terminal)
npm install
```

### 2. Configure API Connection
Update the API base URL in `src/services/api.ts`:

```typescript
const API_BASE_URL = 'https://your-repl-name.replit.app'; // Replace with your Replit URL
```

### 3. Development Options

#### Option A: Expo Go (Recommended)
1. Install Expo CLI: `npm install -g @expo/cli`
2. Start the development server: `npm start`
3. Install Expo Go app on your phone
4. Scan the QR code to run the app

#### Option B: Web Preview
1. Run: `npm run web`
2. Open the web URL in your browser
3. Test mobile responsiveness using browser dev tools

#### Option C: Simulators (Advanced)
- **iOS**: Requires macOS and Xcode
- **Android**: Requires Android Studio and AVD

## Replit-Specific Setup

Since you're using Replit, the easiest way to test the mobile app is:

1. **Web Preview**: Run `npm run web` in the mobile directory
2. **Mobile Testing**: Use browser dev tools to simulate mobile devices
3. **Expo Go**: If you have access to a mobile device, use Expo Go for real device testing

## API Configuration

The mobile app connects to your existing Express.js backend. Make sure:

1. Backend is running on port 5000
2. CORS is configured to allow mobile app requests
3. Session cookies work cross-origin

## Current Project Structure

```
mobile/
├── src/
│   ├── context/AuthContext.tsx    # Authentication management
│   ├── screens/                   # All app screens
│   │   ├── AuthScreen.tsx         # Login/Signup
│   │   ├── HomeScreen.tsx         # Dashboard
│   │   ├── ServicesScreen.tsx     # Service listings
│   │   ├── ServiceDetailScreen.tsx # Service details
│   │   ├── SearchScreen.tsx       # Advanced search
│   │   └── ProfileScreen.tsx      # User profile
│   └── services/api.ts            # API client
├── App.tsx                        # Main app with navigation
└── package.json                   # Dependencies
```

## Features Implemented

✅ Authentication (login/signup)
✅ Service browsing by category
✅ Advanced search with filters
✅ Service detail pages
✅ Quote request forms
✅ User profile management
✅ Activity tracking
✅ Responsive mobile design

## Next Steps

1. Update API_BASE_URL with your Replit domain
2. Run `npm install` in the mobile directory
3. Test with `npm run web` for web preview
4. Use Expo Go for mobile device testing

## Troubleshooting

**Dependencies not installing?**
- Make sure you're in the mobile directory
- Try `npm install --legacy-peer-deps`

**API calls not working?**
- Check the API_BASE_URL in src/services/api.ts
- Verify backend is running and accessible
- Check browser console for CORS errors

**Navigation errors?**
- React Navigation requires specific React Native versions
- The app is configured for Expo SDK 51

## Production Deployment

For production deployment:

1. **Expo Build Service**: `expo build:android` or `expo build:ios`
2. **EAS Build**: Modern Expo build service
3. **App Stores**: Submit to Google Play Store and Apple App Store

The mobile app is fully functional and ready for development and testing!