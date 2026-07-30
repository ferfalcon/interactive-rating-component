import { expect, test, type Page } from '@playwright/test'

async function waitForFonts(page: Page): Promise<void> {
  await page.evaluate(() => document.fonts.ready)
}

test.describe('approved responsive visual states', () => {
  test('mobile rating', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await waitForFonts(page)
    await expect(page).toHaveScreenshot('rating-mobile.png', { fullPage: true })
  })

  test('desktop rating', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 800 })
    await page.goto('/')
    await waitForFonts(page)
    await expect(page).toHaveScreenshot('rating-desktop.png', { fullPage: true })
  })

  test('mobile thank-you', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await waitForFonts(page)
    await page.locator('label[for="rating-4"]').click()
    await page.getByRole('button', { name: 'SUBMIT' }).click()
    await expect(page).toHaveScreenshot('thank-you-mobile.png', { fullPage: true })
  })

  test('desktop thank-you', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 800 })
    await page.goto('/')
    await waitForFonts(page)
    await page.locator('label[for="rating-4"]').click()
    await page.getByRole('button', { name: 'SUBMIT' }).click()
    await expect(page).toHaveScreenshot('thank-you-desktop.png', { fullPage: true })
  })

  test('selected rating and hovered option', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 800 })
    await page.goto('/')
    await waitForFonts(page)
    await page.locator('label[for="rating-3"]').click()
    await page.locator('label[for="rating-4"]').hover()
    await expect(page).toHaveScreenshot('rating-selected-3-hovered-4.png', { fullPage: true })
  })

  test('validation state', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await waitForFonts(page)
    await page.getByRole('button', { name: 'SUBMIT' }).click()
    await expect(page).toHaveScreenshot('rating-validation-mobile.png', { fullPage: true })
  })
})
