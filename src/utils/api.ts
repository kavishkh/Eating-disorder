// Use localhost:5000 for development, can be overridden with VITE_API_URL env var
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = (): string | null => {
    return localStorage.getItem('token');
};

// Set auth token in localStorage
export const setAuthToken = (token: string): void => {
    localStorage.setItem('token', token);
};

// Remove auth token from localStorage
export const removeAuthToken = (): void => {
    localStorage.removeItem('token');
};

// API request wrapper with authentication
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const token = getAuthToken();

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    console.log(`API Request: ${options.method || 'GET'} ${API_URL}${endpoint}`);

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json().catch(() => ({ message: 'Request failed' }));

    if (!response.ok) {
        console.error('API Error Response:', data);
        // Backend returns { message: "..." }, so we use that
        const errorMessage = data.message || data.error || 'Request failed';
        throw new Error(errorMessage);
    }

    return data;
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
        console.log('Logging in user with:', { email, password: '***' });
        const data = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        if (data.token) {
            setAuthToken(data.token);
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
};

// Progress API
export const progressAPI = {
    getMetrics: async () => {
        return apiRequest('/progress');
    },
};
