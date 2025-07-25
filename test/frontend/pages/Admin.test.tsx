import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Admin from '../../../client/src/pages/admin';
import type { Lead, UserActivity } from '../../../shared/schema';

// Mock components
vi.mock('@/components/ui/tabs', () => ({
  Tabs: ({ children, defaultValue }: any) => (
    <div data-testid="tabs" data-default-value={defaultValue}>
      {children}
    </div>
  ),
  TabsList: ({ children }: any) => <div data-testid="tabs-list">{children}</div>,
  TabsTrigger: ({ value, children }: any) => (
    <button data-testid={`tab-trigger-${value}`}>{children}</button>
  ),
  TabsContent: ({ value, children }: any) => (
    <div data-testid={`tab-content-${value}`}>{children}</div>
  ),
}));

describe('Admin Page', () => {
  let queryClient: QueryClient;

  const mockLeads: Lead[] = [
    {
      id: 'lead-1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      serviceId: 'service-1',
      serviceName: 'Web Development',
      message: 'Need a website',
      userId: null,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: 'lead-2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1234567891',
      serviceId: 'service-2',
      serviceName: 'Mobile App',
      message: 'Need mobile app',
      userId: 'user-1',
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20'),
    },
  ];

  const mockActivities: UserActivity[] = [
    {
      id: 'activity-1',
      userId: 'user-1',
      sessionId: 'session-1',
      activityType: 'service_view',
      serviceId: 'service-1',
      categoryId: null,
      metadata: { test: true },
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0',
      createdAt: new Date('2024-01-15T10:30:00'),
      updatedAt: new Date('2024-01-15T10:30:00'),
    },
    {
      id: 'activity-2',
      userId: null,
      sessionId: 'session-2',
      activityType: 'category_browse',
      serviceId: null,
      categoryId: 'web-development',
      metadata: { source: 'home_page' },
      ipAddress: '192.168.1.2',
      userAgent: 'Chrome/91.0',
      createdAt: new Date('2024-01-16T14:20:00'),
      updatedAt: new Date('2024-01-16T14:20:00'),
    },
  ];

  const mockAnalytics = {
    totalActivities: 15,
    serviceViews: 8,
    categoryBrowses: 4,
    serviceInquiries: 3,
  };

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    // Mock fetch for different endpoints
    global.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes('/api/leads')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockLeads),
        });
      }
      if (url.includes('/api/admin/activities')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockActivities),
        });
      }
      if (url.includes('/api/admin/analytics')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockAnalytics),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      });
    });

    // Mock window.open for email links
    window.open = vi.fn();

    // Mock URL methods for CSV export
    global.URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-url');
    global.URL.revokeObjectURL = vi.fn();

    // Mock document.createElement for CSV download
    const mockAnchor = {
      href: '',
      download: '',
      click: vi.fn(),
    };
    document.createElement = vi.fn().mockReturnValue(mockAnchor);
  });

  const renderAdmin = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <Admin />
      </QueryClientProvider>
    );
  };

  it('should render admin dashboard header', async () => {
    renderAdmin();

    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Manage leads and track user activity analytics')).toBeInTheDocument();
  });

  it('should render overview stats cards', async () => {
    renderAdmin();

    await waitFor(() => {
      expect(screen.getByText('Total Leads')).toBeInTheDocument();
      expect(screen.getByText('User Activities')).toBeInTheDocument();
      expect(screen.getByText('Service Views')).toBeInTheDocument();
      expect(screen.getByText('Inquiries')).toBeInTheDocument();
    });

    // Check stats values
    expect(screen.getByText('2')).toBeInTheDocument(); // Total leads
    expect(screen.getByText('15')).toBeInTheDocument(); // Total activities
    expect(screen.getByText('8')).toBeInTheDocument(); // Service views
    expect(screen.getByText('3')).toBeInTheDocument(); // Service inquiries
  });

  it('should render tabbed interface', async () => {
    renderAdmin();

    await waitFor(() => {
      expect(screen.getByTestId('tabs')).toBeInTheDocument();
      expect(screen.getByTestId('tabs-list')).toBeInTheDocument();
      expect(screen.getByTestId('tab-trigger-leads')).toBeInTheDocument();
      expect(screen.getByTestId('tab-trigger-activities')).toBeInTheDocument();
    });

    expect(screen.getByText('Lead Management')).toBeInTheDocument();
    expect(screen.getByText('User Activities')).toBeInTheDocument();
  });

  it('should display leads in table format', async () => {
    renderAdmin();

    await waitFor(() => {
      expect(screen.getByText('Recent Leads')).toBeInTheDocument();
      expect(screen.getByText('All customer inquiries and contact form submissions')).toBeInTheDocument();
    });

    // Check lead data
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('Web Development')).toBeInTheDocument();
    expect(screen.getByText('Mobile App')).toBeInTheDocument();
  });

  it('should display user activities in table format', async () => {
    renderAdmin();

    await waitFor(() => {
      expect(screen.getByText('User Activity Tracking')).toBeInTheDocument();
      expect(screen.getByText('Monitor all user interactions and service browsing patterns')).toBeInTheDocument();
    });

    // Check activity data
    expect(screen.getByText('Registered User')).toBeInTheDocument();
    expect(screen.getByText('Guest User')).toBeInTheDocument();
    expect(screen.getByText('SERVICE VIEW')).toBeInTheDocument();
    expect(screen.getByText('CATEGORY BROWSE')).toBeInTheDocument();
  });

  it('should handle CSV export functionality', async () => {
    renderAdmin();

    await waitFor(() => {
      expect(screen.getByText('Export CSV')).toBeInTheDocument();
    });

    const exportButton = screen.getByText('Export CSV');
    fireEvent.click(exportButton);

    expect(global.URL.createObjectURL).toHaveBeenCalled();
    expect(document.createElement).toHaveBeenCalledWith('a');
  });

  it('should handle email reply functionality', async () => {
    renderAdmin();

    await waitFor(() => {
      const replyButtons = screen.getAllByText('Reply');
      expect(replyButtons.length).toBeGreaterThan(0);
    });

    const replyButton = screen.getAllByText('Reply')[0];
    fireEvent.click(replyButton);

    expect(window.open).toHaveBeenCalledWith('mailto:john@example.com');
  });

  it('should show loading state initially', () => {
    // Mock fetch to never resolve
    global.fetch = vi.fn().mockImplementation(() => new Promise(() => {}));

    renderAdmin();

    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('should handle empty leads state', async () => {
    // Mock empty leads response
    global.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes('/api/leads')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockAnalytics),
      });
    });

    renderAdmin();

    await waitFor(() => {
      expect(screen.getByText('No leads found. Customer inquiries will appear here.')).toBeInTheDocument();
    });
  });

  it('should handle empty activities state', async () => {
    // Mock empty activities response
    global.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes('/api/admin/activities')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockLeads),
      });
    });

    renderAdmin();

    await waitFor(() => {
      expect(screen.getByText('No user activities recorded yet. User interactions will appear here.')).toBeInTheDocument();
    });
  });

  it('should display formatted dates correctly', async () => {
    renderAdmin();

    await waitFor(() => {
      // Should show formatted dates
      expect(screen.getByText('Jan 15, 2024')).toBeInTheDocument();
      expect(screen.getByText('Jan 20, 2024')).toBeInTheDocument();
      expect(screen.getByText('Jan 15, 10:30')).toBeInTheDocument();
      expect(screen.getByText('Jan 16, 14:20')).toBeInTheDocument();
    });
  });

  it('should disable export button when no leads', async () => {
    // Mock empty leads
    global.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes('/api/leads')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockAnalytics),
      });
    });

    renderAdmin();

    await waitFor(() => {
      const exportButton = screen.getByText('Export CSV');
      expect(exportButton).toBeDisabled();
    });
  });
});