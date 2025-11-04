import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test('should load and display seed data', async ({ page }) => {
    await page.goto('/');
    
    // Check title
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    
    // Check AI input card
    await expect(page.getByText('Ask UNI-Agent')).toBeVisible();
    
    // Check for seed course data
    await expect(page.getByText('CS101')).toBeVisible();
  });

  test('should allow AI ask interaction', async ({ page }) => {
    await page.goto('/');
    
    // Type in AI input
    const textarea = page.getByPlaceholder(/Explain Big-O/);
    await textarea.fill('Explain Big-O notation');
    
    // Click ask button
    await page.getByRole('button', { name: /Ask/i }).click();
    
    // Wait for response (with generous timeout for demo)
    await expect(page.getByText(/responded/i)).toBeVisible({ timeout: 10000 });
  });
});

