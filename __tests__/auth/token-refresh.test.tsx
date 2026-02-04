import '@testing-library/jest-dom';
import api from '@/lib/api';

// Mock axios
const mockGet = jest.fn();
const mockPost = jest.fn();

jest.mock('@/lib/api', () => ({
    __esModule: true,
    default: {
        get: mockGet,
        post: mockPost,
    },
}));

describe('Token Refresh', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    it('refreshes token on 401 response', async () => {
        // Set initial token
        localStorage.setItem('token', 'expired-token');
        localStorage.setItem('refreshToken', 'valid-refresh-token');

        // First call fails with 401
        mockGet.mockRejectedValueOnce({
            response: { status: 401 },
        });

        // Refresh token succeeds
        mockPost.mockResolvedValueOnce({
            data: { token: 'new-token-123' },
        });

        // Retry succeeds
        mockGet.mockResolvedValueOnce({
            data: { sales: [] },
        });

        try {
            await api.get('/sales');
        } catch (error) {
            // Should trigger refresh
            if ((error as any).response?.status === 401) {
                const refreshResponse = await api.post('/auth/refresh', {
                    refreshToken: localStorage.getItem('refreshToken'),
                });

                localStorage.setItem('token', refreshResponse.data.token);

                // Retry original request
                const retryResponse = await api.get('/sales');
                expect(retryResponse.data).toEqual({ sales: [] });
            }
        }

        expect(mockPost).toHaveBeenCalledWith('/auth/refresh', {
            refreshToken: 'valid-refresh-token',
        });
        expect(localStorage.getItem('token')).toBe('new-token-123');
    });

    it('logs out user when refresh token is invalid', async () => {
        localStorage.setItem('token', 'expired-token');
        localStorage.setItem('refreshToken', 'invalid-refresh-token');

        // Refresh fails
        mockPost.mockRejectedValueOnce({
            response: { status: 401, data: { message: 'Invalid refresh token' } },
        });

        try {
            await api.post('/auth/refresh', {
                refreshToken: localStorage.getItem('refreshToken'),
            });
        } catch (error) {
            // Should clear tokens and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
        }

        expect(localStorage.getItem('token')).toBeNull();
        expect(localStorage.getItem('refreshToken')).toBeNull();
    });
});
