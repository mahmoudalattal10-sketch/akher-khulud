import { apiRequest, ApiResponse, TokenManager } from './api-client';
import { User, Booking } from '../types';

/**
 * ============================================
 * 🔐 AUTH API SERVICE
 * ============================================
 */
export const AuthAPI = {
    login: async (email: string, password: string, type: 'USER' | 'ADMIN' = 'USER'): Promise<ApiResponse<{ token: string; user: User }>> => {
        const response = await apiRequest<{ token: string; user: User }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        if (response.success && response.data?.token) {
            TokenManager.set(response.data.token, type);
        }

        return response;
    },

    register: async (userData: {
        email: string;
        password: string;
        name: string;
        phone?: string;
        country?: string;
    }, type: 'USER' | 'ADMIN' = 'USER'): Promise<ApiResponse<{ token: string; user: User }>> => {
        const response = await apiRequest<{ token: string; user: User }>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });

        if (response.success && response.data?.token) {
            TokenManager.set(response.data.token, type);
        }

        return response;
    },

    socialLogin: async (provider: 'google' | 'facebook', token: string, type: 'USER' | 'ADMIN' = 'USER'): Promise<ApiResponse<{ token: string; user: User }>> => {
        const endpoint = provider === 'google' ? '/auth/google' : '/auth/facebook';
        const body = provider === 'google' ? { token } : { accessToken: token };

        const response = await apiRequest<{ token: string; user: User }>(endpoint, {
            method: 'POST',
            body: JSON.stringify(body)
        });
        if (response.success && response.data) {
            TokenManager.set(response.data.token, type);
        }
        return response;
    },

    profile: async (): Promise<ApiResponse<{ user: User & { bookings: Booking[] } }>> => {
        return apiRequest('/auth/profile', {}, true);
    },

    verify: async (): Promise<ApiResponse<{ valid: boolean; user: { userId: string; email: string; role: string } }>> => {
        return apiRequest('/auth/verify', {}, true);
    },

    logout: async (): Promise<void> => {
        try {
            await apiRequest('/auth/logout', { method: 'POST' });
        } catch (e) {
            console.error('Server logout failed', e);
        }
        // Remove token based on current context
        const isAdminPath = window.location.pathname.startsWith('/admin');
        const tokenType = isAdminPath ? 'ADMIN' : 'USER';
        TokenManager.remove(tokenType);

        window.location.href = isAdminPath ? '/admin/login' : '/';
    },

    isLoggedIn: (): boolean => {
        return !!TokenManager.get();
    },

    getUsers: async (): Promise<ApiResponse<{ users: User[] }>> => {
        return apiRequest('/auth/users', {}, true);
    },

    checkEmail: async (email: string): Promise<ApiResponse<{ exists: boolean; email: string }>> => {
        return apiRequest('/auth/check-email', {
            method: 'POST',
            body: JSON.stringify({ email })
        });
    }
};
