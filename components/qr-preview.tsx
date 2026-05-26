'use client'

import { useEffect, useRef, useCallback } from 'react'
import QRCodeStyling from 'qr-code-styling'
import type { StyleParameters } from '../lib/types'
import { buildQROptions } from '../lib/qr-renderer'
import { Button } from './ui/button'

interface QRPreviewProps {
  data: string | null
  params: StyleParameters
}

export function QRPreview({ data, params }: QRPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const qrRef = useRef<QRCodeStyling | null>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const opts = buildQROptions(params, 280)
    opts.data = data || ''

    if (!qrRef.current) {
      qrRef.current = new QRCodeStyling(opts)
      qrRef.current.append(containerRef.current)
    } else {
      qrRef.current.update(opts)
    }
  }, [data, params])

  const handleDownload = useCallback(
    (extension: 'png' | 'svg') => {
      if (!qrRef.current || !data) return
      qrRef.current.download({ extension, name: 'qr-code' })
    },
    [data],
  )

  const hasData = data && data.length > 0

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-[280px] h-[280px]">
        <div ref={containerRef} className="w-full h-full" />
        {!hasData && (
          <div className="absolute inset-0 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg bg-white">
            <div className="text-center text-gray-300">
              <svg className="w-12 h-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2.48a2.5 2.5 0 00-4.52-3m10.04-5a2.5 2.5 0 00-3.52-3M8.48 20H6.5" />
              </svg>
              <p className="text-sm">输入内容后自动生成</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          variant="primary"
          size="sm"
          disabled={!hasData}
          onClick={() => handleDownload('png')}
        >
          下载 PNG
        </Button>
        <Button
          variant="secondary"
          size="sm"
          disabled={!hasData}
          onClick={() => handleDownload('svg')}
        >
          下载 SVG
        </Button>
      </div>
    </div>
  )
}