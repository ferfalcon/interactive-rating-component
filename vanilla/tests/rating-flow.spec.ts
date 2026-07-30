import { expect, test } from '@playwright/test'

const ratings = ['1', '2', '3', '4', '5']

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('renders the initial rating experience without a selection', async ({ page }) => {
  await expect(page.getByRole('main')).toHaveCount(1)
  await expect(page.getByRole('heading', { name: 'How did we do?' })).toBeVisible()
  await expect(page.locator('input[name="rating"]:checked')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'SUBMIT' })).toBeEnabled()
  await expect(page.locator('#rating-error')).toBeHidden()
})

test('allows exactly one rating and changing the selection', async ({ page }) => {
  for (const value of ratings) {
    await page.locator(`label[for="rating-${value}"]`).click()
    await expect(page.locator('input[name="rating"]:checked')).toHaveValue(value)
    await expect(page.locator('input[name="rating"]:checked')).toHaveCount(1)
  }
})

test('keeps checked and hover states independent', async ({ page }) => {
  await page.locator('label[for="rating-3"]').click()
  await page.locator('label[for="rating-4"]').hover()

  await expect(page.locator('#rating-3')).toBeChecked()
  await expect(page.locator('#rating-4')).not.toBeChecked()
  await expect(page.locator('label[for="rating-3"] .rating-option__surface')).toHaveCSS('background-color', 'rgb(252, 118, 20)')
  await expect(page.locator('label[for="rating-4"] .rating-option__surface')).toHaveCSS('background-color', 'rgb(255, 255, 255)')
})

test('shows validation, focuses the first radio, and recovers on selection', async ({ page }) => {
  await page.getByRole('button', { name: 'SUBMIT' }).click()

  await expect(page.locator('#rating-error')).toBeVisible()
  await expect(page.locator('#rating-error')).toHaveText('Please select a rating before submitting.')
  await expect(page.locator('input[name="rating"][aria-invalid="true"]')).toHaveCount(5)
  await expect(page.locator('#rating-1')).toBeFocused()

  await page.locator('label[for="rating-2"]').click()
  await expect(page.locator('#rating-error')).toBeHidden()
  await expect(page.locator('input[aria-invalid="true"]')).toHaveCount(0)
})

test('submits every rating value and focuses the thank-you heading', async ({ page }) => {
  for (const value of ratings) {
    await page.goto('/')
    await page.locator(`label[for="rating-${value}"]`).click()
    await page.getByRole('button', { name: 'SUBMIT' }).click()

    await expect(page.getByRole('heading', { name: 'Thank you!' })).toBeFocused()
    await expect(page.getByText(`You selected ${value} out of 5`, { exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'SUBMIT' })).toHaveCount(0)
  }
})

test('resets to the rating view after reload without storage or network submission', async ({ page }) => {
  const submissionRequests: string[] = []
  page.on('request', (request) => {
    if (request.resourceType() === 'fetch' || request.resourceType() === 'xhr') {
      submissionRequests.push(request.url())
    }
  })

  await page.locator('label[for="rating-5"]').click()
  await page.getByRole('button', { name: 'SUBMIT' }).click()
  await expect(page.getByRole('heading', { name: 'Thank you!' })).toBeFocused()
  await expect.poll(() => page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length }))).toEqual({ local: 0, session: 0 })
  expect(submissionRequests).toEqual([])

  await page.reload()
  await expect(page.getByRole('heading', { name: 'How did we do?' })).toBeVisible()
  await expect(page.locator('input[name="rating"]:checked')).toHaveCount(0)
})

test('stays within the viewport at the breakpoint and narrow widths', async ({ page }) => {
  for (const width of [320, 375, 767, 768, 1440]) {
    await page.setViewportSize({ width, height: 800 })
    await page.goto('/')

    const layout = await page.locator('.card').evaluate((card) => {
      const rect = card.getBoundingClientRect()
      return {
        cardWidth: rect.width,
        cardHeight: rect.height,
        cardRadius: getComputedStyle(card).borderTopLeftRadius,
        scrollWidth: document.documentElement.scrollWidth,
        viewportWidth: document.documentElement.clientWidth,
      }
    })

    expect(layout.scrollWidth).toBeLessThanOrEqual(layout.viewportWidth)
    expect(layout.cardWidth).toBeLessThanOrEqual(width - 48)
    expect(layout.cardHeight).toBeGreaterThan(0)
    expect(layout.cardRadius).toBe(width < 768 ? '15px' : '30px')
  }
})
