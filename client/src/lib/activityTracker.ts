import { apiRequest } from "./queryClient";

interface ActivityData {
  activityType: string;
  serviceId?: string;
  categoryId?: string;
  metadata?: any;
}

export const trackUserActivity = async (activityData: ActivityData) => {
  try {
    await apiRequest('POST', '/api/activities', activityData);
  } catch (error) {
    // Silently fail activity tracking - don't disrupt user experience
    console.log('Activity tracking failed:', error);
  }
};