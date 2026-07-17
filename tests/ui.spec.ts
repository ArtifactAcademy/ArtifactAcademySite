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
  test(`learning workspace at ${viewport.name} width`, async ({ page }, testInfo) => {
    const runtimeErrors = collectRuntimeErrors(page)
    await page.setViewportSize({ width: viewport.width, height: viewport.height })

    await page.goto('/learn')
    await expect(page).toHaveURL(/\/learn\/building-your-layout$/)
    await expect(page.getByRole('heading', { level: 1, name: 'Building your layout' })).toBeVisible()
    await expect(page.getByLabel('Building your layout video')).toBeVisible()
    await expect(page.getByText('Session 4 of 8', { exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Mark complete' })).toBeVisible()
    await expectNoHorizontalOverflow(page)

    if (viewport.width < 1024) {
      await expect(page.getByRole('button', { name: 'Open lesson outline' })).toBeVisible()
      await expect(page.getByRole('navigation', { name: 'Course navigator' })).toBeHidden()
    } else {
      await expect(page.getByRole('navigation', { name: 'Course navigator' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'Open lesson outline' })).toBeHidden()
    }

    await page.screenshot({ path: testInfo.outputPath(`learning-workspace-${viewport.width}.png`), fullPage: true })
    expect(runtimeErrors).toEqual([])
  })
}

test('lesson completion unlocks the next inline artifact', async ({ page }) => {
  const runtimeErrors = collectRuntimeErrors(page)
  await page.setViewportSize({ width: 1440, height: 960 })
  await page.goto('/learn/building-your-layout')

  const nextButton = page.getByRole('button', { name: 'Next', exact: true })
  await expect(nextButton).toBeDisabled()
  await page.getByRole('button', { name: 'Mark complete' }).click()
  await expect(page.getByRole('button', { name: 'Completed' })).toBeDisabled()
  await expect(nextButton).toBeEnabled()

  await nextButton.click()
  await expect(page).toHaveURL(/\/learn\/components-artifact$/)
  await expect(page.getByRole('heading', { level: 1, name: 'Ship a landing section' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Ship a landing section', level: 2 })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Mark complete' })).toBeDisabled()

  await page.getByLabel('Live artifact URL').fill('https://example.com/landing-section')
  await page.getByLabel('Source URL').fill('https://github.com/jordan/landing-section')
  await page.getByLabel('Note for your instructor').fill('Please review the hierarchy and CTA.')
  await page.getByRole('button', { name: 'Submit artifact' }).click()
  await expect(page.getByText('Submitted for review', { exact: true })).toBeVisible()
  await expect(page.getByText('Submitted', { exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Submit artifact' })).toHaveCount(0)

  await page.getByRole('button', { name: 'Previous' }).click()
  await expect(page).toHaveURL(/\/learn\/building-your-layout$/)
  await expect(page.getByRole('heading', { level: 1, name: 'Building your layout' })).toBeVisible()
  expect(runtimeErrors).toEqual([])
})

test('direct lesson refresh and previous and next actions work', async ({ page }) => {
  const runtimeErrors = collectRuntimeErrors(page)

  await page.goto('/learn/building-your-layout')
  await page.reload()
  await expect(page.getByRole('heading', { level: 1, name: 'Building your layout' })).toBeVisible()
  await page.getByRole('button', { name: 'Previous' }).click()
  await expect(page).toHaveURL(/\/learn\/component-thinking$/)
  await page.getByRole('button', { name: 'Next', exact: true }).click()
  await expect(page).toHaveURL(/\/learn\/building-your-layout$/)

  expect(runtimeErrors).toEqual([])
})

test('locked lessons remain guarded on direct routes and in the navigator', async ({ page }) => {
  const runtimeErrors = collectRuntimeErrors(page)
  await page.setViewportSize({ width: 1440, height: 960 })
  await page.goto('/learn/defining-a-visual-direction')

  await expect(page.getByText('Locked lesson', { exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { level: 1, name: 'Defining a visual direction' })).toBeVisible()
  await expect(page.getByLabel('Defining a visual direction video')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Return to current lesson' })).toBeVisible()

  await expect(page.getByRole('button', { name: 'Lesson 1 · Defining a visual direction, locked' })).toBeDisabled()
  expect(runtimeErrors).toEqual([])
})

test('submitted, needs revision, and approved feedback states render inline', async ({ page }) => {
  const runtimeErrors = collectRuntimeErrors(page)

  await page.goto('/learn/prompt-patterns-artifact')
  await expect(page.getByText('Submitted for review', { exact: true })).toBeVisible()
  await expect(page.getByText('Submitted', { exact: true })).toBeVisible()
  await expectNoHorizontalOverflow(page)

  await page.goto('/learn/references-artifact')
  await expect(page.getByText('Changes requested', { exact: true })).toBeVisible()
  await expect(page.getByText('Needs revision', { exact: true })).toBeVisible()
  await expect(page.getByText('Instructor feedback', { exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Resubmit artifact' })).toBeVisible()
  await expectNoHorizontalOverflow(page)

  await page.goto('/learn/foundations-artifact')
  await expect(page.getByText('Artifact approved', { exact: true })).toBeVisible()
  await expect(page.getByText('Approved', { exact: true })).toBeVisible()
  await expect(page.getByText('Clear sequence and strong decision points. Approved.')).toBeVisible()
  await expectNoHorizontalOverflow(page)

  expect(runtimeErrors).toEqual([])
})

test('mobile outline and keyboard controls are operable', async ({ page }) => {
  const runtimeErrors = collectRuntimeErrors(page)
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/learn')

  const outlineButton = page.getByRole('button', { name: 'Open lesson outline' })
  await outlineButton.focus()
  await expect(outlineButton).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('dialog', { name: 'Lesson outline' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Close lesson outline' }).last()).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog', { name: 'Lesson outline' })).toHaveCount(0)

  await page.keyboard.press('Tab')
  await expect(page.locator(':focus-visible')).toHaveCount(1)
  await expectNoHorizontalOverflow(page)
  expect(runtimeErrors).toEqual([])
})

test('public entry routes remain and removed product routes return 404', async ({ page }) => {
  const runtimeErrors = collectRuntimeErrors(page)

  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Learn by shipping useful work.' })).toBeVisible()
  await page.getByRole('link', { name: 'Log in' }).click()
  await expect(page).toHaveURL(/\/login$/)
  await expect(page.getByRole('heading', { name: 'Sign in is coming next.' })).toBeVisible()

  for (const removedRoute of ['/dashboard', '/courses', '/artifacts', '/portfolio', '/certificate', '/community', '/components']) {
    await page.goto(removedRoute)
    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible()
  }

  expect(runtimeErrors).toEqual([])
})
