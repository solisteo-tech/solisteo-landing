import { test, expect } from '@playwright/test';

/**
 * Smoke tests for sales dashboard UI
 * These tests verify the page structure without requiring authentication
 */
test.describe('Sales Dashboard UI', () => {
    test('login page is accessible', async ({ page }) => {
        // Just verify we can access the login page
        await page.goto('/login');
        await expect(page.locator('#email')).toBeVisible();
    });

    test('protected routes redirect to login', async ({ page }) => {
        // Try to access protected route without auth
        await page.goto('/seller/sales');

        // Should redirect to login (or show login page)
        await page.waitForURL(/\/login/, { timeout: 5000 });
        expect(page.url()).toContain('/login');
    });

    test('dashboard route exists', async ({ page }) => {
        // Verify the route exists (will redirect to login)
        const response = await page.goto('/seller/dashboard');

        // Should get a response (not 404)
        expect(response?.status()).not.toBe(404);
    });
});

/**
 * Note: Full dashboard tests require:
 * 1. Authenticated session
 * 2. Test data in the database
 * 3. Backend API running
 * 
 * For now, these smoke tests verify routes exist and auth protection works.
 */
