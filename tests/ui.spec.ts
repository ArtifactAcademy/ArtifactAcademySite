import { expect, test, type Page } from '@playwright/test'

const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 960 },
] as const

function collectRuntimeErrors(page: Page) {
  const runtimeErrors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text())
  })
  page.on('pageerror', (error) => runtimeErrors.push(error.message))
  return runtimeErrors
}

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(1)
}

for (const viewport of viewports) {
  test(`dashboard at ${viewport.width}px`, async ({ page }, testInfo) => {
    const runtimeErrors = collectRuntimeErrors(page)

    await page.setViewportSize({ width: viewport.width, height: viewport.height })
    await page.goto('/dashboard')
    await expect(page.getByRole('heading', { name: 'Good evening, Jordan.' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Resume lesson' })).toBeVisible()
    await expectNoHorizontalOverflow(page)

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

  test(`course overview and lesson player at ${viewport.width}px`, async ({ page }, testInfo) => {
    const runtimeErrors = collectRuntimeErrors(page)
    await page.setViewportSize({ width: viewport.width, height: viewport.height })

    await page.goto('/courses/ai-creator-bootcamp')
    await expect(page.getByRole('heading', { level: 1, name: 'AI Creator Bootcamp' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Resume current lesson' })).toBeVisible()
    await expect(page.getByText('8 instructor-led sessions', { exact: true })).toBeVisible()
    await expectNoHorizontalOverflow(page)
    await page.screenshot({ path: testInfo.outputPath(`course-overview-${viewport.width}.png`), fullPage: true })

    await page.getByRole('button', { name: 'Resume current lesson' }).click()
    await expect(page).toHaveURL(/\/courses\/ai-creator-bootcamp\/lessons\/building-with-components$/)
    await expect(page.getByRole('heading', { level: 1, name: 'Building with Components' })).toBeVisible()
    await expect(page.getByLabel('Building with Components video')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Mark complete' })).toBeVisible()
    await expectNoHorizontalOverflow(page)
    await page.screenshot({ path: testInfo.outputPath(`lesson-player-${viewport.width}.png`), fullPage: true })

    expect(runtimeErrors).toEqual([])
  })
}

test('dashboard, course card, course overview, and lesson navigation are connected', async ({ page }) => {
  const runtimeErrors = collectRuntimeErrors(page)
  await page.setViewportSize({ width: 1440, height: 960 })

  await page.goto('/dashboard')
  await page.getByRole('button', { name: 'View course overview' }).click()
  await expect(page).toHaveURL(/\/courses\/ai-creator-bootcamp$/)

  await page.goto('/dashboard')
  await page.getByRole('button', { name: 'Resume lesson' }).click()
  await expect(page).toHaveURL(/\/lessons\/building-with-components$/)

  await page.goto('/courses')
  await page.getByRole('button', { name: 'Open AI Creator Bootcamp' }).click()
  await expect(page).toHaveURL(/\/courses\/ai-creator-bootcamp$/)

  await page.getByRole('button', { name: 'Resume current lesson' }).click()
  await page.getByRole('button', { name: 'Previous lesson' }).click()
  await expect(page).toHaveURL(/\/lessons\/what-makes-a-component$/)
  await page.getByRole('button', { name: 'Next lesson' }).click()
  await expect(page).toHaveURL(/\/lessons\/building-with-components$/)

  expect(runtimeErrors).toEqual([])
})

test('direct route refreshes preserve overview and lesson pages', async ({ page }) => {
  const runtimeErrors = collectRuntimeErrors(page)

  await page.goto('/courses/ai-creator-bootcamp')
  await page.reload()
  await expect(page.getByRole('heading', { level: 1, name: 'AI Creator Bootcamp' })).toBeVisible()

  await page.goto('/courses/ai-creator-bootcamp/lessons/building-with-components')
  await page.reload()
  await expect(page.getByRole('heading', { level: 1, name: 'Building with Components' })).toBeVisible()
  await expect(page.getByText('Lesson reading', { exact: true })).toBeVisible()

  expect(runtimeErrors).toEqual([])
})

test('locked lessons cannot open and direct locked routes show the guard', async ({ page }) => {
  const runtimeErrors = collectRuntimeErrors(page)
  await page.goto('/courses/ai-creator-bootcamp')

  await page.getByRole('button', { name: /Session 5 · Data visualization/ }).click()
  const lockedLesson = page.getByRole('button', { name: 'Choosing the right view, locked' })
  await expect(lockedLesson).toBeVisible()
  await expect(lockedLesson).toBeDisabled()
  await expect(page).toHaveURL(/\/courses\/ai-creator-bootcamp$/)
  await expect(page.getByText('No resources yet. Materials are added as this session unlocks.')).toBeVisible()

  await page.goto('/courses/ai-creator-bootcamp/lessons/choosing-the-right-view')
  await expect(page.getByRole('heading', { level: 1, name: 'Choosing the right view' })).toBeVisible()
  await expect(page.getByText('Locked lesson', { exact: true })).toBeVisible()
  await expect(page.getByLabel('Choosing the right view video')).toHaveCount(0)

  expect(runtimeErrors).toEqual([])
})

test('mock completion, loading, unavailable video, and resource states render', async ({ page }) => {
  const runtimeErrors = collectRuntimeErrors(page)

  await page.goto('/courses/ai-creator-bootcamp?state=loading')
  await expect(page.getByLabel('Loading course overview')).toBeVisible()
  await expect(page.getByLabel('Loading content')).toHaveCount(3)

  await page.goto('/courses/ai-creator-bootcamp')
  await expect(page.getByText('No locked-session resources yet')).toBeVisible()
  await expect(page.getByText('Not started', { exact: true })).toBeVisible()

  await page.goto('/courses/ai-creator-bootcamp/lessons/composing-reusable-patterns')
  await expect(page.getByText('Video unavailable', { exact: true })).toBeVisible()

  await page.goto('/courses/ai-creator-bootcamp/lessons/building-with-components')
  await page.getByRole('button', { name: 'Mark complete' }).click()
  await expect(page.getByRole('button', { name: 'Completed' })).toBeDisabled()
  await expect(page.getByText('This mock completion resets when the page refreshes.')).toBeVisible()
  await page.reload()
  await expect(page.getByRole('button', { name: 'Mark complete' })).toBeVisible()

  expect(runtimeErrors).toEqual([])
})

test('gallery, theme switch, and SPA routes', async ({ page }, testInfo) => {
  const runtimeErrors = collectRuntimeErrors(page)

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
