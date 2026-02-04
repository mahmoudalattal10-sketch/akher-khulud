/**
 * =========================================================
 * 🚀 DIAFAT API BRIDGE - Transitional Layer
 * =========================================================
 * This file maintains backward compatibility while we transition
 * to modular services. Do not add new logic here.
 * =========================================================
 */

import { Room, Hotel, Review, User, Booking } from '../types';
export type { Room, Hotel, Review, User, Booking };
// Augment Hotel type for partial matches
declare module '../types' {
    interface Hotel {
        isPartial?: boolean;
        partialMatch?: boolean;
    }
}


export interface AdminStats {
    sales: number;
    activeBookings: number;
    profit: number;
    visitors: number;
    completionRate: number;
    totalBookings: number;
    confirmedCount: number;
    avgBookingValue: number;
    monthlyStats?: { name: string; value: number; users: number }[];
    destinations?: { name: string; percentage: number; color: string; icon: string }[];
}

export interface AnalyticsData {
    weekly: { name: string; visitors: number; revenue: number }[];
    hotels: { name: string; val: string; rawVal: number; color: string }[];
    visitorSources?: {
        ksa: number;
        gulf: number;
        intl: number;
        top: { name: string; pct: number };
    };
}

// Import modular services
import { TokenManager, apiRequest } from './api-client';
import { HotelsAPI } from './hotels.service';
import { RoomsAPI } from './hotels.service';
import { BookingsAPI } from './bookings.service';
import { AuthAPI } from './auth.service';
import { ReviewsAPI } from './reviews.service';
import { AdminAPI } from './admin.service';
import { CouponsAPI } from './coupons.service';
import { AiAPI } from './ai.service';

// Export everything for backward compatibility
export {
    TokenManager,
    apiRequest,
    HotelsAPI,
    RoomsAPI,
    BookingsAPI,
    AuthAPI,
    ReviewsAPI,
    AdminAPI,
    CouponsAPI,
    AiAPI
};

export default {
    Hotels: HotelsAPI,
    Rooms: RoomsAPI,
    Bookings: BookingsAPI,
    Auth: AuthAPI,
    Reviews: ReviewsAPI,
    Admin: AdminAPI,
    Coupons: CouponsAPI,
    Ai: AiAPI,
};
