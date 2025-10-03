import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should display the main title and navigation', async ({ page }) => {
    await page.goto('/');

    // Check if the main title is visible
    await expect(page.getByText('Journey of Us')).toBeVisible();
    
    // Check if the subtitle is visible
    await expect(page.getByText('✨ Create Magical Moments Together ✨')).toBeVisible();
  });

  test('should have create game buttons', async ({ page }) => {
    await page.goto('/');

    // Check if create buttons are visible
    await expect(page.getByText('Create from Scratch')).toBeVisible();
    await expect(page.getByText('Use Starter Pack')).toBeVisible();
  });

  test('should have play section with love code input', async ({ page }) => {
    await page.goto('/');

    // Check if play section is visible
    await expect(page.getByText('Join a Journey')).toBeVisible();
    await expect(page.getByPlaceholder('Enter love code...')).toBeVisible();
    await expect(page.getByText('Play')).toBeVisible();
  });

  test('should navigate to editor when creating new game', async ({ page }) => {
    await page.goto('/');

    // Click create from scratch button
    await page.getByText('Create from Scratch').click();

    // Should navigate to editor page
    await expect(page).toHaveURL(/\/editor\/[a-zA-Z0-9]+/);
  });

  test('should auto-open editor when using starter pack', async ({ page }) => {
    await page.goto('/');

    // Click use starter pack button
    await page.getByText('Use Starter Pack').click();

    // Should show loading state
    await expect(page.getByText('Creating...')).toBeVisible();

    // Should navigate to editor page automatically
    await expect(page).toHaveURL(/\/editor\/[a-zA-Z0-9]+/);
    
    // Should show the editor interface
    await expect(page.getByText('Journey Editor')).toBeVisible();
  });
});

test.describe('Mobile Experience', () => {
  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check if main elements are still visible on mobile
    await expect(page.getByText('Journey of Us')).toBeVisible();
    await expect(page.getByText('Create from Scratch')).toBeVisible();
  });
});
