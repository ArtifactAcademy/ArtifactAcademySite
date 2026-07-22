import { createJoinWaitlistHandler, type InterestSignupRecord } from './handler.ts'

const productionOrigin = 'https://theartifactacademy.com'

function assertEquals(actual: unknown, expected: unknown, message = 'values differ') {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(
      `${message}: expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`,
    )
  }
}

function post(body: unknown, origin = productionOrigin) {
  return new Request('http://localhost/functions/v1/join-waitlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: origin },
    body: JSON.stringify(body),
  })
}

Deno.test('normalizes and inserts an allowed signup', async () => {
  let inserted: InterestSignupRecord | undefined
  const handler = createJoinWaitlistHandler((signup) => {
    inserted = signup
    return Promise.resolve({ error: null })
  })

  const response = await handler(post({
    email: '  PERSON@Example.COM ',
    source: 'landing-hero',
    utmSource: 'newsletter',
    utmMedium: 'email',
    utmCampaign: 'founding-cohort',
    website: '',
  }))

  assertEquals(response.status, 200)
  assertEquals(inserted?.email, 'person@example.com')
  assertEquals(inserted?.source, 'landing-hero')
  assertEquals(response.headers.get('Access-Control-Allow-Origin'), productionOrigin)
})

Deno.test('treats a duplicate database response as success', async () => {
  const handler = createJoinWaitlistHandler(() => Promise.resolve({ error: { code: '23505' } }))
  const response = await handler(post({ email: 'person@example.com' }))

  assertEquals(response.status, 200)
  assertEquals(await response.json(), { ok: true })
})

Deno.test('returns a generic retryable response for a database failure', async () => {
  const handler = createJoinWaitlistHandler(() => Promise.resolve({ error: { code: 'XX000' } }))
  const response = await handler(post({ email: 'person@example.com' }))

  assertEquals(response.status, 503)
  assertEquals(await response.json(), { ok: false, error: 'temporarily_unavailable' })
})

Deno.test('rejects malformed input without inserting', async () => {
  let insertions = 0
  const handler = createJoinWaitlistHandler(() => {
    insertions += 1
    return Promise.resolve({ error: null })
  })
  const response = await handler(post({ email: 'not-an-email', unexpected: true }))

  assertEquals(response.status, 400)
  assertEquals(insertions, 0)
})

Deno.test('honeypot submissions return success without inserting', async () => {
  let insertions = 0
  const handler = createJoinWaitlistHandler(() => {
    insertions += 1
    return Promise.resolve({ error: null })
  })
  const response = await handler(post({ email: 'bot@example.com', website: 'spam.example' }))

  assertEquals(response.status, 200)
  assertEquals(insertions, 0)
})

Deno.test('rejects unapproved origins and non-POST methods', async () => {
  const handler = createJoinWaitlistHandler(() => Promise.resolve({ error: null }))
  const originResponse = await handler(
    post({ email: 'person@example.com' }, 'https://malicious.example'),
  )
  const methodResponse = await handler(new Request('http://localhost/functions/v1/join-waitlist'))

  assertEquals(originResponse.status, 403)
  assertEquals(originResponse.headers.get('Access-Control-Allow-Origin'), null)
  assertEquals(methodResponse.status, 405)
})
