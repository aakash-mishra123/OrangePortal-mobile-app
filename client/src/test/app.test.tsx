import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../App';

// Mock the queryClient
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

// Mock fetch for API calls
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock location for routing
const mockLocation = {
  pathname: '/',
  search: '',
  hash: '',
  state: null,
};

Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});

describe('AppKickstart Application', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createTestQueryClient();
    mockFetch.mockClear();
    mockLocation.pathname = '/';
  });

  const renderApp = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    );
  };

  describe('Home Page', () => {
    beforeEach(() => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([
          {
            id: 'mobile-app-development',
            name: 'Mobile App Development',
            description: 'Professional mobile app development services',
            icon: '📱',
            slug: 'mobile-app-development',
            services: 6
          },
          {
            id: 'web-development',
            name: 'Web Development',
            description: 'Custom web development solutions',
            icon: '🌐',
            slug: 'web-development',
            services: 4
          }
        ])
      });
    });

    it('renders home page with categories', async () => {
      renderApp();
      
      await waitFor(() => {
        expect(screen.getByText(/Kickstart Your App or Website/i)).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText('Mobile App Development')).toBeInTheDocument();
        expect(screen.getByText('Web Development')).toBeInTheDocument();
      });
    });

    it('displays animated hero section', async () => {
      renderApp();
      
      const heroTitle = await screen.findByText(/Kickstart Your App or Website/i);
      expect(heroTitle).toBeInTheDocument();
      
      const subtitle = screen.getByText(/Connect with expert developers instantly/i);
      expect(subtitle).toBeInTheDocument();
    });
  });

  describe('Authentication Flow', () => {
    beforeEach(() => {
      mockLocation.pathname = '/auth';
    });

    it('renders auth page with signup form', () => {
      renderApp();
      
      expect(screen.getByText('Start Your Journey')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Your full name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('your.email@example.com')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('+91 XXXXX XXXXX')).toBeInTheDocument();
    });

    it('toggles between signup and login modes', async () => {
      const user = userEvent.setup();
      renderApp();
      
      expect(screen.getByText('Start Your Journey')).toBeInTheDocument();
      
      const toggleButton = screen.getByText('Sign In Instead');
      await user.click(toggleButton);
      
      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
      expect(screen.queryByPlaceholderText('Your full name')).not.toBeInTheDocument();
    });
  });

  describe('Service Categories', () => {
    beforeEach(() => {
      mockLocation.pathname = '/category/mobile-app-development';
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([
          {
            id: 'ui-ux-design',
            title: 'UI/UX Design',
            description: 'Professional mobile app UI/UX design',
            categoryId: 'mobile-app-development',
            hourlyRate: 2500,
            slug: 'ui-ux-design',
            imageUrl: '/images/ui-ux-design.jpg',
            features: ['User Research', 'Wireframing', 'Prototyping'],
            technologies: ['Figma', 'Adobe XD', 'Sketch']
          }
        ])
      });
    });

    it('renders category page with services', async () => {
      renderApp();
      
      await waitFor(() => {
        expect(screen.getByText('Mobile App Development')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText('UI/UX Design')).toBeInTheDocument();
      });
    });

    it('displays enhanced category header with animations', async () => {
      renderApp();
      
      await waitFor(() => {
        expect(screen.getByText('⚡ Instant Setup')).toBeInTheDocument();
        expect(screen.getByText('👨‍💻 Expert Team')).toBeInTheDocument();
        expect(screen.getByText('🎯 Premium Quality')).toBeInTheDocument();
      });
    });
  });

  describe('Service Detail Page', () => {
    beforeEach(() => {
      mockLocation.pathname = '/service/ui-ux-design';
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          id: 'ui-ux-design',
          title: 'UI/UX Design',
          description: 'Professional mobile app UI/UX design services',
          categoryId: 'mobile-app-development',
          hourlyRate: 2500,
          slug: 'ui-ux-design',
          imageUrl: '/images/ui-ux-design.jpg',
          longDescription: 'Comprehensive UI/UX design services for mobile applications',
          features: ['User Research', 'Wireframing', 'Prototyping', 'Visual Design'],
          technologies: ['Figma', 'Adobe XD', 'Sketch', 'Principle']
        })
      });
    });

    it('renders service detail page with resource selector', async () => {
      renderApp();
      
      await waitFor(() => {
        expect(screen.getByText('UI/UX Design')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText('Select Resource Type')).toBeInTheDocument();
      });
    });

    it('displays achievement cards', async () => {
      renderApp();
      
      await waitFor(() => {
        expect(screen.getByText('100+')).toBeInTheDocument();
        expect(screen.getByText('Projects Completed')).toBeInTheDocument();
      });
    });
  });

  describe('Interactive Stepper Form', () => {
    beforeEach(() => {
      mockLocation.pathname = '/service/ui-ux-design';
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          id: 'ui-ux-design',
          title: 'UI/UX Design',
          description: 'Professional mobile app UI/UX design services',
          categoryId: 'mobile-app-development',
          hourlyRate: 2500,
          slug: 'ui-ux-design',
          imageUrl: '/images/ui-ux-design.jpg',
          longDescription: 'Comprehensive UI/UX design services',
          features: ['User Research', 'Wireframing'],
          technologies: ['Figma', 'Adobe XD']
        })
      });
    });

    it('renders 3-step stepper form after resource selection', async () => {
      const user = userEvent.setup();
      renderApp();
      
      // Wait for service to load
      await waitFor(() => {
        expect(screen.getByText('UI/UX Design')).toBeInTheDocument();
      });

      // Click on a resource type (UI/UX Designer)
      const uiuxCard = await screen.findByText('UI/UX Designer');
      await user.click(uiuxCard);

      // Check if stepper form appears
      await waitFor(() => {
        expect(screen.getByText('Contact Info')).toBeInTheDocument();
        expect(screen.getByText('Project Details')).toBeInTheDocument();
        expect(screen.getByText('Budget & Timeline')).toBeInTheDocument();
      });
    });

    it('navigates through stepper form steps', async () => {
      const user = userEvent.setup();
      renderApp();
      
      // Wait for service and select resource
      await waitFor(() => {
        expect(screen.getByText('UI/UX Design')).toBeInTheDocument();
      });

      const uiuxCard = await screen.findByText('UI/UX Designer');
      await user.click(uiuxCard);

      // Fill Step 1 - Contact Info
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Your full name')).toBeInTheDocument();
      });

      await user.type(screen.getByPlaceholderText('Your full name'), 'John Doe');
      await user.type(screen.getByPlaceholderText('your.email@example.com'), 'john@example.com');
      await user.type(screen.getByPlaceholderText('+91 XXXXX XXXXX'), '+91 98765 43210');

      // Continue to Step 2
      await user.click(screen.getByText('Continue to Project Details'));

      // Check Step 2 appears
      await waitFor(() => {
        expect(screen.getByText('Tell Us About Your Project')).toBeInTheDocument();
      });
    });

    it('validates form fields correctly', async () => {
      const user = userEvent.setup();
      renderApp();
      
      await waitFor(() => {
        expect(screen.getByText('UI/UX Design')).toBeInTheDocument();
      });

      const uiuxCard = await screen.findByText('UI/UX Designer');
      await user.click(uiuxCard);

      // Try to submit empty form
      await waitFor(() => {
        expect(screen.getByText('Continue to Project Details')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Continue to Project Details'));

      // Check validation errors appear
      await waitFor(() => {
        expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument();
      });
    });
  });

  describe('Admin Dashboard', () => {
    beforeEach(() => {
      mockLocation.pathname = '/admin-dashboard';
      
      // Mock admin dashboard API calls
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([
            {
              id: '1',
              userId: 'user1',
              serviceId: 'ui-ux-design',
              resourceType: 'designer',
              name: 'John Doe',
              email: 'john@example.com',
              phone: '+91 98765 43210',
              projectDetails: 'Need UI/UX design for mobile app',
              experienceLevel: 'senior',
              budget: '50k-1lakh',
              projectDuration: '2-4weeks',
              timeFrame: 'immediately',
              status: 'new',
              createdAt: new Date().toISOString()
            }
          ])
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            totalActivities: 150,
            serviceViews: 45,
            leadGeneration: 23,
            avgResponseTime: '2.5 hours'
          })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([
            {
              id: '1',
              activityType: 'service_view',
              serviceId: 'ui-ux-design',
              timestamp: new Date().toISOString()
            }
          ])
        });
    });

    it('renders admin dashboard with leads', async () => {
      renderApp();
      
      await waitFor(() => {
        expect(screen.getByText('AppKickstart Admin')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('john@example.com')).toBeInTheDocument();
      });
    });

    it('displays analytics cards', async () => {
      renderApp();
      
      await waitFor(() => {
        expect(screen.getByText('Total Activities')).toBeInTheDocument();
        expect(screen.getByText('150')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('handles API errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('API Error'));
      
      renderApp();
      
      // Should not crash and show loading state initially
      expect(screen.getByText(/Kickstart Your App or Website/i)).toBeInTheDocument();
    });

    it('shows loading states while fetching data', () => {
      mockFetch.mockImplementationOnce(() => 
        new Promise(resolve => setTimeout(resolve, 1000))
      );
      
      renderApp();
      
      // Should show skeleton loading
      expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('renders correctly on mobile viewport', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      renderApp();
      
      expect(screen.getByText(/Kickstart Your App or Website/i)).toBeInTheDocument();
    });
  });

  describe('Animation and Interactions', () => {
    it('applies animation classes to elements', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([])
      });

      renderApp();
      
      // Check if animation classes are applied
      await waitFor(() => {
        const animatedElements = document.querySelectorAll('.animate-bounce-slow');
        expect(animatedElements.length).toBeGreaterThan(0);
      });
    });

    it('applies hover effects to interactive elements', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([
          {
            id: 'mobile-app-development',
            name: 'Mobile App Development',
            description: 'Professional mobile app development services',
            icon: '📱',
            slug: 'mobile-app-development',
            services: 6
          }
        ])
      });

      renderApp();
      
      await waitFor(() => {
        const hoverElements = document.querySelectorAll('.hover-lift');
        expect(hoverElements.length).toBeGreaterThan(0);
      });
    });
  });
});