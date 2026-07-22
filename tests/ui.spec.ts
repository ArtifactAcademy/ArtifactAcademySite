import { expect, test, type Page } from '@playwright/test'

type TestUser = 'enrolled' | 'unenrolled' | 'student-b'

interface TestHarness {
  reset: () => void
  signInAs: (user: TestUser) => void
  seedProgress: (
    user: TestUser,
    progress: {
      completedItemIds?: string[]
      completedLabIds?: string[]
    },
  ) => void
  seedSubmission: (
    user: TestUser,
    assignmentId: string,
    submission: {
      status: 'submitted' | 'needs-revision' | 'approved'
      liveUrl: string
      sourceUrl: string
      note: string
      feedback?: string
    },
  ) => void
  setWaitlistResult: (result: 'success' | 'server-error') => void
  waitlistSnapshot: () => Array<{
    email: string
    source?: 'landing-hero' | 'landing-footer'
    utmSource?: string
    utmMedium?: string
    utmCampaign?: string
    website?: string
  }>
  snapshot: (user: TestUser) => {
    progress: {
      completedItemIds: string[]
      completedLabIds: string[]
    }
    submissions: Record<string, {
      status: 'submitted' | 'needs-revision' | 'approved'
      liveUrl: string
      sourceUrl: string
      note: string
      feedback?: string
    }>
  }
}

declare global {
  interface Window {
    __ARTIFACT_ACADEMY_TEST__: TestHarness
  }
}

const firstLessonId = 'how-context-shapes-an-output'
const labLessonId = 'context-window-packing'
const labBlockId = 'packing-lab'
const assignmentId = 'foundations-artifact'
const recommendedCards = [
  'System instruction',
  'User goal',
  'Useful reference',
  'Output format',
] as const

async function resetTestState(page: Page) {
  await page.goto('/')
  await page.evaluate(() => window.__ARTIFACT_ACADEMY_TEST__.reset())
}

async function signInAs(page: Page, user: TestUser = 'enrolled') {
  await resetTestState(page)
  await page.evaluate((nextUser) => window.__ARTIFACT_ACADEMY_TEST__.signInAs(nextUser), user)
}

function collectRuntimeErrors(page: Page) {
  const runtimeErrors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text())
  })
  page.on('pageerror', (error) => runtimeErrors.push(error.message))
  return runtimeErrors
}

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  )
  expect(overflow).toBeLessThanOrEqual(1)
}

async function addRecommendedCards(page: Page, keyboard = false) {
  for (const card of recommendedCards) {
    const button = page.getByRole('button', { name: `Add ${card} to context` })
    if (keyboard) {
      await button.focus()
      await expect(button).toBeFocused()
      await page.keyboard.press('Enter')
    } else {
      await button.click()
    }
  }
}

function heroWaitlistForm(page: Page) {
  return page.getByRole('form', { name: 'Join the founding cohort' }).first()
}

test('the production landing page is available at the public root', async ({ page }) => {
  const runtimeErrors = collectRuntimeErrors(page)
  await resetTestState(page)

  await expect(page).toHaveTitle('Artifact Academy · AI Creator Bootcamp')
  await expect(page.getByRole('heading', { level: 1, name: /Build with AI\. Leave with proof\./ })).toBeVisible()
  await expect(page.getByText('Practical AI education')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Work that exists beyond the lesson' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Context Window Packing Lab' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Eight sessions. One throughline.' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Instructor' })).toHaveCount(0)
  await expect(page.getByRole('link', { name: 'FAQ' })).toHaveCount(0)
  await expectNoHorizontalOverflow(page)
  expect(runtimeErrors).toEqual([])
})

test('the hero uses responsive artwork and the product preview is interactive', async ({ page }) => {
  await resetTestState(page)

  const heroImage = page.locator('.marketing-hero-media')
  await expect(heroImage).toHaveAttribute('width', '1672')
  await expect(heroImage).toHaveAttribute('height', '941')
  await expect(heroImage).toHaveAttribute('srcset', /artifact-constellation-960\.webp/)

  const lab = page.locator('#interactive-learning')
  await page.getByRole('button', { name: 'Add System instruction to context' }).click()
  await expect(lab.getByText('2 / 8')).toBeVisible()
})

test('the marketing entrance treatment respects reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await resetTestState(page)

  const animationDuration = await page.locator('.marketing-hero-copy').evaluate(
    (element) => Number.parseFloat(getComputedStyle(element).animationDuration) || 0,
  )
  expect(animationDuration).toBeLessThan(0.001)
})

test('the marketing header student-login link preserves the login route', async ({ page }) => {
  await resetTestState(page)

  const loginLink = page.getByRole('link', { name: 'Student login' }).first()
  await expect(loginLink).toHaveAttribute('href', '/login')
  await loginLink.click()
  await expect(page).toHaveURL(/\/login$/)
  await expect(page.getByRole('heading', { name: 'Sign in to keep learning.' })).toBeVisible()
})

test('privacy and terms routes are clearly marked editable starters', async ({ page }) => {
  await resetTestState(page)

  for (const route of ['/privacy', '/terms']) {
    await page.goto(route)
    await expect(page.getByText('Editable legal placeholder')).toBeVisible()
    await expect(page.getByText('Not legal advice. This content still requires review and approval.')).toBeVisible()
  }
})

test('the waitlist form reports invalid email without making a signup', async ({ page }) => {
  await resetTestState(page)
  const form = heroWaitlistForm(page)

  await form.getByLabel('Email address').fill('not-an-email')
  await form.getByRole('button', { name: 'Join the founding cohort' }).click()

  await expect(form.getByText('Please enter a valid email address.')).toBeVisible()
  await expect(form.getByLabel('Email address')).toHaveAttribute('aria-invalid', 'true')
  expect(await page.evaluate(() => window.__ARTIFACT_ACADEMY_TEST__.waitlistSnapshot())).toEqual([])
})

test('a valid early-interest signup reaches the waitlist service', async ({ page }) => {
  const runtimeErrors = collectRuntimeErrors(page)
  await resetTestState(page)
  const form = heroWaitlistForm(page)

  await form.getByLabel('Email address').fill('Creator@Example.com')
  await form.getByRole('button', { name: 'Join the founding cohort' }).click()

  await expect(form.getByText('You’re on the list.')).toBeVisible()
  const signups = await page.evaluate(() => window.__ARTIFACT_ACADEMY_TEST__.waitlistSnapshot())
  expect(signups).toHaveLength(1)
  expect(signups[0]).toMatchObject({ email: 'creator@example.com', source: 'landing-hero' })
  expect(runtimeErrors).toEqual([])
})

test('a duplicate signup is treated as success without a second record', async ({ page }) => {
  await resetTestState(page)
  let form = heroWaitlistForm(page)
  await form.getByLabel('Email address').fill('duplicate@example.com')
  await form.getByRole('button', { name: 'Join the founding cohort' }).click()
  await expect(form.getByText('You’re on the list.')).toBeVisible()

  await page.reload()
  form = heroWaitlistForm(page)
  await form.getByLabel('Email address').fill('DUPLICATE@example.com')
  await form.getByRole('button', { name: 'Join the founding cohort' }).click()
  await expect(form.getByText('You’re on the list.')).toBeVisible()

  const signups = await page.evaluate(() => window.__ARTIFACT_ACADEMY_TEST__.waitlistSnapshot())
  expect(signups).toHaveLength(1)
})

test('a waitlist server failure remains retryable', async ({ page }) => {
  await resetTestState(page)
  await page.evaluate(() => window.__ARTIFACT_ACADEMY_TEST__.setWaitlistResult('server-error'))
  const form = heroWaitlistForm(page)

  await form.getByLabel('Email address').fill('retry@example.com')
  await form.getByRole('button', { name: 'Join the founding cohort' }).click()
  await expect(form.getByText('Something went wrong on our end. Please try again.')).toBeVisible()
  await expect(form.getByRole('button', { name: 'Join the founding cohort' })).toBeEnabled()

  await page.evaluate(() => window.__ARTIFACT_ACADEMY_TEST__.setWaitlistResult('success'))
  await form.getByRole('button', { name: 'Join the founding cohort' }).click()
  await expect(form.getByText('You’re on the list.')).toBeVisible()
})

test('the waitlist form submits from the keyboard', async ({ page }) => {
  await resetTestState(page)
  const form = heroWaitlistForm(page)
  const email = form.getByLabel('Email address')

  await email.fill('keyboard@example.com')
  await email.focus()
  await page.keyboard.press('Enter')

  await expect(form.getByText('You’re on the list.')).toBeVisible()
  expect(await page.evaluate(() => window.__ARTIFACT_ACADEMY_TEST__.waitlistSnapshot())).toHaveLength(1)
})

test('the waitlist captures allowed UTM values from the landing URL', async ({ page }) => {
  await page.goto('/?utm_source=launch-newsletter&utm_medium=email&utm_campaign=founding-cohort')
  await page.evaluate(() => window.__ARTIFACT_ACADEMY_TEST__.reset())
  const form = heroWaitlistForm(page)

  await form.getByLabel('Email address').fill('utm@example.com')
  await form.getByRole('button', { name: 'Join the founding cohort' }).click()
  await expect(form.getByText('You’re on the list.')).toBeVisible()

  const [signup] = await page.evaluate(() => window.__ARTIFACT_ACADEMY_TEST__.waitlistSnapshot())
  expect(signup).toMatchObject({
    utmSource: 'launch-newsletter',
    utmMedium: 'email',
    utmCampaign: 'founding-cohort',
  })
})

for (const viewport of [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 960 },
] as const) {
  test(`the landing page has no errors or overflow at ${viewport.name} width`, async ({ page }) => {
    const runtimeErrors = collectRuntimeErrors(page)
    await page.setViewportSize({ width: viewport.width, height: viewport.height })
    await resetTestState(page)

    await expect(page.getByRole('heading', { level: 1, name: /Build with AI/ })).toBeVisible()
    await expectNoHorizontalOverflow(page)
    if (viewport.name === 'mobile') {
      await expect(page.getByRole('navigation', { name: 'Landing page' })).toBeHidden()
      await expect(page.locator('header').getByRole('link', { name: 'Student login' })).toBeVisible()
    }
    expect(runtimeErrors).toEqual([])
  })
}

test('signed-out students are redirected to the magic-link login', async ({ page }) => {
  const runtimeErrors = collectRuntimeErrors(page)
  await resetTestState(page)

  await page.goto(`/learn/${firstLessonId}`)
  await expect(page).toHaveURL(/\/login$/)
  await expect(page.getByRole('heading', { name: 'Sign in to keep learning.' })).toBeVisible()

  await page.getByLabel('Email address').fill('student@example.com')
  await page.getByRole('button', { name: 'Email me a sign-in link' }).click()
  await expect(page.getByRole('heading', { name: 'Check your inbox' })).toBeVisible()
  await expect(page.getByText('student@example.com')).toBeVisible()
  expect(runtimeErrors).toEqual([])
})

test('authenticated but unenrolled students see access pending', async ({ page }) => {
  const runtimeErrors = collectRuntimeErrors(page)
  await signInAs(page, 'unenrolled')

  await page.goto('/learn')
  await expect(page.getByRole('heading', { name: 'Your account is ready.' })).toBeVisible()
  await expect(page.getByText('Access pending', { exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible()
  await expectNoHorizontalOverflow(page)
  expect(runtimeErrors).toEqual([])
})

test('an enrolled new student starts with no completed lessons', async ({ page }) => {
  const runtimeErrors = collectRuntimeErrors(page)
  await signInAs(page)

  await page.goto('/learn')
  await expect(page).toHaveURL(new RegExp(`/learn/${firstLessonId}$`))
  await expect(
    page.getByRole('heading', { level: 1, name: 'How context shapes an output' }),
  ).toBeVisible()
  await expect(page.getByRole('button', { name: 'Mark complete' })).toBeEnabled()
  await expect(page.getByText('Session 1 of 8', { exact: true })).toBeVisible()
  expect(runtimeErrors).toEqual([])
})

test('stored progress selects the current lesson and loads lab completion', async ({ page }) => {
  const runtimeErrors = collectRuntimeErrors(page)
  await signInAs(page)
  await page.evaluate(({ first, lab }) => {
    window.__ARTIFACT_ACADEMY_TEST__.seedProgress('enrolled', {
      completedItemIds: [first],
      completedLabIds: [lab],
    })
  }, { first: firstLessonId, lab: labBlockId })

  await page.goto('/learn')
  await expect(page).toHaveURL(new RegExp(`/learn/${labLessonId}$`))
  await expect(page.getByText('LAB COMPLETE · LESSON CAN BE COMPLETED')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Mark complete' })).toBeEnabled()
  expect(runtimeErrors).toEqual([])
})

test('keyboard lab completion persists after refresh', async ({ page }) => {
  const runtimeErrors = collectRuntimeErrors(page)
  await page.setViewportSize({ width: 768, height: 1024 })
  await signInAs(page)
  await page.evaluate((first) => {
    window.__ARTIFACT_ACADEMY_TEST__.seedProgress('enrolled', { completedItemIds: [first] })
  }, firstLessonId)
  await page.goto(`/learn/${labLessonId}`)

  await addRecommendedCards(page, true)
  const checkButton = page.getByRole('button', { name: 'Check answer' })
  await checkButton.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByText('LAB COMPLETE · LESSON CAN BE COMPLETED')).toBeVisible()

  await page.reload()
  await expect(page.getByText('LAB COMPLETE · LESSON CAN BE COMPLETED')).toBeVisible()
  const snapshot = await page.evaluate(() => window.__ARTIFACT_ACADEMY_TEST__.snapshot('enrolled'))
  expect(snapshot.progress.completedLabIds).toContain(labBlockId)
  await expectNoHorizontalOverflow(page)
  expect(runtimeErrors).toEqual([])
})

test('lesson completion persists and unlocks the next lesson', async ({ page }) => {
  const runtimeErrors = collectRuntimeErrors(page)
  await signInAs(page)
  await page.goto(`/learn/${firstLessonId}`)

  await page.getByRole('button', { name: 'Mark complete' }).click()
  await expect(page.getByRole('button', { name: 'Completed' })).toBeDisabled()
  await expect(page.getByRole('button', { name: 'Next', exact: true })).toBeEnabled()

  await page.reload()
  await expect(page.getByRole('button', { name: 'Completed' })).toBeDisabled()
  await page.getByRole('button', { name: 'Next', exact: true }).click()
  await expect(page).toHaveURL(new RegExp(`/learn/${labLessonId}$`))
  expect(runtimeErrors).toEqual([])
})

test('artifact submission creation persists after refresh', async ({ page }) => {
  const runtimeErrors = collectRuntimeErrors(page)
  await signInAs(page)
  await page.evaluate(({ first, labLesson }) => {
    window.__ARTIFACT_ACADEMY_TEST__.seedProgress('enrolled', { completedItemIds: [first, labLesson] })
  }, { first: firstLessonId, labLesson: labLessonId })
  await page.goto(`/learn/${assignmentId}`)

  await page.getByLabel('Live artifact URL').fill('https://example.com/workflow')
  await page.getByLabel('Source URL').fill('https://github.com/example/workflow')
  await page.getByLabel('Note for your instructor').fill('Please review the context handoff.')
  await page.getByRole('button', { name: 'Submit artifact' }).click()
  await expect(page.getByRole('heading', { name: 'Submitted for review' })).toBeVisible()

  await page.reload()
  await expect(page.getByRole('heading', { name: 'Submitted for review' })).toBeVisible()
  await expect(page.getByLabel('Live artifact URL')).toHaveCount(0)
  expect(runtimeErrors).toEqual([])
})

test('a needs-revision submission can be revised once and resubmitted', async ({ page }) => {
  const runtimeErrors = collectRuntimeErrors(page)
  await signInAs(page)
  await page.evaluate(({ first, labLesson, assignment }) => {
    window.__ARTIFACT_ACADEMY_TEST__.seedProgress('enrolled', { completedItemIds: [first, labLesson] })
    window.__ARTIFACT_ACADEMY_TEST__.seedSubmission('enrolled', assignment, {
      status: 'needs-revision',
      liveUrl: 'https://example.com/original',
      sourceUrl: 'https://github.com/example/original',
      note: 'Original note',
      feedback: 'Make the context handoff explicit.',
    })
  }, { first: firstLessonId, labLesson: labLessonId, assignment: assignmentId })
  await page.goto(`/learn/${assignmentId}`)

  await expect(page.getByRole('heading', { name: 'Changes requested' })).toBeVisible()
  await expect(page.getByText('Make the context handoff explicit.')).toBeVisible()
  await page.getByLabel('Live artifact URL').fill('https://example.com/revised')
  await page.getByRole('button', { name: 'Resubmit artifact' }).click()
  await expect(page.getByRole('heading', { name: 'Submitted for review' })).toBeVisible()

  const snapshot = await page.evaluate(() => window.__ARTIFACT_ACADEMY_TEST__.snapshot('enrolled'))
  expect(snapshot.submissions[assignmentId]?.status).toBe('submitted')
  expect(snapshot.submissions[assignmentId]?.liveUrl).toBe('https://example.com/revised')
  expect(runtimeErrors).toEqual([])
})

test('approved submissions display persisted instructor feedback', async ({ page }) => {
  const runtimeErrors = collectRuntimeErrors(page)
  await signInAs(page)
  await page.evaluate(({ first, labLesson, assignment }) => {
    window.__ARTIFACT_ACADEMY_TEST__.seedProgress('enrolled', { completedItemIds: [first, labLesson] })
    window.__ARTIFACT_ACADEMY_TEST__.seedSubmission('enrolled', assignment, {
      status: 'approved',
      liveUrl: 'https://example.com/approved',
      sourceUrl: 'https://github.com/example/approved',
      note: 'Ready for review.',
      feedback: 'Approved. The handoff is clear and reusable.',
    })
  }, { first: firstLessonId, labLesson: labLessonId, assignment: assignmentId })
  await page.goto(`/learn/${assignmentId}`)

  await expect(page.getByRole('heading', { name: 'Artifact approved' })).toBeVisible()
  await expect(page.getByText('Approved. The handoff is clear and reusable.')).toBeVisible()
  await expect(page.getByLabel('Live artifact URL')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Mark complete' })).toBeEnabled()
  expect(runtimeErrors).toEqual([])
})

test('switching students never exposes another student progress or submission', async ({ page }) => {
  const runtimeErrors = collectRuntimeErrors(page)
  await signInAs(page)
  await page.evaluate(({ first, labLesson, assignment }) => {
    window.__ARTIFACT_ACADEMY_TEST__.seedProgress('enrolled', { completedItemIds: [first, labLesson] })
    window.__ARTIFACT_ACADEMY_TEST__.seedSubmission('enrolled', assignment, {
      status: 'approved',
      liveUrl: 'https://example.com/private',
      sourceUrl: 'https://github.com/example/private',
      note: 'Student A only.',
      feedback: 'Private instructor feedback.',
    })
    window.__ARTIFACT_ACADEMY_TEST__.signInAs('student-b')
  }, { first: firstLessonId, labLesson: labLessonId, assignment: assignmentId })

  await page.goto('/learn')
  await expect(page).toHaveURL(new RegExp(`/learn/${firstLessonId}$`))
  await page.goto(`/learn/${assignmentId}`)
  await expect(page.getByText('Locked lesson', { exact: true })).toBeVisible()
  await expect(page.getByText('Private instructor feedback.')).toHaveCount(0)
  expect(runtimeErrors).toEqual([])
})

for (const viewport of [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1440, height: 960 },
] as const) {
  test(`authenticated learning workspace has no overflow at ${viewport.name} width`, async ({ page }) => {
    const runtimeErrors = collectRuntimeErrors(page)
    await page.setViewportSize({ width: viewport.width, height: viewport.height })
    await signInAs(page)
    await page.evaluate((first) => {
      window.__ARTIFACT_ACADEMY_TEST__.seedProgress('enrolled', { completedItemIds: [first] })
    }, firstLessonId)
    await page.goto(`/learn/${labLessonId}`)

    await expect(page.getByRole('heading', { name: 'Context Window Packing Lab' })).toBeVisible()
    if (viewport.width < 1024) {
      await expect(page.getByRole('button', { name: 'Open lesson outline' })).toBeVisible()
      await expect(page.getByRole('navigation', { name: 'Course navigator' })).toBeHidden()
    } else {
      await expect(page.getByRole('navigation', { name: 'Course navigator' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'Open lesson outline' })).toBeHidden()
    }
    await expectNoHorizontalOverflow(page)
    expect(runtimeErrors).toEqual([])
  })
}

test('removed product routes and the production component route stay unavailable', async ({ page }) => {
  const runtimeErrors = collectRuntimeErrors(page)
  for (const route of [
    '/dashboard',
    '/courses',
    '/artifacts',
    '/portfolio',
    '/certificate',
    '/community',
    '/components',
  ]) {
    await page.goto(route)
    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible()
  }
  expect(runtimeErrors).toEqual([])
})
