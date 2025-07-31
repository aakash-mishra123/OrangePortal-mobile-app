// Vercel serverless function
export default async function handler(req, res) {
  // Set CORS headers for production
  const origin = req.headers.origin;
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3003', 
    'http://localhost:5173',
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : null
  ].filter(Boolean);

  if (allowedOrigins.includes(origin) || !origin) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Get the API path - remove /api prefix
  const path = req.url.replace('/api', '');
  const { method } = req;
  
  console.log(`API Request: ${method} ${path}`, {
    origin,
    userAgent: req.headers['user-agent'],
    vercelUrl: process.env.VERCEL_URL
  });

  try {
    // Health check
    if (path === '/health' && method === 'GET') {
      return res.status(200).json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        path: path,
        method: method
      });
    }

    // Test endpoint
    if (path === '/test' && method === 'GET') {
      return res.status(200).json({ 
        message: 'API is working!',
        path: path,
        method: method,
        timestamp: new Date().toISOString()
      });
    }

    // Categories endpoint
    if (path === '/categories' && method === 'GET') {
      const categories = [
        { 
          id: '1', 
          name: 'Web Development', 
          slug: 'web-development', 
          description: 'Modern web applications and websites', 
          icon: '🌐',
          serviceCount: 5
        },
        { 
          id: '2', 
          name: 'Mobile Apps', 
          slug: 'mobile-apps', 
          description: 'iOS and Android applications', 
          icon: '📱',
          serviceCount: 3
        },
        { 
          id: '3', 
          name: 'UI/UX Design', 
          slug: 'ui-ux-design', 
          description: 'User interface and experience design', 
          icon: '🎨',
          serviceCount: 4
        }
      ];
      return res.status(200).json(categories);
    }

    // Services endpoint
    if ((path === '/services' || path.startsWith('/services?')) && method === 'GET') {
      const services = [
        { 
          id: '1', 
          title: 'React Website Development', 
          slug: 'react-website', 
          description: 'Modern React website with responsive design',
          category: 'web-development',
          categoryId: '1',
          pricing: { basic: 999, standard: 1999, premium: 2999 },
          features: ['Responsive Design', 'SEO Optimized', 'Modern UI'],
          deliveryTime: '5-7 days',
          techStack: ['React', 'TypeScript', 'Tailwind CSS']
        },
        { 
          id: '2', 
          title: 'Mobile App Development', 
          slug: 'mobile-app', 
          description: 'Native mobile app for iOS and Android',
          category: 'mobile-apps',
          categoryId: '2',
          pricing: { basic: 2999, standard: 4999, premium: 7999 },
          features: ['Cross Platform', 'Native Performance', 'App Store Ready'],
          deliveryTime: '2-3 weeks',
          techStack: ['React Native', 'TypeScript', 'Firebase']
        }
      ];
      return res.status(200).json(services);
    }

    // Service by slug
    if (path.startsWith('/service/') && method === 'GET') {
      const slug = path.split('/service/')[1];
      const services = {
        'react-website': {
          id: '1', 
          title: 'React Website Development', 
          slug: 'react-website', 
          description: 'Modern React website with responsive design and SEO optimization',
          category: 'web-development',
          categoryId: '1',
          pricing: { basic: 999, standard: 1999, premium: 2999 },
          features: ['Responsive Design', 'SEO Optimized', 'Modern UI', 'Fast Loading'],
          deliveryTime: '5-7 days',
          techStack: ['React', 'TypeScript', 'Tailwind CSS']
        },
        'mobile-app': {
          id: '2', 
          title: 'Mobile App Development', 
          slug: 'mobile-app', 
          description: 'Native mobile app development for iOS and Android platforms',
          category: 'mobile-apps',
          categoryId: '2',
          pricing: { basic: 2999, standard: 4999, premium: 7999 },
          features: ['Cross Platform', 'Native Performance', 'App Store Ready', 'Push Notifications'],
          deliveryTime: '2-3 weeks',
          techStack: ['React Native', 'TypeScript', 'Firebase']
        }
      };
      
      const service = services[slug];
      if (service) {
        return res.status(200).json(service);
      } else {
        return res.status(404).json({ message: 'Service not found' });
      }
    }

    // Default response for unmatched routes
    res.status(404).json({ 
      message: 'API route not found',
      path: path,
      method: method,
      available_routes: [
        'GET /api/health',
        'GET /api/test', 
        'GET /api/categories',
        'GET /api/services',
        'GET /api/service/:slug'
      ]
    });

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
}
