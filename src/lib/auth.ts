export function setAuthToken(token: string) {
    // Store in localStorage for client-side access
    localStorage.setItem('authToken', token);

    // Store in cookies for middleware access
    document.cookie = `authToken=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict`;
}

// Remove auth token from both localStorage and cookies
export function removeAuthToken() {
    localStorage.removeItem('authToken');
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
}

// Get auth token from localStorage
export function getAuthToken(): string | null {
    return localStorage.getItem('authToken');
}

// Check if user is authenticated
export async function checkAuth(): Promise<{ user: any; isAuthenticated: boolean }> {
    const token = getAuthToken();

    if (!token) {
        return { user: null, isAuthenticated: false };
    }

    try {
        const response = await fetch('/api/auth', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            return { user: data.user, isAuthenticated: true };
        } else {
            removeAuthToken();
            return { user: null, isAuthenticated: false };
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        removeAuthToken();
        return { user: null, isAuthenticated: false };
    }
}
