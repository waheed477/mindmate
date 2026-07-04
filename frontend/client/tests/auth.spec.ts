import { test, expect } from '@playwright/test';

test.describe('MindMate Authentication Flow E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Go to login page
    await page.goto('/login');
  });

  test('should render Google OAuth and Magic Link UI elements', async ({ page }) => {
    // Verify Google sign-in button is present
    const googleBtn = page.getByTestId('button-google-login');
    await expect(googleBtn).toBeVisible();
    await expect(googleBtn).toContainText('Sign in with Google');

    // Click magic link toggle and check email field
    const magicToggleBtn = page.locator('text=Sign in with a Magic Link');
    await expect(magicToggleBtn).toBeVisible();
    await magicToggleBtn.click();

    // Verify magic email input is visible
    const magicEmailInput = page.getByTestId('input-magic-email');
    await expect(magicEmailInput).toBeVisible();
    
    const sendMagicBtn = page.getByTestId('button-send-magic-link');
    await expect(sendMagicBtn).toBeVisible();
  });

  test('should allow regular login and redirect to dashboard', async ({ page }) => {
    // Fill in credentials for patient
    await page.getByTestId('input-email').fill('patient@example.com');
    await page.getByTestId('input-password').fill('password123');
    
    // Click submit
    await page.getByTestId('button-login').click();

    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('should support password reset navigation', async ({ page }) => {
    // Click forgot password link
    await page.click('text=Reset it here');
    await expect(page).toHaveURL(/\/forgot-password/);

    // Enter email and request link
    await page.getByTestId('input-email').fill('forgot@example.com');
    await page.getByTestId('button-send-reset').click();

    // Confirm success message is visible
    await expect(page.locator('text=Check your email')).toBeVisible();
  });
});
