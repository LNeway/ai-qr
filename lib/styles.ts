import { readFile, readdir } from 'fs/promises'
import path from 'path'
import type { Style, StyleParameters, Template } from './types'

const DATA_DIR = path.join(process.cwd(), 'data')

export async function loadStyles(): Promise<Style[]> {
  const dir = path.join(DATA_DIR, 'styles')
  const files = await readdir(dir)
  const styles: Style[] = []
  for (const file of files.filter(f => f.endsWith('.json'))) {
    const content = await readFile(path.join(dir, file), 'utf-8')
    styles.push(JSON.parse(content) as Style)
  }
  return styles.sort((a, b) => a.name.localeCompare(b.name))
}

export async function loadStyle(id: string): Promise<Style> {
  const filePath = path.join(DATA_DIR, 'styles', `${id}.json`)
  try {
    const content = await readFile(filePath, 'utf-8')
    return JSON.parse(content) as Style
  } catch {
    throw new Error(`Style not found: ${id}`)
  }
}

export async function loadTemplates(): Promise<Template[]> {
  const dir = path.join(DATA_DIR, 'templates')
  const files = await readdir(dir)
  const templates: Template[] = []
  for (const file of files.filter(f => f.endsWith('.json'))) {
    const content = await readFile(path.join(dir, file), 'utf-8')
    templates.push(JSON.parse(content) as Template)
  }
  return templates
}

export async function loadTemplate(id: string): Promise<Template> {
  const filePath = path.join(DATA_DIR, 'templates', `${id}.json`)
  try {
    const content = await readFile(filePath, 'utf-8')
    return JSON.parse(content) as Template
  } catch {
    throw new Error(`Template not found: ${id}`)
  }
}

function deepMerge<T>(target: T, overrides: Partial<T>): T {
  const result = { ...target } as Record<string, unknown>
  for (const key of Object.keys(overrides as Record<string, unknown>)) {
    const val = (overrides as Record<string, unknown>)[key]
    if (val !== undefined && typeof val === 'object' && !Array.isArray(val) && typeof result[key] === 'object' && !Array.isArray(result[key])) {
      result[key] = deepMerge(result[key], val)
    } else if (val !== undefined) {
      result[key] = val
    }
  }
  return result as T
}

export async function resolveTemplate(templateId: string): Promise<StyleParameters> {
  const template = await loadTemplate(templateId)
  const style = await loadStyle(template.styleId)
  return deepMerge(style.parameters, template.overrides as Partial<StyleParameters>)
}
