export interface Style {
  id: string
  name: string
  parameters: StyleParameters
}

export interface StyleParameters {
  dotShape: 'square' | 'circle' | 'rounded'
  colorDark: string
  colorLight: string
  gradient: {
    enabled: boolean
    colors: string[]
  }
}

export interface Template {
  id: string
  name: string
  styleId: string
  overrides: Partial<StyleParameters>
}
