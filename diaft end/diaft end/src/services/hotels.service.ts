import { apiRequest, ApiResponse } from './api-client';
import { Hotel, Room } from '../types';

/**
 * ============================================
 * 🏨 HOTELS API SERVICE
 * ============================================
 */
export const HotelsAPI = {
    getAll: async (params?: { city?: string; checkIn?: string; checkOut?: string; guests?: number; adminView?: boolean }): Promise<ApiResponse<Hotel[]>> => {
        const cleanParams = Object.fromEntries(
            Object.entries(params || {}).filter(([_, v]) => v != null)
        );
        const query = new URLSearchParams(cleanParams as any).toString();
        return apiRequest<Hotel[]>(`/hotels?${query}`, {}, true);
    },

    getBySlug: async (slug: string, params?: { checkIn?: string; checkOut?: string; guests?: number }): Promise<ApiResponse<Hotel>> => {
        const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
        return apiRequest<Hotel>(`/hotels/${slug}${query}`);
    },

    getById: async (id: string, params?: { checkIn?: string; checkOut?: string; guests?: number }): Promise<ApiResponse<Hotel>> => {
        const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
        return apiRequest<Hotel>(`/hotels/id/${id}${query}`);
    },

    getByIds: async (ids: string[]): Promise<ApiResponse<Hotel[]>> => {
        if (ids.length === 0) return { success: true, data: [] };
        return apiRequest<Hotel[]>(`/hotels/list?ids=${ids.join(',')}`);
    },

    create: async (hotelData: Partial<Hotel>): Promise<ApiResponse<Hotel>> => {
        return apiRequest<Hotel>('/hotels', {
            method: 'POST',
            body: JSON.stringify(hotelData),
        }, true);
    },

    update: async (id: string, hotelData: Partial<Hotel>): Promise<ApiResponse<Hotel>> => {
        return apiRequest<Hotel>(`/hotels/${id}`, {
            method: 'PUT',
            body: JSON.stringify(hotelData),
        }, true);
    },

    delete: async (id: string): Promise<ApiResponse<{ message: string }>> => {
        return apiRequest(`/hotels/${id}`, {
            method: 'DELETE',
        }, true);
    },

    toggleVisibility: async (id: string): Promise<ApiResponse<Hotel>> => {
        return apiRequest<Hotel>(`/hotels/${id}/visibility`, {
            method: 'PATCH',
        }, true);
    },

    getFeatured: async (): Promise<ApiResponse<Hotel[]>> => {
        return apiRequest<Hotel[]>('/hotels/featured');
    },

    toggleFeatured: async (id: string): Promise<ApiResponse<Hotel>> => {
        return apiRequest<Hotel>(`/hotels/${id}/featured`, {
            method: 'PATCH',
        }, true);
    },
};

/**
 * ============================================
 * 🛏️ ROOMS API SERVICE
 * ============================================
 */
export const RoomsAPI = {
    create: async (hotelId: string, roomData: Partial<Room>): Promise<ApiResponse<Room>> => {
        return apiRequest<Room>(`/hotels/${hotelId}/rooms`, {
            method: 'POST',
            body: JSON.stringify(roomData),
        }, true);
    },

    update: async (roomId: string, roomData: Partial<Room>): Promise<ApiResponse<Room>> => {
        return apiRequest<Room>(`/rooms/${roomId}`, {
            method: 'PUT',
            body: JSON.stringify(roomData),
        }, true);
    },

    delete: async (roomId: string): Promise<ApiResponse<{ message: string }>> => {
        return apiRequest(`/rooms/${roomId}`, {
            method: 'DELETE',
        }, true);
    },
};
