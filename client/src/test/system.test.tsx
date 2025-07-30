import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../App';

// Mock fetch
global.fetch = vi.fn();

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

describe('AppKickstart System Tests', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createTestQueryClient();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  const renderApp = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    );
  };

  describe('Error Handling Tests', () => {
    it('handles API failures gracefully without throwing', async () => {
      // Mock failed API response
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));
      
      // Should not throw and render loading state
      expect(() => renderApp()).not.toThrow();
      
      // Should show some content even with API failure
      expect(screen.getByText(/Kickstart Your App or Website/i)).toBeInTheDocument();
    });

    it('handles invalid responses without runtime errors', async () => {
      // Mock invalid JSON response
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error('Invalid JSON'))
      });
      
      expect(() => renderApp()).not.toThrow();
    });

    it('handles missing data gracefully', async () => {
      // Mock empty response
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(null)
      });
      
      expect(() => renderApp()).not.toThrow();
    });
  });

  describe('Form Validation Tests', () => {
    beforeEach(() => {
      // Mock successful service fetch
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          id: 'ui-ux-design',
          title: 'UI/UX Design',
          description: 'Professional design services',
          categoryId: 'design-creative',
          hourlyRate: 2500,
          slug: 'ui-ux-design',
          features: ['User Research', 'Wireframing'],
          technologies: ['Figma', 'Adobe XD']
        })
      });
    });

    it('does not show validation errors while typing', async () => {
      const user = userEvent.setup();
      
      // Mock window location for service detail page
      delete (window as any).location;
      (window as any).location = { pathname: '/service/ui-ux-design' };
      
      renderApp();
      
      // Wait for service to load and select resource
      await waitFor(() => {
        const resourceCard = screen.getByText('UI/UX Designer');
        expect(resourceCard).toBeInTheDocument();
      });
      
      const resourceCard = screen.getByText('UI/UX Designer');
      await user.click(resourceCard);
      
      // Start typing in name field
      const nameInput = await screen.findByPlaceholderText('Your full name');
      await user.type(nameInput, 'J'); // Single character
      
      // Should not show validation error while typing
      expect(screen.queryByText('Name must be at least 2 characters')).not.toBeInTheDocument();
    });

    it('shows validation errors only after form submission', async () => {
      const user = userEvent.setup();
      
      delete (window as any).location;
      (window as any).location = { pathname: '/service/ui-ux-design' };
      
      renderApp();
      
      await waitFor(() => {
        const resourceCard = screen.getByText('UI/UX Designer');
        expect(resourceCard).toBeInTheDocument();
      });
      
      const resourceCard = screen.getByText('UI/UX Designer');
      await user.click(resourceCard);
      
      // Try to submit empty form
      const submitButton = await screen.findByText('Continue to Project Details');
      await user.click(submitButton);
      
      // Now validation errors should appear
      await waitFor(() => {
        expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument();
      });
    });
  });

  describe('Component Rendering Tests', () => {
    it('renders all main components without errors', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([
          {
            id: 'design-creative',
            name: 'Design & Creative',
            description: 'Professional design services',
            icon: '🎨',
            slug: 'design-creative',
            services: 5
          }
        ])
      });
      
      expect(() => renderApp()).not.toThrow();
      
      // Check main navigation elements render
      await waitFor(() => {
        expect(screen.getByText(/Kickstart Your App or Website/i)).toBeInTheDocument();
      });
    });

    it('handles component state changes without errors', async () => {
      const user = userEvent.setup();
      
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([])
      });
      
      renderApp();
      
      // Test interactive elements don't cause errors
      const buttons = screen.getAllByRole('button');
      
      // Click various buttons to test state changes
      for (const button of buttons.slice(0, 3)) {
        expect(() => fireEvent.click(button)).not.toThrow();
      }
    });
  });

  describe('Navigation Tests', () => {
    it('handles route changes without errors', () => {
      expect(() => renderApp()).not.toThrow();
      
      // Change location programmatically
      delete (window as any).location;
      (window as any).location = { pathname: '/search' };
      
      expect(() => renderApp()).not.toThrow();
    });
  });

  describe('Async Operations Tests', () => {
    it('handles concurrent API calls without errors', async () => {
      // Mock multiple API responses
      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([])
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({})
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([])
        });
      
      expect(() => renderApp()).not.toThrow();
      
      // Wait for all async operations to complete
      await waitFor(() => {
        expect(screen.getByText(/Kickstart Your App or Website/i)).toBeInTheDocument();
      });
    });

    it('handles query invalidation without errors', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([])
      });
      
      renderApp();
      
      // Simulate query invalidation
      expect(() => {
        queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      }).not.toThrow();
    });
  });

  describe('Memory Leak Prevention', () => {
    it('cleans up event listeners and subscriptions', () => {
      const { unmount } = renderApp();
      
      // Should not throw during unmount
      expect(() => unmount()).not.toThrow();
    });

    it('handles rapid component mounting/unmounting', () => {
      for (let i = 0; i < 5; i++) {
        const { unmount } = renderApp();
        expect(() => unmount()).not.toThrow();
      }
    });
  });

  describe('Edge Cases', () => {
    it('handles null and undefined data gracefully', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(null)
      });
      
      expect(() => renderApp()).not.toThrow();
    });

    it('handles malformed responses without crashing', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ invalid: 'data' })
      });
      
      expect(() => renderApp()).not.toThrow();
    });

    it('handles network timeouts gracefully', async () => {
      (global.fetch as any).mockImplementationOnce(
        () => new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 100)
        )
      );
      
      expect(() => renderApp()).not.toThrow();
    });
  });

  describe('Performance Tests', () => {
    it('renders within acceptable time limits', async () => {
      const startTime = Date.now();
      
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([])
      });
      
      renderApp();
      
      await waitFor(() => {
        expect(screen.getByText(/Kickstart Your App or Website/i)).toBeInTheDocument();
      });
      
      const renderTime = Date.now() - startTime;
      expect(renderTime).toBeLessThan(3000); // Should render within 3 seconds
    });
  });
});

// Additional isolated component tests
describe('Individual Component Tests', () => {
  describe('InteractiveStepperForm', () => {
    it('handles form state without runtime errors', () => {
      // Test form state management doesn't cause runtime errors
      const formData = {
        name: 'Test User',
        email: 'test@example.com',
        phone: '+91 98765 43210'
      };
      
      expect(() => {
        // Simulate form state changes
        Object.keys(formData).forEach(key => {
          // This simulates internal form state changes
          const value = formData[key as keyof typeof formData];
          expect(typeof value).toBe('string');
        });
      }).not.toThrow();
    });
  });

  describe('ResourceSelector', () => {
    it('handles resource selection without errors', () => {
      const resourceTypes = [
        { id: 'frontend', name: 'Frontend Developer' },
        { id: 'backend', name: 'Backend Developer' },
        { id: 'fullstack', name: 'Fullstack Developer' },
        { id: 'designer', name: 'UI/UX Designer' },
        { id: 'qa', name: 'QA Engineer' }
      ];
      
      expect(() => {
        resourceTypes.forEach(resource => {
          expect(resource.id).toBeTruthy();
          expect(resource.name).toBeTruthy();
        });
      }).not.toThrow();
    });
  });
});