import { test, expect } from '@playwright/test';

test('create project', async ({ page }) => {
  await page.goto('/projects');
  
  // Click "Add Project" (assuming the button exists or is inside Manage modal)
  // The current UI has "Manage" -> "Add Project" or similar.
  // Let's wait for the UI to be ready.
  await expect(page.getByText('Active Projects')).toBeVisible();

  // Open Manage Modal if that's where Add Project is, or finding the main CTA.
  // Based on previous file reads, there is a "Manage" button.
  await page.getByRole('button', { name: 'Manage' }).click();
  
  // In Manage Modal, Tabs default to Projects. Click "Add Project"
  await page.getByRole('button', { name: 'Add Project' }).click();

  // Fill form
  await page.getByLabel('Name').fill('Test Project E2E');
  await page.getByLabel('Description').fill('Created via Playwright');
  
  // Submit
  await page.getByRole('button', { name: 'Create' }).click();

  // Verify it appears in the list (Manage modal list or main list)
  // Close modal first? Or verify inside modal list.
  await expect(page.getByText('Test Project E2E')).toBeVisible();
});
