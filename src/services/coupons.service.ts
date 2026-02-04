import { apiRequest, ApiResponse } from './api-client';

/**
 * ============================================
 * 🎟️ COUPONS API SERVICE
 * ============================================
 */
export const CouponsAPI = {
    getAll: async (): Promise<ApiResponse<{ coupons: any[] }>> => {
        return apiRequest('/coupons', {}, true);
    },

    create: async (couponData: { code: string; discount: number; limit: number }): Promise<ApiResponse<{ coupon: any }>> => {
        return apiRequest('/coupons', {
            method: 'POST',
            body: JSON.stringify(couponData),
        }, true);
    },

    update: async (id: string, couponData: { code?: string; discount?: number; limit?: number; isActive?: boolean }): Promise<ApiResponse<{ coupon: any }>> => {
        return apiRequest(`/coupons/${id}`, {
            method: 'PUT',
            body: JSON.stringify(couponData),
        }, true);
    },

    delete: async (id: string): Promise<ApiResponse<{ message: string }>> => {
        return apiRequest(`/coupons/${id}`, {
            method: 'DELETE',
        }, true);
    },

    verify: async (code: string, hotelId?: string): Promise<ApiResponse<{ discount: number; code: string; hotelId: string }>> => {
        return apiRequest('/coupons/verify', {
            method: 'POST',
            body: JSON.stringify({ code, hotelId }),
        });
    },
};
