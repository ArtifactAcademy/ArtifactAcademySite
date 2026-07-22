import { CircleAlert, CircleCheck, LoaderCircle } from 'lucide-react'
import { useMemo, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { cn } from '../../lib/cn'
import type { WaitlistSignupInput } from '../../lib/services/types'
import { useServices } from '../../lib/services/use-services'
import { Button } from '../ui/button'

type FormStatus = 'idle' | 'invalid' | 'submitting' | 'success' | 'server-error'

function readAttribution(): Pick<WaitlistSignupInput, 'utmSource' | 'utmMedium' | 'utmCampaign'> {
  const params = new URLSearchParams(window.location.search)
  const utmSource = params.get('utm_source')?.trim()
  const utmMedium = params.get('utm_medium')?.trim()
  const utmCampaign = params.get('utm_campaign')?.trim()

  return {
    ...(utmSource ? { utmSource } : {}),
    ...(utmMedium ? { utmMedium } : {}),
    ...(utmCampaign ? { utmCampaign } : {}),
  }
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())
}

export function WaitlistForm({
  formId,
  source,
  centered = false,
}: {
  formId: string
  source: NonNullable<WaitlistSignupInput['source']>
  centered?: boolean
}) {
  const { waitlist } = useServices()
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [status, setStatus] = useState<FormStatus>('idle')
  const emailRef = useRef<HTMLInputElement>(null)
  const attribution = useMemo(() => readAttribution(), [])
  const messageId = `${formId}-message`
  const consentId = `${formId}-consent`
  const disabled = status === 'submitting' || status === 'success'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!isValidEmail(email)) {
      setStatus('invalid')
      emailRef.current?.focus()
      return
    }

    setStatus('submitting')
    try {
      await waitlist.join({
        email: email.trim(),
        source,
        website,
        ...attribution,
      })
      setStatus('success')
    } catch {
      setStatus('server-error')
    }
  }

  function handleEmailChange(nextEmail: string) {
    setEmail(nextEmail)
    if (status === 'invalid' || status === 'server-error') setStatus('idle')
  }

  const feedback = status === 'invalid'
    ? { icon: CircleAlert, text: 'Please enter a valid email address.', tone: 'text-error' }
    : status === 'server-error'
      ? { icon: CircleAlert, text: 'Something went wrong on our end. Please try again.', tone: 'text-error' }
      : status === 'success'
        ? { icon: CircleCheck, text: 'You’re on the list. We’ll be in touch with founding-cohort details.', tone: 'text-success' }
        : null

  return (
    <form aria-label="Join the founding cohort" className="w-full" noValidate onSubmit={(event) => void handleSubmit(event)}>
      <div className="sr-only" aria-hidden="true">
        <label htmlFor={`${formId}-website`}>Website</label>
        <input
          autoComplete="off"
          id={`${formId}-website`}
          name="website"
          onChange={(event) => setWebsite(event.target.value)}
          tabIndex={-1}
          type="text"
          value={website}
        />
      </div>
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <div className="min-w-0 flex-1">
          <label className="sr-only" htmlFor={`${formId}-email`}>Email address</label>
          <input
            aria-describedby={`${messageId} ${consentId}`}
            aria-invalid={status === 'invalid'}
            autoComplete="email"
            className={cn(
              'h-12 w-full rounded-control border bg-card px-4 text-[15px] text-foreground placeholder:text-subtle disabled:cursor-not-allowed disabled:opacity-60',
              status === 'invalid' ? 'border-error' : 'border-border-strong',
            )}
            disabled={disabled}
            id={`${formId}-email`}
            inputMode="email"
            name="email"
            onChange={(event) => handleEmailChange(event.target.value)}
            placeholder="you@email.com"
            ref={emailRef}
            type="email"
            value={email}
          />
        </div>
        <Button className="shrink-0 sm:min-w-48" disabled={disabled} size="lg" type="submit">
          {status === 'submitting' && <LoaderCircle aria-hidden="true" className="size-4 animate-spin motion-reduce:animate-none" />}
          {status === 'submitting' ? 'Joining…' : status === 'success' ? 'Joined' : 'Join the founding cohort'}
        </Button>
      </div>
      <div aria-atomic="true" aria-live="polite" id={messageId}>
        {feedback && (
          <p className={cn('mt-3 flex items-center gap-2 text-sm', centered && 'justify-center', feedback.tone)}>
            <feedback.icon aria-hidden="true" className="size-4 shrink-0" />
            <span>{feedback.text}</span>
          </p>
        )}
      </div>
      <p className={cn('mt-3 text-xs leading-5 text-subtle', centered && 'text-center')} id={consentId}>
        By joining, you agree to receive Artifact Academy launch and cohort updates. Unsubscribe anytime. See our <Link className="underline underline-offset-2 hover:text-foreground" to="/privacy">privacy starter notice</Link>.
      </p>
    </form>
  )
}
