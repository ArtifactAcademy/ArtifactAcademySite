import { expect, test, type Page } from '@playwright/test'

const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 960 },
] as const

const recommendedCards = [
  'System instruction',
  'User goal',
  'Useful reference',
  'Output format',
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

async function addRecommendedCards(page: Page) {
  for (const card of recommendedCards) {
    await page.getByRole('button', { name: `Add ${card} to context` }).click()
  }
}

for (const viewport of viewports) {
  test(`interactive lesson at ${viewport.name} width`, async ({ page }, testInfo) => {
    const runtimeErrors = collectRuntimeErrors(page)
    await page.setViewportSize({ width: viewport.width, height: viewport.height })

    await page.goto('/learn')
    await expect(page).toHaveURL(/\/learn\/context-window-packing$/)
    await expect(page.getByRole('heading', { level: 1, name: 'Packing a useful context window' })).toBeVisible()
    await expect(page.getByRole('heading', { level: 2, name: 'Context Window Packing Lab' })).toBeVisible()
    await expect(page.getByText('Session 1 of 8', { exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Mark complete' })).toBeDisabled()
    await expectNoHorizontalOverflow(page)

    if (viewport.width < 1024) {
      await expect(page.getByRole('button', { name: 'Open lesson outline' })).toBeVisible()
      await expect(page.getByRole('navigation', { name: 'Course navigator' })).toBeHidden()
    } else {
      await expect(page.getByRole('navigation', { name: 'Course navigator' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'Open lesson outline' })).toBeHidden()
    }

    await page.screenshot({ path: testInfo.outputPath(`interactive-lesson-${viewport.width}.png`), fullPage: true })
    expect(runtimeErrors).toEqual([])
  })
}

test('typed lesson blocks render from course content', async ({ page }) => {
  const runtimeErrors = collectRuntimeErrors(page)
  await page.goto('/learn/context-window-packing')

  await expect(page.getByLabel('Packing a useful context window video')).toBeVisible()
  await expect(page.getByText('LEARNING OBJECTIVES', { exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Choose context deliberately' })).toBeVisible()
  await expect(page.getByText('Treat context like a limited working surface.', { exact: false })).toBeVisible()
  await expect(page.getByText('Context audit prompt', { exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Resources' })).toBeVisible()
  await expect(page.getByText('Context packing worksheet', { exact: true })).toBeVisible()
  await expect(page.getByText('INSTRUCTOR NOTE', { exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Context Window Packing Lab' })).toBeVisible()

  await page.goto('/learn/how-context-shapes-an-output')
  await expect(page.getByText('Comprehension check', { exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Which addition most directly improves an underspecified request?' })).toBeVisible()
  await expectNoHorizontalOverflow(page)
  expect(runtimeErrors).toEqual([])
})

test('mouse drag, reset, answer feedback, and lab completion are deterministic', async ({ page }) => {
  const runtimeErrors = collectRuntimeErrors(page)
  await page.setViewportSize({ width: 1440, height: 960 })
  await page.goto('/learn/context-window-packing')

  await page.getByTestId('context-card-system-instruction').dragTo(page.getByTestId('context-window'))
  await expect(page.getByRole('button', { name: 'Remove System instruction from context' })).toBeVisible()
  await expect(page.getByRole('progressbar', { name: 'Context capacity: 2 of 8 units used' })).toBeVisible()

  await page.getByRole('button', { name: 'Reset' }).click()
  await expect(page.getByRole('button', { name: 'Add System instruction to context' })).toBeVisible()
  await expect(page.getByRole('progressbar', { name: 'Context capacity: 0 of 8 units used' })).toBeVisible()

  await page.getByRole('button', { name: 'Add Conflicting instruction to context' }).click()
  await page.getByRole('button', { name: 'Check answer' }).click()
  await expect(page.getByText('Hurts', { exact: true })).toBeVisible()
  await expect(page.getByText('Competes with the goal and makes the intended behavior ambiguous.')).toBeVisible()
  await expect(page.getByText('Not quite.', { exact: false })).toBeVisible()

  await page.getByRole('button', { name: 'Reset' }).click()
  await addRecommendedCards(page)
  await expect(page.getByRole('progressbar', { name: 'Context capacity: 7 of 8 units used' })).toBeVisible()
  await page.getByRole('button', { name: 'Check answer' }).click()
  await expect(page.getByText('Context packed well.', { exact: false })).toBeVisible()
  await expect(page.getByText('LAB COMPLETE · LESSON CAN BE COMPLETED')).toBeVisible()
  expect(runtimeErrors).toEqual([])
})

test('lab completion enables lesson completion and the next artifact', async ({ page }) => {
  const runtimeErrors = collectRuntimeErrors(page)
  await page.goto('/learn/context-window-packing')

  const completeButton = page.getByRole('button', { name: 'Mark complete' })
  const nextButton = page.getByRole('button', { name: 'Next', exact: true })
  await expect(completeButton).toBeDisabled()
  await expect(nextButton).toBeDisabled()

  await addRecommendedCards(page)
  await page.getByRole('button', { name: 'Check answer' }).click()
  await expect(completeButton).toBeEnabled()
  await completeButton.click()
  await expect(page.getByRole('button', { name: 'Completed' })).toBeDisabled()
  await expect(nextButton).toBeEnabled()

  await nextButton.click()
  await expect(page).toHaveURL(/\/learn\/foundations-artifact$/)
  await expect(page.getByRole('heading', { level: 1, name: 'Creator workflow map' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 2, name: 'Creator workflow map' })).toBeVisible()
  await expect(page.getByLabel('Live artifact URL')).toBeVisible()
  await expectNoHorizontalOverflow(page)
  expect(runtimeErrors).toEqual([])
})

test('keyboard alternative completes the lab', async ({ page }) => {
  const runtimeErrors = collectRuntimeErrors(page)
  await page.setViewportSize({ width: 768, height: 1024 })
  await page.goto('/learn/context-window-packing')

  for (const card of recommendedCards) {
    const addButton = page.getByRole('button', { name: `Add ${card} to context` })
    await addButton.focus()
    await expect(addButton).toBeFocused()
    await page.keyboard.press('Enter')
  }
  const checkButton = page.getByRole('button', { name: 'Check answer' })
  await checkButton.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByText('LAB COMPLETE · LESSON CAN BE COMPLETED')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Mark complete' })).toBeEnabled()
  await expectNoHorizontalOverflow(page)
  expect(runtimeErrors).toEqual([])
})

test('touch alternative completes the lab at mobile width', async ({ browser }) => {
  const context = await browser.newContext({
    colorScheme: 'dark',
    hasTouch: true,
    viewport: { width: 390, height: 844 },
  })
  const page = await context.newPage()
  const runtimeErrors = collectRuntimeErrors(page)
  await page.goto('http://127.0.0.1:4173/learn/context-window-packing')

  for (const card of recommendedCards) {
    await page.getByRole('button', { name: `Add ${card} to context` }).tap()
  }
  await page.getByRole('button', { name: 'Check answer' }).tap()
  await expect(page.getByText('LAB COMPLETE · LESSON CAN BE COMPLETED')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Mark complete' })).toBeEnabled()
  await expectNoHorizontalOverflow(page)
  expect(runtimeErrors).toEqual([])
  await context.close()
})

test('direct refresh, previous navigation, and locked routes work', async ({ page }) => {
  const runtimeErrors = collectRuntimeErrors(page)
  await page.setViewportSize({ width: 1440, height: 960 })

  await page.goto('/learn/context-window-packing')
  await page.reload()
  await expect(page.getByRole('heading', { level: 1, name: 'Packing a useful context window' })).toBeVisible()
  await page.getByRole('button', { name: 'Previous' }).click()
  await expect(page).toHaveURL(/\/learn\/how-context-shapes-an-output$/)
  await page.getByRole('button', { name: 'Next', exact: true }).click()
  await expect(page).toHaveURL(/\/learn\/context-window-packing$/)

  await page.goto('/learn/prompt-anatomy')
  await expect(page.getByText('Locked lesson', { exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { level: 1, name: 'Prompt anatomy' })).toBeVisible()
  await expect(page.getByLabel('Prompt anatomy video')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Return to current lesson' })).toBeVisible()
  expect(runtimeErrors).toEqual([])
})

test('mobile outline and public route boundaries remain accessible', async ({ page }) => {
  const runtimeErrors = collectRuntimeErrors(page)
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/learn')

  const outlineButton = page.getByRole('button', { name: 'Open lesson outline' })
  await outlineButton.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('dialog', { name: 'Lesson outline' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Close lesson outline' }).last()).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog', { name: 'Lesson outline' })).toHaveCount(0)

  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Learn by shipping useful work.' })).toBeVisible()
  await page.goto('/login')
  await expect(page.getByRole('heading', { name: 'Sign in is coming next.' })).toBeVisible()

  for (const removedRoute of ['/dashboard', '/courses', '/artifacts', '/portfolio', '/certificate', '/community', '/components']) {
    await page.goto(removedRoute)
    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible()
  }
  await expectNoHorizontalOverflow(page)
  expect(runtimeErrors).toEqual([])
})
