export type DotShape = 'square' | 'dots' | 'rounded' | 'classy' | 'classy-rounded' | 'extra-rounded'
export type CornerSquareType = 'square' | 'dot' | 'extra-rounded'
export type CornerDotType = 'square' | 'dot'
export type GradientType = 'linear' | 'radial'
export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H'
export type ContentType = 'url' | 'text' | 'wifi' | 'email' | 'phone' | 'sms' | 'vcard'

export interface GradientConfig {
  enabled: boolean
  type: GradientType
  colors: string[]
}

export interface LogoConfig {
  enabled: boolean
  url: string
  size: number
}

export interface StyleParameters {
  dotShape: DotShape
  colorDark: string
  colorLight: string
  gradient: GradientConfig
  cornerSquareType: CornerSquareType
  cornerDotType: CornerDotType
  logo: LogoConfig
  errorCorrection: ErrorCorrectionLevel
}

export interface Style {
  id: string
  name: string
  category: string
  parameters: StyleParameters
}

export interface Template {
  id: string
  name: string
  description: string
  styleId: string
  preview: string
  overrides: Partial<StyleParameters>
}

export interface QRContent {
  type: ContentType
  data: string
}

export interface WiFiFields {
  ssid: string
  password: string
  encryption: 'WPA' | 'WEP' | 'nopass'
}

export interface VCardFields {
  firstName: string
  lastName: string
  phone: string
  email: string
  org: string
}