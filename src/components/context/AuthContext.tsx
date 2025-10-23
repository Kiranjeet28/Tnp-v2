// contexts/AuthContext.tsx
"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface UserData {
    id: string;
    email: string;
    name: string | null;
    role: string;
}

interface AuthContextType {
    user: UserData | null;
    loading: boolean;
    login: (token: string, userData: UserData) => void;
    logout: () => void;
    checkAuth: () => Promise<void>;
    isAdmin: boolean;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Check authentication on mount
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/user/login', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            } else {
                localStorage.removeItem('authToken');
                setUser(null);
            }
        } catch (err) {
            console.error('Auth check failed:', err);
            localStorage.removeItem('authToken');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = (token: string, userData: UserData) => {
        localStorage.setItem('authToken', token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setUser(null);
        router.push('/');
    };

    const isAdmin = user?.role === 'ADMIN';
    const isAuthenticated = !!user;

    const value = {
        user,
        loading,
        login,
        logout,
        checkAuth,
        isAdmin,
        isAuthenticated,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}