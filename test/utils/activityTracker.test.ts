import { describe, it, expect, vi, beforeEach } from 'vitest';
import { trackUserActivity } from '../../client/src/lib/activityTracker';

// Mock the apiRequest function
vi.mock('../../client/src/lib/queryClient', () => ({
  apiRequest: vi.fn(),
}));

describe('Activity Tracker', () => {
  const mockApiRequest = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset the mock implementation
    const { apiRequest } = require('../../client/src/lib/queryClient');
    mockApiRequest.mockClear();
    (apiRequest as any).mockImplementation(mockApiRequest);
  });

  it('should track category browse activity', async () => {
    const activityData = {
      activityType: 'category_browse',
      categoryId: 'web-development',
      metadata: { source: 'home_page' }
    };

    await trackUserActivity(activityData);

    expect(mockApiRequest).toHaveBeenCalledWith('POST', '/api/activities', activityData);
  });

  it('should track service view activity', async () => {
    const activityData = {
      activityType: 'service_view',
      serviceId: 'custom-web-development',
      metadata: { referrer: 'category_page' }
    };

    await trackUserActivity(activityData);

    expect(mockApiRequest).toHaveBeenCalledWith('POST', '/api/activities', activityData);
  });

  it('should track service inquiry activity', async () => {
    const activityData = {
      activityType: 'service_inquiry',
      serviceId: 'mobile-app-development',
      metadata: { form_submitted: true, lead_id: 'lead-123' }
    };

    await trackUserActivity(activityData);

    expect(mockApiRequest).toHaveBeenCalledWith('POST', '/api/activities', activityData);
  });

  it('should handle API errors gracefully', async () => {
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    mockApiRequest.mockRejectedValue(new Error('API Error'));

    const activityData = {
      activityType: 'category_browse',
      categoryId: 'web-development'
    };

    // Should not throw an error
    await expect(trackUserActivity(activityData)).resolves.toBeUndefined();

    expect(consoleLogSpy).toHaveBeenCalledWith('Activity tracking failed:', expect.any(Error));
    consoleLogSpy.mockRestore();
  });

  it('should handle network errors silently', async () => {
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    mockApiRequest.mockRejectedValue(new Error('Network Error'));

    const activityData = {
      activityType: 'service_view',
      serviceId: 'ecommerce-development'
    };

    await trackUserActivity(activityData);

    expect(consoleLogSpy).toHaveBeenCalledWith('Activity tracking failed:', expect.any(Error));
    consoleLogSpy.mockRestore();
  });

  it('should work with minimal activity data', async () => {
    const activityData = {
      activityType: 'page_view'
    };

    await trackUserActivity(activityData);

    expect(mockApiRequest).toHaveBeenCalledWith('POST', '/api/activities', activityData);
  });

  it('should handle complex metadata', async () => {
    const activityData = {
      activityType: 'search',
      metadata: {
        query: 'mobile app development',
        filters: ['ios', 'android'],
        results_count: 5,
        search_time: new Date().toISOString()
      }
    };

    await trackUserActivity(activityData);

    expect(mockApiRequest).toHaveBeenCalledWith('POST', '/api/activities', activityData);
  });
});