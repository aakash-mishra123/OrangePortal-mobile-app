import { apiRequest } from "./queryClient";

interface ActivityData {
  activityType: string;
  serviceId?: string;
  categoryId?: string;
  metadata?: any;
}

export const trackUserActivity = async (activityData: ActivityData) => {
  try {
    await apiRequest('/api/activities', {
      method: 'POST',
      body: JSON.stringify(activityData),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    // Silently fail activity tracking - don't disrupt user experience
    console.log('Activity tracking failed:', error);
  }
};