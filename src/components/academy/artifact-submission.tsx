import { useState, type FormEvent } from 'react'
import { Check, Clock3, RotateCcw, Send } from 'lucide-react'
import type { LearningAssignment, LearningSubmission, SubmissionStatus } from '../../content/types'
import { cn } from '../../lib/cn'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { StatusBadge } from '../ui/status-badge'

interface ArtifactSubmissionProps {
  assignment: LearningAssignment
  submission: LearningSubmission | undefined
  onSubmit: (submission: LearningSubmission) => void
}

const stateCopy: Record<SubmissionStatus, { heading: string; description: string }> = {
  submitted: {
    heading: 'Submitted for review',
    description: 'Your instructor will review this artifact and respond here.',
  },
  'needs-revision': {
    heading: 'Changes requested',
    description: 'Review the instructor note, update the artifact, and resubmit.',
  },
  approved: {
    heading: 'Artifact approved',
    description: 'This artifact has met the assignment requirements.',
  },
}

export function ArtifactSubmission({ assignment, submission, onSubmit }: ArtifactSubmissionProps) {
  const [liveUrl, setLiveUrl] = useState(submission?.liveUrl ?? '')
  const [sourceUrl, setSourceUrl] = useState(submission?.sourceUrl ?? '')
  const [note, setNote] = useState(submission?.note ?? '')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit({
      status: 'submitted',
      liveUrl,
      sourceUrl,
      note,
    })
  }

  const canEdit = !submission || submission.status === 'needs-revision'

  return (
    <section aria-labelledby="artifact-submission-heading" className="space-y-4">
      <Card className="p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ai">Artifact assignment</p>
        <h2 className="mt-2 text-lg font-semibold" id="artifact-submission-heading">{assignment.title}</h2>
        <p className="mt-2 text-sm leading-6 text-muted">{assignment.description}</p>
        <ul className="mt-4 space-y-2">
          {assignment.deliverables.map((deliverable) => (
            <li className="flex gap-2 text-sm text-foreground" key={deliverable}>
              <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-success" />
              {deliverable}
            </li>
          ))}
        </ul>
      </Card>

      {submission && <SubmissionState submission={submission} />}

      {canEdit && (
        <Card className="p-5">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-xs font-semibold" htmlFor="artifact-live-url">Live artifact URL</label>
              <input
                className="mt-2 h-10 w-full rounded-control border border-border-strong bg-background px-3 text-sm text-foreground placeholder:text-subtle"
                id="artifact-live-url"
                onChange={(event) => setLiveUrl(event.target.value)}
                placeholder="https://"
                required
                type="url"
                value={liveUrl}
              />
            </div>
            <div>
              <label className="text-xs font-semibold" htmlFor="artifact-source-url">Source URL</label>
              <input
                className="mt-2 h-10 w-full rounded-control border border-border-strong bg-background px-3 text-sm text-foreground placeholder:text-subtle"
                id="artifact-source-url"
                onChange={(event) => setSourceUrl(event.target.value)}
                placeholder="https://github.com/"
                required
                type="url"
                value={sourceUrl}
              />
            </div>
            <div>
              <label className="text-xs font-semibold" htmlFor="artifact-note">Note for your instructor</label>
              <textarea
                className="mt-2 min-h-28 w-full resize-y rounded-control border border-border-strong bg-background px-3 py-2.5 text-sm leading-6 text-foreground placeholder:text-subtle"
                id="artifact-note"
                onChange={(event) => setNote(event.target.value)}
                placeholder="What would you like feedback on?"
                required
                value={note}
              />
            </div>
            <Button className="w-full sm:w-auto" type="submit">
              {submission?.status === 'needs-revision' ? <RotateCcw aria-hidden="true" className="size-4" /> : <Send aria-hidden="true" className="size-4" />}
              {submission?.status === 'needs-revision' ? 'Resubmit artifact' : 'Submit artifact'}
            </Button>
          </form>
        </Card>
      )}
    </section>
  )
}

function SubmissionState({ submission }: { submission: LearningSubmission }) {
  const copy = stateCopy[submission.status]
  const approved = submission.status === 'approved'
  const revision = submission.status === 'needs-revision'
  const Icon = approved ? Check : revision ? RotateCcw : Clock3

  return (
    <div
      className={cn(
        'rounded-card border p-4',
        approved && 'border-success/30 bg-success-soft',
        revision && 'border-clay/30 bg-clay-soft',
        submission.status === 'submitted' && 'border-border bg-card',
      )}
    >
      <div className="flex flex-wrap items-start gap-3">
        <span className={cn('grid size-9 shrink-0 place-items-center rounded-full', approved ? 'bg-success text-white' : revision ? 'bg-clay text-white' : 'bg-card-secondary text-muted')}>
          <Icon aria-hidden="true" className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold">{copy.heading}</h3>
            <StatusBadge accent={approved ? 'success' : revision ? 'clay' : 'neutral'}>
              {submission.status === 'needs-revision' ? 'Needs revision' : submission.status === 'approved' ? 'Approved' : 'Submitted'}
            </StatusBadge>
          </div>
          <p className="mt-1 text-xs leading-5 text-muted">{copy.description}</p>
        </div>
      </div>
      {submission.feedback && (
        <div className="mt-4 border-t border-current/10 pt-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-subtle">Instructor feedback</p>
          <p className="mt-2 text-sm leading-6 text-foreground">{submission.feedback}</p>
          <p className="mt-2 text-xs font-semibold text-clay">Alireza Alampour</p>
        </div>
      )}
    </div>
  )
}
