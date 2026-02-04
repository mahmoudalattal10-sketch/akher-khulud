import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthAPI, User, TokenManager } from '../services/api';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Check login status on mount
    useEffect(() => {
        const initAuth = async () => {
            try {
                // Determine context based on URL
                const isAdminPath = window.location.pathname.startsWith('/admin');
                const tokenType = isAdminPath ? 'ADMIN' : 'USER';

                const token = TokenManager.get(tokenType);
                if (token) {
                    try {
                        const response = await AuthAPI.verify();

                        // Note: Authentication works because TokenManager.getAuthHeader() can be 
                        // context-aware or we rely on the specific endpoint checks. 
                        // For /verify endpoint, it expects ANY valid token.

                        if (response.success && response.data?.user) {
                            const profileRes = await AuthAPI.profile();
                            if (profileRes.success && profileRes.data?.user) {
                                setUser(profileRes.data.user);
                            } else {
                                setUser(response.data.user as unknown as User);
                            }
                        } else {
                            TokenManager.remove(tokenType);
                        }
                    } catch (e) {
                        console.error("Token verification failed", e);
                        TokenManager.remove(tokenType);
                    }
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = (token: string, newUser: User) => {
        // Determine token type based on User Role to ensure correct storage
        const type = (newUser.role === 'ADMIN' || newUser.role === 'SUPER_ADMIN') ? 'ADMIN' : 'USER';
        TokenManager.set(token, type);
        setUser(newUser);
    };

    const logout = async () => {
        try {
            await AuthAPI.logout();
        } catch (e) {
            console.error("Logout API failed", e);
        }

        // Remove token based on current user role
        if (user) {
            const type = (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') ? 'ADMIN' : 'USER';
            TokenManager.remove(type);
        } else {
            // Fallback: Remove based on current path
            const isAdminPath = window.location.pathname.startsWith('/admin');
            TokenManager.remove(isAdminPath ? 'ADMIN' : 'USER');
        }
        setUser(null);
    };

    const refreshUser = async () => {
        try {
            const profileRes = await AuthAPI.profile();
            if (profileRes.success && profileRes.data?.user) {
                setUser(profileRes.data.user);
            }
        } catch (e) {
            console.error("Failed to refresh user", e);
        }
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
