import { expect, test } from '@playwright/test'

test('selects, submits, and confirms a rating', async ({ page }) => {
  await page.goto('/')
  await page.locator('label[for="rating-4"]').click()
  await page.getByRole('button', { name: 'SUBMIT' }).click()
  await expect(page.getByText('You selected 4 out of 5', { exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Thank you!' })).toBeFocused()
})
