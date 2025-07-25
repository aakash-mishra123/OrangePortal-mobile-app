import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from '../../../client/src/pages/home';
import type { Category } from '../../../shared/schema';

// Mock wouter
vi.mock('wouter', () => ({
  Link: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock activity tracker
vi.mock('../../../client/src/lib/activityTracker', () => ({
  trackUserActivity: vi.fn(),
}));

// Mock components
vi.mock('../../../client/src/components/ui/category-card', () => ({
  default: ({ category, onClick }: any) => (
    <div data-testid={`category-${category.id}`} onClick={onClick}>
      <h3>{category.name}</h3>
      <p>{category.description}</p>
      <span>{category.serviceCount} Services</span>
    </div>
  ),
}));

vi.mock('../../../client/src/components/ui/testimonials', () => ({
  default: () => <div data-testid="testimonials">Testimonials Component</div>,
}));

describe('Home Page', () => {
  let queryClient: QueryClient;

  const mockCategories: Category[] = [
    {
      id: 'web-development',
      name: 'Web Development',
      description: 'Custom web applications',
      icon: 'fas fa-code',
      slug: 'web-development',
      serviceCount: 8,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'mobile-development',
      name: 'Mobile Development',
      description: 'iOS and Android apps',
      icon: 'fas fa-mobile-alt',
      slug: 'mobile-development',
      serviceCount: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    // Mock fetch globally
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockCategories),
    });
  });

  const renderHome = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <Home />
      </QueryClientProvider>
    );
  };

  it('should render hero section with correct content', async () => {
    renderHome();

    expect(screen.getByText(/Transform Your Business with/)).toBeInTheDocument();
    expect(screen.getByText(/Expert IT Services/)).toBeInTheDocument();
    expect(screen.getByText(/From web development to AI automation/)).toBeInTheDocument();
  });

  it('should render search bar', async () => {
    renderHome();

    const searchInput = screen.getByPlaceholderText(/Search for services/);
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('type', 'text');
  });

  it('should handle search input changes', async () => {
    renderHome();

    const searchInput = screen.getByPlaceholderText(/Search for services/);
    fireEvent.change(searchInput, { target: { value: 'web development' } });

    expect(searchInput).toHaveValue('web development');
  });

  it('should render service categories section', async () => {
    renderHome();

    expect(screen.getByText('Our Service Categories')).toBeInTheDocument();
    expect(screen.getByText(/Comprehensive digital transformation services/)).toBeInTheDocument();
  });

  it('should render category cards when data is loaded', async () => {
    renderHome();

    await waitFor(() => {
      expect(screen.getByTestId('category-web-development')).toBeInTheDocument();
      expect(screen.getByTestId('category-mobile-development')).toBeInTheDocument();
    });

    expect(screen.getByText('Web Development')).toBeInTheDocument();
    expect(screen.getByText('Mobile Development')).toBeInTheDocument();
    expect(screen.getByText('Custom web applications')).toBeInTheDocument();
    expect(screen.getByText('iOS and Android apps')).toBeInTheDocument();
  });

  it('should track category clicks', async () => {
    const { trackUserActivity } = await import('../../../client/src/lib/activityTracker');
    renderHome();

    await waitFor(() => {
      expect(screen.getByTestId('category-web-development')).toBeInTheDocument();
    });

    const categoryCard = screen.getByTestId('category-web-development');
    fireEvent.click(categoryCard);

    expect(trackUserActivity).toHaveBeenCalledWith({
      activityType: 'category_browse',
      categoryId: 'web-development',
      metadata: { source: 'home_page' },
    });
  });

  it('should render stats section', async () => {
    renderHome();

    expect(screen.getByText('Trusted by Enterprises Worldwide')).toBeInTheDocument();
    expect(screen.getByText('500+')).toBeInTheDocument();
    expect(screen.getByText('Projects Completed')).toBeInTheDocument();
    expect(screen.getByText('250+')).toBeInTheDocument();
    expect(screen.getByText('Happy Clients')).toBeInTheDocument();
  });

  it('should render CTA buttons with correct links', async () => {
    renderHome();

    const exploreServicesBtn = screen.getByText('Explore Services').closest('a');
    const scheduleConsultationBtn = screen.getByText('Schedule Consultation').closest('a');

    expect(exploreServicesBtn).toHaveAttribute('href', '#services');
    expect(scheduleConsultationBtn).toHaveAttribute('href', '/consultation');
  });

  it('should render testimonials component', async () => {
    renderHome();

    expect(screen.getByTestId('testimonials')).toBeInTheDocument();
  });

  it('should render CTA section', async () => {
    renderHome();

    expect(screen.getByText('Ready to Transform Your Business?')).toBeInTheDocument();
    expect(screen.getByText(/Let's discuss how our expert team/)).toBeInTheDocument();
    expect(screen.getByText('Schedule Free Consultation')).toBeInTheDocument();
    expect(screen.getByText('View Portfolio')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    // Mock fetch to never resolve to simulate loading
    global.fetch = vi.fn().mockImplementation(() => new Promise(() => {}));

    renderHome();

    // Should show loading skeleton
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('should have proper semantic structure', async () => {
    renderHome();

    // Check for proper semantic HTML elements
    const heroSection = screen.getByText(/Transform Your Business with/).closest('section');
    const servicesSection = screen.getByText('Our Service Categories').closest('section');
    const statsSection = screen.getByText('Trusted by Enterprises Worldwide').closest('section');

    expect(heroSection).toBeInTheDocument();
    expect(servicesSection).toBeInTheDocument();
    expect(statsSection).toBeInTheDocument();

    // Check for proper heading hierarchy
    expect(screen.getAllByRole('heading')).toHaveLength(4); // Adjust based on actual headings
  });
});