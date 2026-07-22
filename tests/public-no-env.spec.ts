import { expect, test } from '@playwright/test'

test('public routes render without Supabase environment variables', async ({ page }) => {
  for (const route of ['/', '/privacy', '/terms']) {
    await page.goto(route)
    await expect(page.locator('#root')).not.toBeEmpty()
    await expect(page.getByText('Supabase is not configured')).toHaveCount(0)
  }

  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1, name: /Build with AI/ })).toBeVisible()
})

test('missing waitlist configuration produces an inline retryable error', async ({ page }) => {
  await page.goto('/')
  const form = page.getByRole('form', { name: 'Join the founding cohort' }).first()

  await form.getByLabel('Email address').fill('creator@example.com')
  await form.getByRole('button', { name: 'Join the founding cohort' }).click()

  await expect(form.getByText('Something went wrong on our end. Please try again.')).toBeVisible()
  await expect(form.getByRole('button', { name: 'Join the founding cohort' })).toBeEnabled()
  await expect(page.getByRole('heading', { level: 1, name: /Build with AI/ })).toBeVisible()
})
