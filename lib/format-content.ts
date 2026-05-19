import type { ContentType, WiFiFields, VCardFields } from './types'

export function formatQRContent(type: ContentType, raw: string): string {
  switch (type) {
    case 'url':
    case 'text':
      return raw
    case 'email':
      return `mailto:${raw}`
    case 'phone':
      return `tel:${raw}`
    case 'sms': {
      const d = JSON.parse(raw) as { phone: string; message: string }
      return `SMSTO:${d.phone}:${d.message}`
    }
    case 'wifi': {
      const d = JSON.parse(raw) as WiFiFields
      const parts = [`T:${d.encryption}`, `S:${d.ssid}`]
      if (d.encryption !== 'nopass') {
        parts.push(`P:${d.password}`)
      }
      return `WIFI:${parts.join(';')};;`
    }
    case 'vcard': {
      const d = JSON.parse(raw) as VCardFields
      return [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `FN:${d.firstName} ${d.lastName}`,
        `N:${d.lastName};${d.firstName};;;`,
        `TEL:${d.phone}`,
        `EMAIL:${d.email}`,
        `ORG:${d.org}`,
        'END:VCARD',
      ].join('\n')
    }
    default:
      throw new Error(`Unknown content type: ${type}`)
  }
}
