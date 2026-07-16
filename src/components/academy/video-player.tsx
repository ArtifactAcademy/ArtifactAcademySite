import { Play, RefreshCw, VideoOff } from 'lucide-react'
import type { VideoStatus } from '../../lib/types'
import { Button } from '../ui/button'

interface VideoPlayerProps {
  title: string
  durationMinutes: number
  status: VideoStatus
}

export function VideoPlayer({ title, durationMinutes, status }: VideoPlayerProps) {
  return (
    <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-card border border-border bg-page" aria-label={`${title} video`}>
      {status === 'available' ? (
        <>
          <span className="grid size-14 place-items-center rounded-card border border-border-strong bg-card text-foreground shadow-floating" aria-hidden="true"><Play className="ml-0.5 size-5 fill-current" /></span>
          <span className="absolute bottom-3 left-3 font-mono text-[10px] text-subtle">Responsive video placeholder</span>
          <span className="absolute bottom-3 right-3 rounded bg-card px-2 py-1 font-mono text-[10px] text-muted">{durationMinutes}:00</span>
        </>
      ) : (
        <div className="flex flex-col items-center px-5 text-center">
          <VideoOff aria-hidden="true" className="size-7 text-muted" />
          <p className="mt-3 text-sm font-semibold">Video unavailable</p>
          <p className="mt-1 text-xs text-muted">The lesson reading remains available.</p>
          <Button className="mt-4" size="sm" variant="secondary"><RefreshCw aria-hidden="true" className="size-3.5" />Retry</Button>
        </div>
      )}
    </div>
  )
}
