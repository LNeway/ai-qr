import { describe, it, expect } from 'vitest'
import { buildQROptions } from './qr-renderer'
import type { StyleParameters } from './types'

const defaultParams: StyleParameters = {
  dotShape: 'square',
  colorDark: '#000000',
  colorLight: '#ffffff',
  gradient: { enabled: false, type: 'linear', colors: [] },
  cornerSquareType: 'square',
  cornerDotType: 'square',
  logo: { enabled: false, url: '', size: 0.2 },
  errorCorrection: 'M',
}

describe('buildQROptions', () => {
  it('returns correct width and height', () => {
    const opts = buildQROptions(defaultParams, 300)
    expect(opts.width).toBe(300)
    expect(opts.height).toBe(300)
  })

  it('passes dot options', () => {
    const opts = buildQROptions(defaultParams, 300)
    expect(opts.dotsOptions).toEqual({ color: '#000000', type: 'square' })
  })

  it('passes corner options', () => {
    const opts = buildQROptions(defaultParams, 300)
    expect(opts.cornersSquareOptions).toEqual({ color: '#000000', type: 'square' })
    expect(opts.cornersDotOptions).toEqual({ color: '#000000', type: 'square' })
  })

  it('passes background options', () => {
    const opts = buildQROptions(defaultParams, 300)
    expect(opts.backgroundOptions).toEqual({ color: '#ffffff' })
  })

  it('includes image options when logo is enabled', () => {
    const params = {
      ...defaultParams,
      logo: { enabled: true, url: 'https://example.com/logo.png', size: 0.3 },
    }
    const opts = buildQROptions(params, 300)
    expect(opts.imageOptions?.imageSize).toBe(0.3)
  })

  it('omits image when logo is disabled', () => {
    const opts = buildQROptions(defaultParams, 300)
    expect(opts.imageOptions).toBeUndefined()
  })

  it('passes error correction level', () => {
    const params = { ...defaultParams, errorCorrection: 'H' as const }
    const opts = buildQROptions(params, 300)
    expect(opts.qrOptions?.errorCorrectionLevel).toBe('H')
  })

  it('builds gradient when gradient enabled', () => {
    const params: StyleParameters = {
      ...defaultParams,
      gradient: { enabled: true, type: 'linear', colors: ['#ff0000', '#0000ff'] },
    }
    const result = buildQROptions(params, 300)
    expect(result.dotsOptions?.gradient).toBeDefined()
  })
})
