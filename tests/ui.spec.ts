import { expect, test } from '@playwright/test'

const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 960 },
] as const

for (const viewport of viewports) {
  test(`dashboard at ${viewport.width}px`, async ({ page }, testInfo) => {
    const runtimeErrors: string[] = []
    page.on('console', (message) => {
      if (message.type() === 'error') runtimeErrors.push(message.text())
    })
    page.on('pageerror', (error) => runtimeErrors.push(error.message))

    await page.setViewportSize({ width: viewport.width, height: viewport.height })
    await page.goto('/dashboard')
    await expect(page.getByRole('heading', { name: 'Good evening, Jordan.' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Resume lesson' })).toBeVisible()

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    expect(overflow).toBeLessThanOrEqual(1)

    await page.keyboard.press('Control+K')
    await expect(page.getByRole('searchbox')).toBeFocused()

    if (viewport.width < 1024) {
      await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible()
      await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toBeHidden()
    } else {
      await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toBeVisible()
      await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeHidden()
    }

    await page.screenshot({ path: testInfo.outputPath(`dashboard-${viewport.width}.png`), fullPage: true })
    expect(runtimeErrors).toEqual([])
  })
}

test('gallery, theme switch, and SPA routes', async ({ page }, testInfo) => {
  const runtimeErrors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text())
  })
  page.on('pageerror', (error) => runtimeErrors.push(error.message))

  await page.setViewportSize({ width: 1440, height: 960 })
  await page.goto('/components')
  await expect(page.getByRole('heading', { name: 'Artifact Learning OS components' })).toBeVisible()
  await expect(page.getByText('Dark product', { exact: true })).toBeVisible()
  await expect(page.getByText('Light product', { exact: true })).toBeVisible()
  await expect(page.getByText('Warm marketing', { exact: true })).toBeVisible()
  const modeBackgrounds = await Promise.all(
    ['Dark product', 'Light product', 'Warm marketing'].map((label) =>
      page.getByText(label, { exact: true }).locator('..').locator('..').evaluate((element) => getComputedStyle(element).backgroundColor),
    ),
  )
  expect(new Set(modeBackgrounds).size).toBe(3)

  await page.getByRole('button', { name: 'Switch to light mode' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await page.getByRole('button', { name: 'Switch to dark mode' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.screenshot({ path: testInfo.outputPath('component-gallery.png'), fullPage: true })

  await page.goto('/not-a-real-route')
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible()
  expect(runtimeErrors).toEqual([])
})
