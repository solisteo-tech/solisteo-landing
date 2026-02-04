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
    }),
}));

// Mock logout component
function LogoutButton() {
    const handleLogout = async () => {
        // Clear token
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Redirect to login
        const router = (await import('next/navigation')).useRouter();
        router.push('/login');
    };

    return (
        <button onClick={handleLogout} data-testid="logout-button">
            Logout
        </button>
    );
}

describe('Logout Flow', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
        mockPush.mockClear();
    });

    it('clears token from localStorage on logout', async () => {
        const user = userEvent.setup();

        // Set initial token
        localStorage.setItem('token', 'test-token-123');
        localStorage.setItem('user', JSON.stringify({ email: 'test@example.com' }));

        render(
            <TestQueryProvider>
                <LogoutButton />
            </TestQueryProvider>
        );

        await user.click(screen.getByTestId('logout-button'));

        await waitFor(() => {
            expect(localStorage.getItem('token')).toBeNull();
            expect(localStorage.getItem('user')).toBeNull();
        });
    });

    it('redirects to login page after logout', async () => {
        const user = userEvent.setup();

        localStorage.setItem('token', 'test-token-123');

        render(
            <TestQueryProvider>
                <LogoutButton />
            </TestQueryProvider>
        );

        await user.click(screen.getByTestId('logout-button'));

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/login');
        });
    });
});
