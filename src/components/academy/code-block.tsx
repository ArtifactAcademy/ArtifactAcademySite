import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from '../ui/button'

interface CodeBlockProps {
  filename: string
  language: string
  code: string
}

export function CodeBlock({ filename, language, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="overflow-hidden rounded-card border border-border bg-page">
      <div className="flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-2.5">
        <div className="min-w-0 font-mono text-[11px]"><span className="text-foreground">{filename}</span><span className="ml-2 text-subtle">{language}</span></div>
        <Button aria-label={`Copy ${filename}`} onClick={() => void copyCode()} size="sm" variant="ghost">{copied ? <Check aria-hidden="true" className="size-3.5" /> : <Copy aria-hidden="true" className="size-3.5" />}{copied ? 'Copied' : 'Copy'}</Button>
      </div>
      <pre className="m-0 overflow-x-auto p-4 font-mono text-xs leading-6 text-foreground"><code>{code}</code></pre>
    </div>
  )
}
