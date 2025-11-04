import { test, expect } from '@playwright/test';

test.describe('Study Plan', () => {
  test('should display study blocks', async ({ page }) => {
    await page.goto('/study-plan');
    
    await expect(page.getByRole('heading', { name: 'Study Plan' })).toBeVisible();
    await expect(page.getByText('This Week')).toBeVisible();
  });

  test('should allow marking blocks as done', async ({ page }) => {
    await page.goto('/study-plan');
    
    // Find first "Mark Done" button and click it
    const markDoneButton = page.getByRole('button', { name: 'Mark Done' }).first();
    
    if (await markDoneButton.isVisible()) {
      await markDoneButton.click();
      await expect(page.getByText('done')).toBeVisible();
    }
  });
});

