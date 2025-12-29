import { getToken, setToken, removeToken, isTokenExpired, debugToken, formatTokenExpiry } from './tokenHelper';

// Use localhost:5000 for development, can be overridden with VITE_API_URL env var
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Event for handling auth expiry across the app
type AuthExpiredCallback = () => void;
let authExpiredCallback: AuthExpiredCallback | null = null;

// Register a callback to be called when authentication expires
export const onAuthExpired = (callback: AuthExpiredCallback): void => {
    authExpiredCallback = callback;
};

// Get auth token from localStorage (using tokenHelper)
const getAuthToken = (): string | null => {
    return getToken();
};

// Set auth token in localStorage
export const setAuthToken = (token: string): void => {
    setToken(token);
};

// Remove auth token from localStorage
export const removeAuthToken = (): void => {
    removeToken();
};

// Handle authentication expired (401 errors or expired tokens)
const handleAuthExpired = (reason: string): void => {
    console.warn(`🔒 Authentication expired: ${reason}`);

    // Clear all auth data
    removeToken();
    localStorage.removeItem('cachedUser');
    localStorage.removeItem('userOnboardingComplete');

    // Trigger the callback if registered
    if (authExpiredCallback) {
        authExpiredCallback();
    }
};

// API request wrapper with authentication
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const token = getAuthToken();

    // Pre-flight check: Verify token exists and is not expired
    if (token) {
        if (isTokenExpired(token)) {
            console.warn('🔒 Token is expired, clearing auth state');
            handleAuthExpired('Token expired');
            throw new Error('Your session has expired. Please log in again.');
        }

        // Debug: Log token info for troubleshooting
        console.log(`🔐 Token status: ${formatTokenExpiry(token)}`);
    }

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    // IMPORTANT: Always attach the Bearer token if available
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log(`🔐 Authorization header attached: Bearer ${token.substring(0, 20)}...`);
    } else {
        console.warn('⚠️ No token available for authenticated request');
    }

    console.log(`📡 API Request: ${options.method || 'GET'} ${API_URL}${endpoint}`);

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
        });

        // Handle 401 Unauthorized - trigger re-authentication
        if (response.status === 401) {
            console.error('❌ 401 Unauthorized - Token may be invalid or expired');

            // Debug: Log full token info
            debugToken();

            handleAuthExpired('Server returned 401 Unauthorized');
            throw new Error('Your session has expired. Please log in again.');
        }

        const data = await response.json().catch(() => ({ message: 'Request failed' }));

        if (!response.ok) {
            console.error('❌ API Error Response:', {
                status: response.status,
                statusText: response.statusText,
                data
            });
            // Backend returns { message: "..." }, so we use that
            const errorMessage = data.message || data.error || 'Request failed';
            throw new Error(errorMessage);
        }

        return data;
    } catch (error) {
        // Re-throw with more context
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Network error occurred');
    }
};

// Auth API
export const authAPI = {
    register: async (name: string, email: string, password: string) => {
        console.log('Registering user with:', { name, email, password: '***' });
        const data = await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password }),
        });
        if (data.token) {
            setAuthToken(data.token);
        }
        return data.user;
    },

    login: async (email: string, password: string) => {
        console.log('🔐 Logging in user with:', { email, password: '***' });
        const data = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        console.log('🔐 Login response received:', {
            hasToken: !!data.token,
            hasUser: !!data.user,
            tokenPreview: data.token ? data.token.substring(0, 30) + '...' : 'NO TOKEN'
        });

        if (data.token) {
            console.log('🔐 Saving token to localStorage...');
            setAuthToken(data.token);

            // Verify token was saved
            const savedToken = localStorage.getItem('token');
            console.log('🔐 Token saved verification:', {
                saved: !!savedToken,
                matches: savedToken === data.token,
                preview: savedToken ? savedToken.substring(0, 30) + '...' : 'NOT FOUND'
            });
        } else {
            console.error('❌ No token in login response!', data);
        }

        return data;
    },

    getCurrentUser: async () => {
        return apiRequest('/auth/me');
    },

    updateProfile: async (updates: any) => {
        return apiRequest('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
    },

    logout: () => {
        removeAuthToken();
    },
};

// Mood API
export const moodAPI = {
    getAll: async () => {
        return apiRequest('/moods');
    },

    getRecent: async (days: number = 7) => {
        return apiRequest(`/moods/recent/${days}`);
    },

    hasRecordedToday: async () => {
        return apiRequest('/moods/today');
    },

    create: async (moodData: any) => {
        return apiRequest('/moods', {
            method: 'POST',
            body: JSON.stringify(moodData),
        });
    },

    update: async (id: string, updates: any) => {
        return apiRequest(`/moods/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
    },

    delete: async (id: string) => {
        return apiRequest(`/moods/${id}`, {
            method: 'DELETE',
        });
    },
};

// Goal API
export const goalAPI = {
    getAll: async () => {
        return apiRequest('/goals');
    },

    create: async (text: string) => {
        return apiRequest('/goals', {
            method: 'POST',
            body: JSON.stringify({ text }),
        });
    },

    update: async (id: string, updates: any) => {
        return apiRequest(`/goals/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
    },

    delete: async (id: string) => {
        return apiRequest(`/goals/${id}`, {
            method: 'DELETE',
        });
    },
};

// Chat API
export const chatAPI = {
    getHistory: async () => {
        return apiRequest('/chat');
    },

    saveMessage: async (content: string, isUser: boolean) => {
        return apiRequest('/chat', {
            method: 'POST',
            body: JSON.stringify({ content, isUser }),
        });
    },

    clearHistory: async () => {
        return apiRequest('/chat', {
            method: 'DELETE',
        });
    },

    getReply: async (message: string) => {
        return apiRequest('/chat/reply', {
            method: 'POST',
            body: JSON.stringify({ message }),
        });
    },
};

// Progress API
export const progressAPI = {
    getMetrics: async () => {
        return apiRequest('/progress');
    },
};

// Re-export debugToken for easy console access
export { debugToken } from './tokenHelper';
