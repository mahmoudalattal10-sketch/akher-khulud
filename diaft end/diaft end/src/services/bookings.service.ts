import { apiRequest, ApiResponse } from './api-client';
import { Booking } from '../types';

/**
 * ============================================
 * 📅 BOOKINGS API SERVICE
 * ============================================
 */
export const BookingsAPI = {
    getAll: async (): Promise<ApiResponse<Booking[]>> => {
        return apiRequest<Booking[]>('/bookings', {}, true);
    },

    getMyBookings: async (): Promise<ApiResponse<Booking[]>> => {
        return apiRequest<Booking[]>('/bookings/me', {}, true);
    },

    getById: async (id: string): Promise<ApiResponse<Booking>> => {
        return apiRequest<Booking>(`/bookings/${id}`, {}, true);
    },

    create: async (bookingData: {
        roomId: string;
        checkIn: string;
        checkOut: string;
        guestsCount: number;
        roomCount?: number;
        guestName?: string;
        guestEmail?: string;
        guestPhone?: string;
        nationality?: string;
        extraBedCount?: number;
        specialRequests?: string;
        promoCode?: string;
    }): Promise<ApiResponse<Booking>> => {
        return apiRequest<Booking>('/bookings', {
            method: 'POST',
            body: JSON.stringify(bookingData),
        }, true);
    },

    updateStatus: async (
        id: string,
        status: Booking['status']
    ): Promise<ApiResponse<Booking>> => {
        return apiRequest<Booking>(`/bookings/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        }, true);
    },

    cancel: async (id: string): Promise<ApiResponse<Booking>> => {
        return apiRequest<Booking>(`/bookings/${id}/cancel`, {
            method: 'POST',
        }, true);
    },
};
