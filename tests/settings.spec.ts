import { test, expect } from '@playwright/test';

test.describe('Settings', () => {
  test('should display settings page', async ({ page }) => {
    await page.goto('/settings');
    
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
    await expect(page.getByText('Profile')).toBeVisible();
    await expect(page.getByText('Data Management')).toBeVisible();
  });

  test('should have export button', async ({ page }) => {
    await page.goto('/settings');
    
    await expect(page.getByRole('button', { name: /Export JSON/i })).toBeVisible();
  });
});

