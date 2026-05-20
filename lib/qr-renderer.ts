import type { StyleParameters } from './types'

export interface QROptions {
  width: number
  height: number
  data: string
  dotsOptions: {
    color: string
    type: string
    gradient?: {
      type: 'linear' | 'radial'
      rotation: number
      colorStops: { offset: number; color: string }[]
    }
  }
  cornersSquareOptions: { color: string; type: string }
  cornersDotOptions: { color: string; type: string }
  backgroundOptions: { color: string }
  imageOptions?: { crossOrigin: string; margin: number; imageSize: number; image: string }
  qrOptions: { errorCorrectionLevel: string }
}

function buildGradient(params: StyleParameters) {
  if (!params.gradient.enabled || params.gradient.colors.length < 2) return undefined
  const stops = params.gradient.colors.map((color, i) => ({
    offset: i / (params.gradient.colors.length - 1),
    color,
  }))
  return {
    type: params.gradient.type,
    rotation: 0,
    colorStops: stops,
  }
}

export function buildQROptions(params: StyleParameters, size: number): QROptions {
  const gradient = buildGradient(params)
  const base: QROptions = {
    width: size,
    height: size,
    data: '',
    dotsOptions: {
      color: params.colorDark,
      type: params.dotShape,
      ...(gradient && { gradient }),
    },
    cornersSquareOptions: {
      color: params.colorDark,
      type: params.cornerSquareType,
    },
    cornersDotOptions: {
      color: params.colorDark,
      type: params.cornerDotType,
    },
    backgroundOptions: {
      color: params.colorLight,
    },
    qrOptions: {
      errorCorrectionLevel: params.errorCorrection,
    },
  }

  if (params.logo.enabled && params.logo.url) {
    base.imageOptions = {
      crossOrigin: 'anonymous',
      margin: 4,
      imageSize: params.logo.size,
      image: params.logo.url,
    }
  }

  return base
}
