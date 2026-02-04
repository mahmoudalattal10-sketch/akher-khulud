import { apiRequest, ApiResponse } from './api-client';
import { Review } from '../types';

/**
 * ============================================
 * 🌟 REVIEWS API SERVICE
 * ============================================
 */
export const ReviewsAPI = {
    getByHotelId: async (hotelId: string): Promise<ApiResponse<Review[]>> => {
        return apiRequest<Review[]>(`/hotels/${hotelId}/reviews`);
    },

    create: async (reviewData: Partial<Review>): Promise<ApiResponse<Review>> => {
        return apiRequest<Review>('/reviews', {
            method: 'POST',
            body: JSON.stringify(reviewData),
        });
    },

    delete: async (id: string): Promise<ApiResponse<{ message: string }>> => {
        return apiRequest(`/reviews/${id}`, {
            method: 'DELETE',
        }, true);
    },
};
