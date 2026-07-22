export interface InterestSignupRecord {
  email: string
  first_name: string | null
  source: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  consent_at: string
}

interface InsertResult {
  error: { code?: string } | null
}

type InsertSignup = (signup: InterestSignupRecord) => Promise<InsertResult>

const allowedOrigins = new Set([
  'https://theartifactacademy.com',
  'https://www.theartifactacademy.com',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:4173',
  'http://127.0.0.1:4173',
])

const allowedKeys = new Set([
  'email',
  'firstName',
  'source',
  'utmSource',
  'utmMedium',
  'utmCampaign',
  'website',
])

const allowedSources = new Set(['landing-hero', 'landing-footer'])
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

class PayloadError extends Error {}

function hasControlCharacter(value: string) {
  return [...value].some((character) => {
    const code = character.charCodeAt(0)
    return code <= 31 || code === 127
  })
}

function corsHeaders(origin: string | null) {
  const headers = new Headers({
    Vary: 'Origin',
    'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  })
  if (origin && allowedOrigins.has(origin)) headers.set('Access-Control-Allow-Origin', origin)
  return headers
}

function jsonResponse(body: unknown, status: number, origin: string | null) {
  const headers = corsHeaders(origin)
  headers.set('Content-Type', 'application/json; charset=utf-8')
  return new Response(JSON.stringify(body), { headers, status })
}

function readOptionalText(
  payload: Record<string, unknown>,
  key: string,
  maxLength: number,
) {
  const value = payload[key]
  if (value === undefined || value === null || value === '') return null
  if (typeof value !== 'string') throw new PayloadError(`${key} must be a string.`)

  const normalized = value.trim()
  if (!normalized) return null
  if (normalized.length > maxLength || hasControlCharacter(normalized)) {
    throw new PayloadError(`${key} is invalid.`)
  }
  return normalized
}

export function createJoinWaitlistHandler(insertSignup: InsertSignup) {
  return async function handleJoinWaitlist(request: Request) {
    const origin = request.headers.get('Origin')

    if (origin && !allowedOrigins.has(origin)) {
      return jsonResponse({ ok: false, error: 'origin_not_allowed' }, 403, null)
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders(origin), status: 204 })
    }

    if (request.method !== 'POST') {
      const response = jsonResponse({ ok: false, error: 'method_not_allowed' }, 405, origin)
      response.headers.set('Allow', 'POST, OPTIONS')
      return response
    }

    const contentLength = Number(request.headers.get('Content-Length') ?? '0')
    if (Number.isFinite(contentLength) && contentLength > 10_000) {
      return jsonResponse({ ok: false, error: 'payload_too_large' }, 413, origin)
    }

    if (!request.headers.get('Content-Type')?.toLowerCase().includes('application/json')) {
      return jsonResponse({ ok: false, error: 'invalid_request' }, 415, origin)
    }

    let parsed: unknown
    try {
      parsed = await request.json()
    } catch {
      return jsonResponse({ ok: false, error: 'invalid_request' }, 400, origin)
    }

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return jsonResponse({ ok: false, error: 'invalid_request' }, 400, origin)
    }

    const payload = parsed as Record<string, unknown>
    const website = payload.website
    if (website !== undefined && typeof website !== 'string') {
      return jsonResponse({ ok: false, error: 'invalid_request' }, 400, origin)
    }
    if (typeof website === 'string' && website.trim()) {
      return jsonResponse({ ok: true }, 200, origin)
    }

    if (Object.keys(payload).some((key) => !allowedKeys.has(key))) {
      return jsonResponse({ ok: false, error: 'invalid_request' }, 400, origin)
    }

    if (typeof payload.email !== 'string') {
      return jsonResponse({ ok: false, error: 'invalid_email' }, 400, origin)
    }

    const email = payload.email.trim().toLowerCase()
    if (email.length > 254 || !emailPattern.test(email)) {
      return jsonResponse({ ok: false, error: 'invalid_email' }, 400, origin)
    }

    try {
      const source = readOptionalText(payload, 'source', 40)
      if (source && !allowedSources.has(source)) throw new PayloadError('source is invalid.')

      const result = await insertSignup({
        email,
        first_name: readOptionalText(payload, 'firstName', 100),
        source,
        utm_source: readOptionalText(payload, 'utmSource', 200),
        utm_medium: readOptionalText(payload, 'utmMedium', 200),
        utm_campaign: readOptionalText(payload, 'utmCampaign', 200),
        consent_at: new Date().toISOString(),
      })

      if (!result.error || result.error.code === '23505') {
        return jsonResponse({ ok: true }, 200, origin)
      }
    } catch (error) {
      if (error instanceof PayloadError) {
        return jsonResponse({ ok: false, error: 'invalid_request' }, 400, origin)
      }
    }

    return jsonResponse({ ok: false, error: 'temporarily_unavailable' }, 503, origin)
  }
}
