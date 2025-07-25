// Update this URL to match your backend deployment
const API_BASE_URL = 'http://localhost:5000'; // Change to your deployed backend URL

export async function apiRequest(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any
): Promise<any> {
  try {
    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for session cookies
    };

    if (data && method !== 'GET') {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    // Handle empty responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    return null;
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
}

export async function trackActivity(activityType: string, metadata?: any) {
  try {
    await apiRequest('/api/activities', 'POST', {
      activityType,
      metadata,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Activity tracking failed:', error);
    // Don't throw error for activity tracking failures
  }
}