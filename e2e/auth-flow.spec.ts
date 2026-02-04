import { test, expect } from '@playwright/test';

/**
 * Smoke tests for authentication UI
 * These tests verify the UI renders correctly without requiring actual authentication
 */
test.describe('Authentication UI', () => {
    test('login page renders correctly', async ({ page }) => {
        await page.goto('/login');

        // Verify login form elements are present
        await expect(page.locator('#email')).toBeVisible();
        await expect(page.locator('#password')).toBeVisible();
        await expect(page.locator('button[type="submit"]')).toBeVisible();

        // Verify page title/branding
        await expect(page.locator('img[alt="SOLISTEO"]')).toBeVisible();
    });

    test('login form has proper input types', async ({ page }) => {
        await page.goto('/login');

        // Email input should be type="email"
        const emailInput = page.locator('#email');
        await expect(emailInput).toHaveAttribute('type', 'email');

        // Password input should be type="password"
        const passwordInput = page.locator('#password');
        await expect(passwordInput).toHaveAttribute('type', 'password');
    });

    test('login form validates required fields', async ({ page }) => {
        await page.goto('/login');

        // Both fields should be required
        await expect(page.locator('#email')).toHaveAttribute('required');
        await expect(page.locator('#password')).toHaveAttribute('required');
    });

    test('login button is enabled when form is empty', async ({ page }) => {
        await page.goto('/login');

        const submitButton = page.locator('button[type="submit"]');

        // Button should be visible and not disabled initially
        await expect(submitButton).toBeVisible();
        await expect(submitButton).not.toBeDisabled();
    });
});

/**
 * Note: Full authentication flow tests require:
 * 1. Test user credentials in the database
 * 2. Backend server running
 * 3. Or API mocking with Playwright
 * 
 * For now, these smoke tests verify the UI works correctly.
 */
