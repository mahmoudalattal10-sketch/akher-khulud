import { apiRequest, ApiResponse } from './api-client';
import { AdminStats, AnalyticsData } from './api';

/**
 * ============================================
 * 📊 ADMIN API SERVICE
 * ============================================
 */
export const AdminAPI = {
    getStats: async (): Promise<ApiResponse<AdminStats>> => {
        return apiRequest<AdminStats>('/admin/stats', {}, true);
    },

    getAnalytics: async (): Promise<ApiResponse<AnalyticsData>> => {
        return apiRequest<AnalyticsData>('/admin/analytics', {}, true);
    },

    /**
     * Get system notifications for admin
     */
    getNotifications: async (): Promise<ApiResponse<{ notifications: any[] }>> => {
        return apiRequest('/admin/notifications', {}, true);
    },

    /**
     * Mark a specific notification as read
     */
    markNotificationAsRead: async (id: string): Promise<ApiResponse<{ success: boolean }>> => {
        return apiRequest(`/admin/notifications/${id}/read`, {
            method: 'PUT',
        }, true);
    },

    /**
     * Get contact messages for admin
     */
    getMessages: async (): Promise<ApiResponse<{ messages: any[] }>> => {
        return apiRequest('/admin/messages', {}, true);
    },

    /**
     * Get unread messages count
     */
    getUnreadMessagesCount: async (): Promise<ApiResponse<{ count: number }>> => {
        return apiRequest('/admin/messages/unread-count', {}, true);
    },

    /**
     * Mark a contact message as read
     */
    markMessageAsRead: async (id: string): Promise<ApiResponse<any>> => {
        return apiRequest(`/admin/messages/${id}/read`, {
            method: 'PUT',
        }, true);
    },

    /**
     * Update admin email or password
     */
    updateCredentials: async (data: {
        currentPassword: string,
        newEmail?: string,
        newPassword?: string
    }): Promise<ApiResponse<{ success: boolean }>> => {
        return apiRequest('/admin/update-credentials', {
            method: 'POST',
            body: JSON.stringify(data),
        }, true);
    },

    /**
     * Get Umrah & Visitors registry (Pilgrims)
     */
    getPilgrims: async (): Promise<ApiResponse<any[]>> => {
        return apiRequest<any[]>('/admin/pilgrims', {}, true);
    },
};
