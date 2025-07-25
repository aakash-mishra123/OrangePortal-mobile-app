# OrangeMantra Mobile App

A React Native mobile application for OrangeMantra's digital transformation services platform.

## Features

- **Authentication**: Login and signup with email validation
- **Service Browsing**: Browse services by category with filtering
- **Search**: Advanced search with filters and sorting
- **Service Details**: Detailed service information with pricing plans
- **Quote Requests**: Submit inquiries for services directly from the app
- **User Profile**: Manage account settings and view order history

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation v6
- **State Management**: TanStack Query for server state, Context API for auth
- **UI Components**: Custom components with React Native primitives
- **Icons**: Expo Vector Icons
- **Backend**: Connects to existing Express.js API

## Getting Started

### Prerequisites

- Node.js 18+ 
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android)

### Installation

1. Navigate to the mobile directory:
   ```bash
   cd mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update API configuration:
   - Open `src/services/api.ts`
   - Update `API_BASE_URL` to point to your backend server
   - For development: `http://localhost:5000`
   - For production: Your deployed backend URL

4. Start the development server:
   ```bash
   npm start
   ```

5. Run on device/simulator:
   - iOS: `npm run ios` or press `i` in the terminal
   - Android: `npm run android` or press `a` in the terminal
   - Web: `npm run web` or press `w` in the terminal

## Project Structure

```
mobile/
├── src/
│   ├── context/
│   │   └── AuthContext.tsx          # Authentication context
│   ├── screens/
│   │   ├── AuthScreen.tsx           # Login/Signup screen
│   │   ├── HomeScreen.tsx           # Dashboard with categories
│   │   ├── ServicesScreen.tsx       # Service listing with filters
│   │   ├── ServiceDetailScreen.tsx  # Individual service details
│   │   ├── SearchScreen.tsx         # Advanced search functionality
│   │   └── ProfileScreen.tsx        # User profile and settings
│   └── services/
│       └── api.ts                   # API client and utilities
├── App.tsx                          # Main app component with navigation
├── app.json                         # Expo configuration
└── package.json                     # Dependencies and scripts
```

## Key Components

### Authentication
- Dual-purpose auth screen for login and signup
- Session management with AsyncStorage
- Automatic token refresh and validation

### Navigation
- Bottom tab navigation for main sections
- Stack navigation for detailed views
- Conditional routing based on auth state

### Data Management
- TanStack Query for server state caching
- Optimistic updates for better UX
- Error handling and retry logic

### API Integration
- RESTful API client with proper error handling
- Activity tracking for analytics
- Session cookie management

## Configuration

### Environment Variables
Update `src/services/api.ts` with your backend configuration:

```typescript
const API_BASE_URL = 'https://your-backend-url.com'; // Production URL
// or
const API_BASE_URL = 'http://localhost:5000'; // Development URL
```

### Build Configuration
The app is configured to build for:
- iOS (requires Apple Developer account for App Store)
- Android (can be built as APK or AAB)
- Web (as PWA)

## Features Implementation

### Home Screen
- Welcome message with user greeting
- Service category grid with icons
- Quick action buttons
- Statistics display
- Testimonials section

### Services Screen
- Category filtering
- Search functionality
- Service cards with pricing
- Infinite scroll support
- Empty states

### Service Detail Screen
- Comprehensive service information
- Pricing plan selection
- Feature list with icons
- Technology stack display
- Quote request modal

### Search Screen
- Real-time search with debouncing
- Popular search suggestions
- Advanced filtering (price, category, sort)
- Search history
- Category browsing

### Profile Screen
- User information display
- Account management options
- Order history access
- App settings
- Logout functionality

## Deployment

### Development Build
```bash
expo build:ios --type development
expo build:android --type apk
```

### Production Build
```bash
expo build:ios --type archive
expo build:android --type app-bundle
```

### App Store Deployment
1. Configure `app.json` with proper bundle identifiers
2. Add app icons and splash screens
3. Build production version
4. Submit to App Store Connect (iOS) or Play Console (Android)

## Backend Requirements

The mobile app requires the following API endpoints:

- `GET /api/categories` - Service categories
- `GET /api/services` - Service listings
- `GET /api/service/:slug` - Individual service details
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `GET /api/auth/user` - Current user info
- `POST /api/auth/logout` - User logout
- `POST /api/leads` - Submit service inquiry
- `POST /api/activities` - Activity tracking

## Performance Optimizations

- Image optimization with lazy loading
- List virtualization for large datasets
- Query caching with TanStack Query
- Bundle splitting for faster startup
- Memory management for smooth scrolling

## Security Features

- Secure API communication with HTTPS
- Session token storage in secure storage
- Input validation and sanitization
- Protection against common mobile vulnerabilities

## Testing

```bash
# Run tests (when test suite is added)
npm test

# Type checking
npx tsc --noEmit

# Linting
npx eslint src/
```

## Contributing

1. Follow React Native and Expo best practices
2. Use TypeScript for type safety
3. Implement proper error handling
4. Add loading states for better UX
5. Test on both iOS and Android devices

## Troubleshooting

### Common Issues

1. **Metro bundler issues**: Clear cache with `expo start -c`
2. **iOS simulator issues**: Reset simulator and rebuild
3. **Android build failures**: Check Android SDK configuration
4. **Network requests failing**: Verify backend URL and CORS settings

### Debug Mode
```bash
expo start --dev-client
```

## Future Enhancements

- Push notifications for order updates
- Offline mode with local storage
- Biometric authentication
- Social media integration
- In-app payments
- Real-time chat support
- Dark mode support
- Multi-language support