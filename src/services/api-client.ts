/// <reference types="vite/client" />

/**
 * =========================================================
 * 🚀 DIAFAT API CLIENT - Base Configuration
 * =========================================================
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? '/api'  // Production
    : 'http://localhost:3001/api'); // Development

export const TOKEN_KEY = 'diafat_auth_token';
export const ADMIN_TOKEN_KEY = 'diafat_admin_token';

export const TokenManager = {
    get: (type: 'USER' | 'ADMIN' = 'USER'): string | null => {
        if (typeof window === 'undefined') return null;
        // Auto-detect based on path if not specified, but default to USER for backward compatibility
        if (type === 'ADMIN') return localStorage.getItem(ADMIN_TOKEN_KEY);
        return localStorage.getItem(TOKEN_KEY);
    },
    set: (token: string, type: 'USER' | 'ADMIN' = 'USER'): void => {
        if (typeof window !== 'undefined') {
            const key = type === 'ADMIN' ? ADMIN_TOKEN_KEY : TOKEN_KEY;
            localStorage.setItem(key, token);
        }
    },
    remove: (type: 'USER' | 'ADMIN' = 'USER'): void => {
        if (typeof window !== 'undefined') {
            const key = type === 'ADMIN' ? ADMIN_TOKEN_KEY : TOKEN_KEY;
            localStorage.removeItem(key);
        }
    },
    getAuthHeader: (type: 'USER' | 'ADMIN' = 'USER'): { Authorization: string } | {} => {
        const token = TokenManager.get(type);
        return token ? { Authorization: `Bearer ${token}` } : {};
    }
};

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    requiresAuth: boolean = false
): Promise<ApiResponse<T>> {
    try {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        };

        if (requiresAuth) {
            // Context-aware token injection
            // If we are on an admin page, try to use admin token first
            const isAdminPage = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
            const tokenType = isAdminPage ? 'ADMIN' : 'USER';

            // Note: This logic means Admin cannot act as User easily on admin pages without explicit override,
            // but for this app's architecture (separate dashboards), this is the desired fix for session leakage.
            const authHeader = TokenManager.getAuthHeader(tokenType);
            Object.assign(headers, authHeader);
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers,
            credentials: 'include',
            ...options,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || errorData.error || `HTTP Error: ${response.status}`);
        }

        const responseJson = await response.json();
        const unwrappedData = responseJson.data !== undefined ? responseJson.data : responseJson;

        return { success: true, data: unwrappedData };
    } catch (error) {
        console.error(`API Error [${endpoint}]:`, error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
    }
}
