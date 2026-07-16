import { useState } from 'react'
import { Check, Copy, Sparkles } from 'lucide-react'
import { Button } from '../ui/button'

interface PromptBlockProps {
  title: string
  prompt: string
}

export function PromptBlock({ title, prompt }: PromptBlockProps) {
  const [copied, setCopied] = useState(false)

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="overflow-hidden rounded-card border border-ai/20 bg-ai-soft">
      <div className="flex items-center justify-between gap-3 border-b border-ai/20 px-4 py-3">
        <div className="flex items-center gap-2 text-ai">
          <Sparkles aria-hidden="true" className="size-4" />
          <h3 className="text-xs font-semibold">{title}</h3>
        </div>
        <Button aria-label="Copy prompt" onClick={() => void copyPrompt()} size="sm" variant="ghost">
          {copied ? <Check aria-hidden="true" className="size-3.5" /> : <Copy aria-hidden="true" className="size-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
      <pre className="m-0 whitespace-pre-wrap p-4 font-mono text-xs leading-6 text-foreground">{prompt}</pre>
    </div>
  )
}
