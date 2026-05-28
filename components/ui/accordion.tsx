'use client'

import { useState } from 'react'

interface AccordionProps {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}

export function Accordion({ title, defaultOpen = false, children }: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-purple-100 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3 text-sm font-semibold text-purple-800 hover:text-purple-600 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:rounded group"
      >
        <span className="flex items-center gap-2">
          {title}
        </span>
        <span className={`flex items-center justify-center w-5 h-5 rounded-full bg-purple-100 text-purple-500 transition-transform duration-200 ${open ? 'rotate-180 bg-purple-200' : ''}`}>
          <svg
            aria-hidden="true"
            className="w-3 h-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      {open && <div className="pb-3 space-y-2.5">{children}</div>}
    </div>
  )
}