'use client'

import { Link2, Check } from 'lucide-react'
import { useState } from 'react'

interface ShareButtonProps {
  url: string
  title: string
}

export default function ShareButton({ url, title }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard not available
    }
  }

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? 'Link copied!' : 'Copy link'}
      className="flex items-center gap-2 border border-gray-200 text-gray-600 hover:border-gold hover:text-gold px-4 py-2 rounded-sm text-sm transition-colors"
    >
      {copied ? (
        <><Check className="w-4 h-4 text-green-500" aria-hidden="true" /> Copied</>
      ) : (
        <><Link2 className="w-4 h-4" aria-hidden="true" /> Copy Link</>
      )}
    </button>
  )
}
