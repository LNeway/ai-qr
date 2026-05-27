'use client'

import { useState, useCallback, useEffect } from 'react'
import type { ContentType, QRContent } from '@/lib/types'
import { formatQRContent } from '@/lib/format-content'
import { Select } from './ui/select'

const CONTENT_TYPES: { label: string; value: ContentType }[] = [
  { label: 'URL 链接', value: 'url' },
  { label: '文本', value: 'text' },
  { label: 'WiFi 网络', value: 'wifi' },
  { label: '邮箱', value: 'email' },
  { label: '电话', value: 'phone' },
  { label: '短信', value: 'sms' },
  { label: 'vCard 名片', value: 'vcard' },
]

interface ContentInputProps {
  onContent: (content: QRContent | null, error?: string) => void
}

export function ContentInput({ onContent }: ContentInputProps) {
  const [type, setType] = useState<ContentType>('url')
  const [fields, setFields] = useState<Record<string, string>>({})

  const updateField = (name: string, value: string) => {
    setFields(prev => ({ ...prev, [name]: value }))
  }

  const emit = useCallback(() => {
    try {
      const data = type === 'url' || type === 'text' ? (fields.url || fields.text || '') : JSON.stringify(fields)
      if (!data && type === 'url') {
        onContent(null, '请输入内容')
        return
      }
      const formatted = formatQRContent(type, data || '{}')
      onContent({ type, data: formatted })
    } catch {
      onContent(null, '内容格式有误')
    }
  }, [type, fields, onContent])

  useEffect(() => { emit() }, [emit])

  const renderFields = () => {
    switch (type) {
      case 'url':
        return (
          <input
            type="url"
            placeholder="https://example.com"
            value={fields.url || ''}
            onChange={e => updateField('url', e.target.value)}
            className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        )
      case 'text':
        return (
          <textarea
            placeholder="输入文本内容…"
            value={fields.text || ''}
            onChange={e => updateField('text', e.target.value)}
            rows={3}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
          />
        )
      case 'wifi':
        return (
          <div className="space-y-2">
            <input placeholder="网络名 (SSID)" value={fields.ssid || ''} onChange={e => updateField('ssid', e.target.value)} className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400" />
            <input placeholder="密码" value={fields.password || ''} onChange={e => updateField('password', e.target.value)} className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400" />
            <Select
              value={fields.encryption || 'WPA'}
              onChange={v => updateField('encryption', v)}
              options={[{ label: 'WPA/WPA2', value: 'WPA' }, { label: 'WEP', value: 'WEP' }, { label: '无密码', value: 'nopass' }]}
            />
          </div>
        )
      case 'email':
        return (
          <input
            type="email" placeholder="user@example.com"
            value={fields.email || ''} onChange={e => updateField('email', e.target.value)}
            className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        )
      case 'phone':
        return (
          <input
            type="tel" placeholder="+8613800138000"
            value={fields.phone || ''} onChange={e => updateField('phone', e.target.value)}
            className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        )
      case 'sms':
        return (
          <div className="space-y-2">
            <input placeholder="电话号码" value={fields.phone || ''} onChange={e => updateField('phone', e.target.value)} className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400" />
            <textarea placeholder="消息内容" value={fields.message || ''} onChange={e => updateField('message', e.target.value)} rows={2} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none" />
          </div>
        )
      case 'vcard':
        return (
          <div className="space-y-2">
            <input placeholder="姓" value={fields.lastName || ''} onChange={e => updateField('lastName', e.target.value)} className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400" />
            <input placeholder="名" value={fields.firstName || ''} onChange={e => updateField('firstName', e.target.value)} className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400" />
            <input placeholder="电话" value={fields.phone || ''} onChange={e => updateField('phone', e.target.value)} className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400" />
            <input placeholder="邮箱" value={fields.email || ''} onChange={e => updateField('email', e.target.value)} className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400" />
            <input placeholder="公司" value={fields.org || ''} onChange={e => updateField('org', e.target.value)} className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400" />
          </div>
        )
    }
  }

  return (
    <div className="space-y-3">
      <Select
        label="内容类型"
        value={type}
        onChange={v => { setType(v as ContentType); setFields({}) }}
        options={CONTENT_TYPES}
      />
      {renderFields()}
    </div>
  )
}