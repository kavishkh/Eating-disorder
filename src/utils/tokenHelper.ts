import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    userId: string;
    iat: number;
    exp: number;
}

/**
 * Get the current auth token from localStorage
 */
export const getToken = (): string | null => {
    return localStorage.getItem('token');
};

/**
 * Set the auth token in localStorage
 */
export const setToken = (token: string): void => {
    localStorage.setItem('token', token);
};

/**
 * Remove the auth token from localStorage
 */
export const removeToken = (): void => {
    localStorage.removeItem('token');
};

/**
 * Decode the JWT token without verification
 */
export const decodeToken = (token: string): DecodedToken | null => {
    try {
        return jwtDecode<DecodedToken>(token);
    } catch (error) {
        console.error('Failed to decode token:', error);
        return null;
    }
};

/**
 * Check if the token is expired
 * Returns true if expired, false if still valid
 */
export const isTokenExpired = (token: string): boolean => {
    try {
        const decoded = decodeToken(token);
        if (!decoded || !decoded.exp) {
            return true;
        }

        // exp is in seconds, Date.now() is in milliseconds
        const expirationTime = decoded.exp * 1000;
        const currentTime = Date.now();

        // Add a 60 second buffer to account for clock skew
        return currentTime >= (expirationTime - 60000);
    } catch (error) {
        console.error('Error checking token expiration:', error);
        return true;
    }
};

/**
 * Get remaining time until token expires (in seconds)
 */
export const getTokenExpiresIn = (token: string): number => {
    try {
        const decoded = decodeToken(token);
        if (!decoded || !decoded.exp) {
            return 0;
        }

        const expirationTime = decoded.exp * 1000;
        const remainingMs = expirationTime - Date.now();

        return Math.max(0, Math.floor(remainingMs / 1000));
    } catch (error) {
        return 0;
    }
};

/**
 * Format remaining token time as a human-readable string
 */
export const formatTokenExpiry = (token: string): string => {
    const seconds = getTokenExpiresIn(token);

    if (seconds <= 0) {
        return 'Expired';
    }

    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) {
        return `${days}d ${hours}h remaining`;
    } else if (hours > 0) {
        return `${hours}h ${minutes}m remaining`;
    } else if (minutes > 0) {
        return `${minutes}m remaining`;
    } else {
        return `${seconds}s remaining`;
    }
};

/**
 * Debug function to log token information to console
 */
export const debugToken = (): void => {
    const token = getToken();

    if (!token) {
        console.log('🔐 Token Debug: No token found in localStorage');
        return;
    }

    console.log('🔐 Token Debug:');
    console.log('  Token (first 50 chars):', token.substring(0, 50) + '...');

    const decoded = decodeToken(token);
    if (decoded) {
        console.log('  Decoded Payload:', decoded);
        console.log('  User ID:', decoded.userId);
        console.log('  Issued At:', new Date(decoded.iat * 1000).toISOString());
        console.log('  Expires At:', new Date(decoded.exp * 1000).toISOString());
        console.log('  Is Expired:', isTokenExpired(token));
        console.log('  Time Remaining:', formatTokenExpiry(token));
    } else {
        console.log('  ❌ Failed to decode token - may be malformed');
    }
};

/**
 * Validate token before making API calls
 * Returns true if token is valid and not expired
 */
export const isTokenValid = (): boolean => {
    const token = getToken();

    if (!token) {
        console.log('No token found');
        return false;
    }

    if (isTokenExpired(token)) {
        console.log('Token is expired');
        return false;
    }

    return true;
};
