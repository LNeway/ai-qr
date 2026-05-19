import { describe, it, expect } from 'vitest'
import { formatQRContent } from './format-content'

describe('formatQRContent', () => {
  it('returns URL as-is', () => {
    expect(formatQRContent('url', 'https://example.com')).toBe('https://example.com')
  })

  it('returns text as-is', () => {
    expect(formatQRContent('text', 'hello world')).toBe('hello world')
  })

  it('formats email as mailto:', () => {
    expect(formatQRContent('email', 'user@example.com')).toBe('mailto:user@example.com')
  })

  it('formats phone as tel:', () => {
    expect(formatQRContent('phone', '+1234567890')).toBe('tel:+1234567890')
  })

  it('formats SMS', () => {
    const data = JSON.stringify({ phone: '+1234567890', message: 'hi' })
    const result = formatQRContent('sms', data)
    expect(result).toBe('SMSTO:+1234567890:hi')
  })

  it('formats WiFi with WPA', () => {
    const data = JSON.stringify({ ssid: 'MyNet', password: 'pass123', encryption: 'WPA' })
    const result = formatQRContent('wifi', data)
    expect(result).toBe('WIFI:T:WPA;S:MyNet;P:pass123;;')
  })

  it('formats WiFi with no password', () => {
    const data = JSON.stringify({ ssid: 'OpenNet', password: '', encryption: 'nopass' })
    const result = formatQRContent('wifi', data)
    expect(result).toBe('WIFI:T:nopass;S:OpenNet;;')
  })

  it('formats vCard', () => {
    const data = JSON.stringify({
      firstName: 'Zhang',
      lastName: 'San',
      phone: '+8613800138000',
      email: 'zhangsan@example.com',
      org: 'Acme Inc',
    })
    const result = formatQRContent('vcard', data)
    expect(result).toContain('BEGIN:VCARD')
    expect(result).toContain('FN:Zhang San')
    expect(result).toContain('TEL:+8613800138000')
    expect(result).toContain('EMAIL:zhangsan@example.com')
    expect(result).toContain('ORG:Acme Inc')
    expect(result).toContain('END:VCARD')
  })

  it('throws on unknown content type', () => {
    expect(() => formatQRContent('unknown' as any, '')).toThrow('Unknown content type')
  })
})
