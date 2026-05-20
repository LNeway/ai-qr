import { describe, it, expect } from 'vitest'
import { loadStyles, loadTemplates, loadStyle, loadTemplate, resolveTemplate } from './styles'
import type { Style, Template } from './types'

describe('loadStyles', () => {
  it('returns all styles from data/styles/', async () => {
    const styles = await loadStyles()
    expect(styles.length).toBeGreaterThanOrEqual(3)
    expect(styles[0]).toHaveProperty('id')
    expect(styles[0]).toHaveProperty('parameters')
  })
})

describe('loadTemplates', () => {
  it('returns all templates from data/templates/', async () => {
    const templates = await loadTemplates()
    expect(templates.length).toBeGreaterThanOrEqual(2)
    expect(templates[0]).toHaveProperty('styleId')
  })
})

describe('loadStyle', () => {
  it('returns a single style by id', async () => {
    const style = await loadStyle('classic')
    expect(style.id).toBe('classic')
    expect(style.parameters.dotShape).toBe('square')
  })

  it('throws for nonexistent style', async () => {
    await expect(loadStyle('nonexistent')).rejects.toThrow('Style not found')
  })
})

describe('loadTemplate', () => {
  it('returns a single template by id', async () => {
    const template = await loadTemplate('tech-gradient')
    expect(template.id).toBe('tech-gradient')
    expect(template.styleId).toBe('gradient-modern')
  })

  it('throws for nonexistent template', async () => {
    await expect(loadTemplate('nonexistent')).rejects.toThrow('Template not found')
  })
})

describe('resolveTemplate', () => {
  it('merges template overrides onto base style parameters', async () => {
    const params = await resolveTemplate('tech-gradient')
    expect(params.colorDark).toBe('#0284c7')
    expect(params.gradient.colors).toEqual(['#06b6d4', '#3b82f6'])
    expect(params.dotShape).toBe('rounded') // inherited from base style
  })
})
