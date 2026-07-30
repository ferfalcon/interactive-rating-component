import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test.setTimeout(60_000)

test('rating view exposes semantic and accessible controls', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('main')).toHaveCount(1)
  await expect(page.getByRole('heading')).toHaveCount(1)
  await expect(page.locator('fieldset')).toHaveCount(1)
  await expect(page.locator('input[type="radio"][name="rating"]')).toHaveCount(5)
  await expect(page.locator('input[type="radio"][required]')).toHaveCount(5)
  await expect(page.getByRole('button', { name: 'SUBMIT' })).toHaveCount(1)

  for (const value of ['1', '2', '3', '4', '5']) {
    await expect(page.getByRole('radio', { name: `${value} out of 5` })).toHaveCount(1)
  }

  await expect(page.locator('img[alt=""]')).toHaveCount(1)

  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations.filter(({ impact }) => impact === 'critical' || impact === 'serious')).toEqual([])
})

test('keyboard flow and dynamic success state remain accessible', async ({ page }) => {
  await page.goto('/')

  await page.locator('#rating-1').focus()
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#rating-2')).toBeChecked()
  await page.keyboard.press('Space')
  await expect(page.locator('#rating-2')).toBeChecked()
  await page.keyboard.press('Tab')
  await page.keyboard.press('Enter')

  await expect(page.getByRole('heading', { name: 'Thank you!' })).toBeFocused()
  await expect(page.getByRole('main')).toHaveCount(1)

  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations.filter(({ impact }) => impact === 'critical' || impact === 'serious')).toEqual([])
})
