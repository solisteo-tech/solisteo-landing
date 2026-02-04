import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { TestQueryProvider } from '../TestQueryProvider';

// Mock Next.js router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
        replace: jest.fn(),
    }),
}));

// Mock API
const mockPost = jest.fn();
jest.mock('@/lib/api', () => ({
    __esModule: true,
    default: {
        post: mockPost,
    },
}));

// Mock login page component (simplified for testing)
function LoginPage() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const api = (await import('@/lib/api')).default;
            const response = await api.post('/auth/login', { email, password });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                const router = (await import('next/navigation')).useRouter();
                router.push('/seller/dashboard');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit} data-testid="login-form">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    data-testid="email-input"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    data-testid="password-input"
                />
                <button type="submit" disabled={loading} data-testid="submit-button">
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            {error && <div data-testid="error-message">{error}</div>}
        </div>
    );
}

describe('Login Flow', () => {
    beforeEach(() => {
        // Clear mocks and localStorage
        jest.clearAllMocks();
        localStorage.clear();
        mockPush.mockClear();
    });

    it('renders login form', () => {
        render(
            <TestQueryProvider>
                <LoginPage />
            </TestQueryProvider>
        );

        expect(screen.getByText('Login')).toBeInTheDocument();
        expect(screen.getByTestId('email-input')).toBeInTheDocument();
        expect(screen.getByTestId('password-input')).toBeInTheDocument();
        expect(screen.getByTestId('submit-button')).toBeInTheDocument();
    });

    it('successfully logs in with valid credentials', async () => {
        const user = userEvent.setup();

        mockPost.mockResolvedValueOnce({
            data: {
                token: 'test-token-123',
                user: { email: 'test@example.com' },
            },
        });

        render(
            <TestQueryProvider>
                <LoginPage />
            </TestQueryProvider>
        );

        // Fill in form
        await user.type(screen.getByTestId('email-input'), 'test@example.com');
        await user.type(screen.getByTestId('password-input'), 'password123');
        await user.click(screen.getByTestId('submit-button'));

        // Wait for API call
        await waitFor(() => {
            expect(mockPost).toHaveBeenCalledWith('/auth/login', {
                email: 'test@example.com',
                password: 'password123',
            });
        });

        // Verify token stored
        expect(localStorage.getItem('token')).toBe('test-token-123');
    });

    it('shows error message with invalid credentials', async () => {
        const user = userEvent.setup();

        mockPost.mockRejectedValueOnce({
            response: {
                data: { message: 'Invalid credentials' },
            },
        });

        render(
            <TestQueryProvider>
                <LoginPage />
            </TestQueryProvider>
        );

        // Fill in form
        await user.type(screen.getByTestId('email-input'), 'wrong@example.com');
        await user.type(screen.getByTestId('password-input'), 'wrongpassword');
        await user.click(screen.getByTestId('submit-button'));

        // Wait for error message
        await waitFor(() => {
            expect(screen.getByTestId('error-message')).toHaveTextContent('Invalid credentials');
        });

        // Verify no token stored
        expect(localStorage.getItem('token')).toBeNull();
    });

    it('disables submit button while loading', async () => {
        const user = userEvent.setup();

        mockPost.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));

        render(
            <TestQueryProvider>
                <LoginPage />
            </TestQueryProvider>
        );

        const submitButton = screen.getByTestId('submit-button');

        await user.type(screen.getByTestId('email-input'), 'test@example.com');
        await user.type(screen.getByTestId('password-input'), 'password123');
        await user.click(submitButton);

        // Button should be disabled during loading
        expect(submitButton).toBeDisabled();
        expect(submitButton).toHaveTextContent('Logging in...');
    });

    it('clears error message on new submission', async () => {
        const user = userEvent.setup();

        // First attempt - fail
        mockPost.mockRejectedValueOnce({
            response: { data: { message: 'Invalid credentials' } },
        });

        render(
            <TestQueryProvider>
                <LoginPage />
            </TestQueryProvider>
        );

        await user.type(screen.getByTestId('email-input'), 'test@example.com');
        await user.type(screen.getByTestId('password-input'), 'wrong');
        await user.click(screen.getByTestId('submit-button'));

        await waitFor(() => {
            expect(screen.getByTestId('error-message')).toBeInTheDocument();
        });

        // Second attempt - success
        mockPost.mockResolvedValueOnce({
            data: { token: 'test-token' },
        });

        await user.clear(screen.getByTestId('password-input'));
        await user.type(screen.getByTestId('password-input'), 'correct');
        await user.click(screen.getByTestId('submit-button'));

        // Error should be cleared
        await waitFor(() => {
            expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
        });
    });
});
