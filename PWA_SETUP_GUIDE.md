# PWA Setup Guide for Local Development

## Overview
This guide will help you configure the Progressive Web App (PWA) features for AppKickstart on your local development environment.

## Prerequisites
- Node.js installed
- Browser that supports PWA (Chrome, Firefox, Safari, Edge)
- HTTPS or localhost for PWA features to work

## Files Structure
```
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                 # Service worker
│   ├── offline.html          # Offline fallback page
│   └── icons/                # App icons
│       ├── icon-192x192.png
│       ├── icon-512x512.png
│       └── apple-touch-icon.png
├── client/src/
│   ├── components/
│   │   ├── pwa-install-button.tsx  # Install button component
│   │   └── pwa-status.tsx          # PWA status indicator
│   └── lib/
│       └── pwa.ts                  # PWA manager (legacy)
└── server/
    └── routes.ts                   # PWA file serving routes
```

## Step 1: Install Dependencies
All required packages are already installed:
- `@replit/vite-plugin-cartographer`
- `@replit/vite-plugin-runtime-error-modal`

## Step 2: Verify PWA Files

### Manifest Configuration (`public/manifest.json`)
The manifest is configured with:
- App name: "AppKickstart"
- Theme colors matching your brand
- Icons for different sizes
- Start URL and display mode
- Scope and orientation settings

### Service Worker (`public/sw.js`)
Features implemented:
- Cache-first strategy for static assets
- Network-first for API calls
- Offline fallback page
- Cache versioning and cleanup

### Icons (`public/icons/`)
Required icon sizes:
- 192x192 (minimum for PWA)
- 512x512 (for splash screen)
- Apple touch icon for iOS

## Step 3: Server Configuration

The Express server serves PWA files with proper MIME types:
```javascript
// PWA Routes in server/routes.ts
app.get('/manifest.json', (req, res) => {
  res.setHeader('Content-Type', 'application/manifest+json');
  res.sendFile('manifest.json', { root: 'public' });
});

app.get('/sw.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.setHeader('Service-Worker-Allowed', '/');
  res.sendFile('sw.js', { root: 'public' });
});
```

## Step 4: Client-Side Integration

### Install Button Component
The `PWAInstallButton` component:
- Listens for `beforeinstallprompt` event
- Shows install button when available
- Handles install prompt and user choice
- Shows success/error messages

### PWA Status Component
The `PWAStatus` component shows:
- Online/offline status
- PWA installation status
- Service worker status

## Step 5: Testing PWA Features

### Local Development (HTTP)
On `localhost`, most PWA features work including:
- Service worker registration
- Caching functionality
- Install prompts (limited)

### HTTPS Testing
For full PWA testing:
1. Use ngrok: `ngrok http 5000`
2. Use local HTTPS server
3. Deploy to HTTPS hosting

### Chrome DevTools Testing
1. Open Chrome DevTools
2. Go to "Application" tab
3. Check "Manifest" section
4. Verify "Service Workers" registration
5. Test "Storage" and cache

## Step 6: Verification Checklist

- [ ] Service worker registers successfully
- [ ] Manifest loads without errors
- [ ] Icons are accessible
- [ ] Install button appears (on supported browsers)
- [ ] Offline page works when network is disabled
- [ ] Cache is working for static assets

## Step 7: Browser-Specific Notes

### Chrome
- Install prompt available on HTTPS
- Best PWA debugging tools
- Install banner after user engagement

### Firefox
- PWA support improving
- Install prompt available
- Good offline functionality

### Safari (iOS)
- Add to Home Screen manually
- Limited install prompt support
- Good offline caching

### Edge
- Full PWA support
- Windows integration
- Install prompts available

## Troubleshooting

### Service Worker Not Registering
- Check console for errors
- Verify sw.js is accessible at /sw.js
- Check MIME type is application/javascript

### Install Button Not Showing
- Ensure HTTPS (or localhost)
- Check PWA criteria are met
- Verify manifest is valid
- User engagement may be required

### Offline Functionality Not Working
- Check service worker is active
- Verify cache strategy
- Test with network disabled in DevTools

### Icons Not Loading
- Check file paths in manifest
- Verify icon files exist
- Check proper image formats (PNG recommended)

## Performance Tips

1. **Optimize Icons**: Use properly sized PNG icons
2. **Cache Strategy**: Implement appropriate caching for your content
3. **Bundle Size**: Keep service worker small and efficient
4. **Updates**: Handle service worker updates gracefully

## Production Deployment

When deploying to production:
1. Ensure HTTPS is enabled
2. Update manifest URLs for production domain
3. Test PWA criteria with Lighthouse
4. Verify all icons are accessible
5. Test install flow on different devices

## Monitoring

Monitor PWA performance:
- Service worker registration success rate
- Cache hit rates
- Install conversion rates
- Offline usage patterns

## Support

- Chrome: Full PWA support
- Firefox: Good support, improving
- Safari: Basic support, manual install
- Edge: Full support with Windows integration

---

## Quick Start Commands

```bash
# Start development server
npm run dev

# Test PWA in Chrome DevTools
# 1. Open localhost:5000
# 2. F12 -> Application tab
# 3. Check Manifest and Service Workers

# Test offline functionality
# 1. Open DevTools -> Network tab
# 2. Check "Offline" checkbox
# 3. Refresh page to test offline fallback
```

The PWA is fully configured and ready for testing on your local development environment!