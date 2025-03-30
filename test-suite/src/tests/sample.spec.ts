import { test, expect } from '@playwright/test';

test.describe('Basic Site Navigation', () => {
  test('should navigate to login page', async ({ page }) => {
    // Navigate to the website
    await page.goto('/');
    
    // Verify we are on the login page
    expect(page.url()).toContain('/login');
    
    // Verify login form exists
    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show error with invalid login', async ({ page }) => {
    // Navigate to the login page
    await page.goto('/login');
    
    // Fill the form with invalid credentials
    await page.fill('#username', 'wrong@example.com');
    await page.fill('#password', 'wrong_password');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Verify error message is displayed
    await expect(page.locator('.error-message')).toBeVisible();
    await expect(page.locator('.error-message')).toContainText('Invalid username or password');
  });

  test('should login with valid credentials', async ({ page }) => {
    // Navigate to the login page
    await page.goto('/login');
    
    // Fill the form with valid credentials
    await page.fill('#username', 'customer@example.com');
    await page.fill('#password', 'customer_password');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Verify redirect to dashboard
    await page.waitForURL('**/dashboard');
    
    // Verify dashboard elements
    await expect(page.locator('.welcome-message')).toBeVisible();
    await expect(page.locator('.dashboard-stats')).toBeVisible();
  });
});
