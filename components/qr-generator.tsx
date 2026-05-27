'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Style, StyleParameters, Template, QRContent } from '@/lib/types'
import { ContentInput } from './content-input'
import { StylePanel } from './style-panel'
import { QRPreview } from './qr-preview'

const DEFAULT_PARAMS: StyleParameters = {
  dotShape: 'square',
  colorDark: '#000000',
  colorLight: '#ffffff',
  gradient: { enabled: false, type: 'linear', colors: ['#404040', '#a3a3a3'] },
  cornerSquareType: 'square',
  cornerDotType: 'square',
  logo: { enabled: false, url: '', size: 0.2 },
  errorCorrection: 'M',
}

export function QRGenerator() {
  const [styles, setStyles] = useState<Style[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [error, setError] = useState<string | null>(null)
  const [content, setContent] = useState<QRContent | null>(null)
  const [params, setParams] = useState<StyleParameters>(DEFAULT_PARAMS)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sRes, tRes] = await Promise.all([
          fetch('/api/styles'),
          fetch('/api/templates'),
        ])
        if (!sRes.ok || !tRes.ok) throw new Error('加载失败')
        const [s, t] = await Promise.all([sRes.json(), tRes.json()])
        setStyles(s)
        setTemplates(t)
      } catch {
        setError('样式数据加载失败，您仍可手动调整参数')
      }
    }
    fetchData()
  }, [])

  const handleTemplateSelect = useCallback(
    async (template: Template) => {
      try {
        const res = await fetch(`/api/templates/${template.id}`)
        if (!res.ok) throw new Error('加载模板失败')
        const data = await res.json()
        if (data.resolvedParams) {
          setParams({
            ...DEFAULT_PARAMS,
            ...data.resolvedParams,
          })
        }
      } catch {
        const baseStyle = styles.find(s => s.id === template.styleId)
        if (baseStyle) {
          setParams(baseStyle.parameters)
        }
      }
    },
    [styles],
  )

  const handleContent = useCallback((c: QRContent | null, _err?: string) => {
    setContent(c)
  }, [])

  const qrData = content ? content.data : null

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-0">
      {/* Left panel: input + styles */}
      <div className="w-full lg:w-[360px] lg:flex-shrink-0 space-y-5 overflow-y-auto max-h-[calc(100vh-100px)]">
        <section>
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">内容</h2>
          <ContentInput onContent={handleContent} />
        </section>

        <section>
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">样式</h2>
          {error && (
            <p className="text-sm text-amber-600 mb-2 bg-amber-50 rounded-lg p-2">{error}</p>
          )}
          <StylePanel
            styles={styles}
            templates={templates}
            params={params}
            onParamsChange={setParams}
            onTemplateSelect={handleTemplateSelect}
          />
        </section>
      </div>

      {/* Right panel: preview (sticky on desktop) */}
      <div className="flex-1 flex flex-col items-center justify-start pt-12">
        <div className="lg:sticky lg:top-8">
          <QRPreview data={qrData} params={params} />
        </div>
      </div>
    </div>
  )
}