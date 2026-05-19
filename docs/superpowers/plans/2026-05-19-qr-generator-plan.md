# QR Code Generator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a public QR code generator website with customizable visual styles and templates, PNG/SVG download, supporting all standard content types.

**Architecture:** Next.js App Router with API routes serving style/template JSON config files. Browser-side QR rendering via `qr-code-styling` library. Single-page tool layout with left panel (content input + style controls) and right panel (live QR preview + download).

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, qr-code-styling, Vitest for testing

---

### Task 1: Project Scaffold

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.mjs`
- Create: `tailwind.config.ts`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `app/globals.css`
- Create: `vitest.config.ts`

- [ ] **Step 1: Initialize Next.js project with dependencies**

Run:
```bash
cd /Users/liuwei11/github/ai-qr && npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias="@/*" --turbopack --no-git
```

- [ ] **Step 2: Install additional dependencies**

Run:
```bash
npm install qr-code-styling
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 3: Add vitest config**

Write `vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname),
    },
  },
})
```

- [ ] **Step 4: Verify dev server starts**

Run:
```bash
npm run dev
```
Expected: Next.js dev server starts on localhost:3000, page renders.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: scaffold Next.js project with TypeScript and Tailwind

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 2: Type Definitions

**Files:**
- Create: `lib/types.ts`

- [ ] **Step 1: Write the types file**

Write `lib/types.ts`:
```ts
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
```

- [ ] **Step 2: Verify types compile**

Run:
```bash
npx tsc --noEmit
```
Expected: No type errors.

- [ ] **Step 3: Commit**

```bash
git add lib/types.ts && git commit -m "feat: add TypeScript type definitions

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 3: Content Formatting Utilities

**Files:**
- Create: `lib/format-content.ts`
- Create: `lib/format-content.test.ts`

- [ ] **Step 1: Write failing tests**

Write `lib/format-content.test.ts`:
```ts
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run:
```bash
npx vitest run lib/format-content.test.ts
```
Expected: All tests fail with "formatQRContent is not defined".

- [ ] **Step 3: Implement format-content**

Write `lib/format-content.ts`:
```ts
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
      const auth = `T:${d.encryption}${d.encryption !== 'nopass' ? `;P:${d.password}` : ''}`
      return `WIFI:${auth};S:${d.ssid};;`
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run:
```bash
npx vitest run lib/format-content.test.ts
```
Expected: All 9 tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib/format-content.ts lib/format-content.test.ts && git commit -m "feat: add content formatting utilities

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 4: Sample Style and Template Data Files

**Files:**
- Create: `data/styles/classic.json`
- Create: `data/styles/rounded-dots.json`
- Create: `data/styles/gradient-modern.json`
- Create: `data/templates/tech-gradient.json`
- Create: `data/templates/minimal-dark.json`

- [ ] **Step 1: Create classic style**

Write `data/styles/classic.json`:
```json
{
  "id": "classic",
  "name": "经典黑白",
  "category": "basic",
  "parameters": {
    "dotShape": "square",
    "colorDark": "#000000",
    "colorLight": "#ffffff",
    "gradient": {
      "enabled": false,
      "type": "linear",
      "colors": []
    },
    "cornerSquareType": "square",
    "cornerDotType": "square",
    "logo": {
      "enabled": false,
      "url": "",
      "size": 0.2
    },
    "errorCorrection": "M"
  }
}
```

- [ ] **Step 2: Create rounded dots style**

Write `data/styles/rounded-dots.json`:
```json
{
  "id": "rounded-dots",
  "name": "圆角圆点",
  "category": "modern",
  "parameters": {
    "dotShape": "rounded",
    "colorDark": "#2563eb",
    "colorLight": "#ffffff",
    "gradient": {
      "enabled": false,
      "type": "linear",
      "colors": []
    },
    "cornerSquareType": "extra-rounded",
    "cornerDotType": "dot",
    "logo": {
      "enabled": false,
      "url": "",
      "size": 0.2
    },
    "errorCorrection": "M"
  }
}
```

- [ ] **Step 3: Create gradient modern style**

Write `data/styles/gradient-modern.json`:
```json
{
  "id": "gradient-modern",
  "name": "渐变现代",
  "category": "modern",
  "parameters": {
    "dotShape": "rounded",
    "colorDark": "#1e40af",
    "colorLight": "#ffffff",
    "gradient": {
      "enabled": true,
      "type": "linear",
      "colors": ["#3b82f6", "#8b5cf6"]
    },
    "cornerSquareType": "extra-rounded",
    "cornerDotType": "dot",
    "logo": {
      "enabled": false,
      "url": "",
      "size": 0.2
    },
    "errorCorrection": "H"
  }
}
```

- [ ] **Step 4: Create tech gradient template**

Write `data/templates/tech-gradient.json`:
```json
{
  "id": "tech-gradient",
  "name": "科技渐变",
  "description": "蓝紫渐变，适合科技品牌",
  "styleId": "gradient-modern",
  "preview": "",
  "overrides": {
    "gradient": {
      "enabled": true,
      "type": "linear",
      "colors": ["#06b6d4", "#3b82f6"]
    },
    "colorDark": "#0284c7"
  }
}
```

- [ ] **Step 5: Create minimal dark template**

Write `data/templates/minimal-dark.json`:
```json
{
  "id": "minimal-dark",
  "name": "极简深色",
  "description": "深色圆角，极简风格",
  "styleId": "rounded-dots",
  "preview": "",
  "overrides": {
    "colorDark": "#1e293b",
    "colorLight": "#f8fafc"
  }
}
```

- [ ] **Step 6: Verify JSON is valid**

Run:
```bash
node -e "['classic','rounded-dots','gradient-modern'].forEach(f => { const d = require('./data/styles/'+f+'.json'); console.log(d.id, '- OK') })" && node -e "['tech-gradient','minimal-dark'].forEach(f => { const d = require('./data/templates/'+f+'.json'); console.log(d.id, '- OK') })"
```
Expected: All files printed with "OK".

- [ ] **Step 7: Commit**

```bash
git add data/ && git commit -m "feat: add sample style and template data files

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 5: Server-Side Style Loading Utilities

**Files:**
- Create: `lib/styles.ts`
- Create: `lib/styles.test.ts`

- [ ] **Step 1: Write failing tests**

Write `lib/styles.test.ts`:
```ts
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run:
```bash
npx vitest run lib/styles.test.ts
```
Expected: All tests fail with module not found.

- [ ] **Step 3: Implement styles.ts**

Write `lib/styles.ts`:
```ts
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

function deepMerge<T extends Record<string, unknown>>(target: T, overrides: Partial<T>): T {
  const result = { ...target }
  for (const key of Object.keys(overrides) as (keyof T)[]) {
    const val = overrides[key]
    if (val !== undefined && typeof val === 'object' && !Array.isArray(val) && typeof result[key] === 'object' && !Array.isArray(result[key])) {
      result[key] = deepMerge(result[key] as Record<string, unknown>, val as Record<string, unknown>) as T[keyof T]
    } else if (val !== undefined) {
      result[key] = val as T[keyof T]
    }
  }
  return result
}

export async function resolveTemplate(templateId: string): Promise<StyleParameters> {
  const template = await loadTemplate(templateId)
  const style = await loadStyle(template.styleId)
  return deepMerge(style.parameters, template.overrides as Partial<StyleParameters>)
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run:
```bash
npx vitest run lib/styles.test.ts
```
Expected: All 6 tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib/styles.ts lib/styles.test.ts && git commit -m "feat: add server-side style loading utilities

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 6: API Routes

**Files:**
- Create: `app/api/styles/route.ts`
- Create: `app/api/styles/[id]/route.ts`
- Create: `app/api/templates/route.ts`
- Create: `app/api/templates/[id]/route.ts`

- [ ] **Step 1: Create styles list API**

Write `app/api/styles/route.ts`:
```ts
import { NextResponse } from 'next/server'
import { loadStyles } from '@/lib/styles'

export async function GET() {
  try {
    const styles = await loadStyles()
    return NextResponse.json(styles)
  } catch {
    return NextResponse.json({ error: 'Failed to load styles' }, { status: 500 })
  }
}
```

- [ ] **Step 2: Create single style API**

Write `app/api/styles/[id]/route.ts`:
```ts
import { NextResponse } from 'next/server'
import { loadStyle } from '@/lib/styles'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const style = await loadStyle(id)
    return NextResponse.json(style)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Not found'
    return NextResponse.json({ error: message }, { status: 404 })
  }
}
```

- [ ] **Step 3: Create templates list API**

Write `app/api/templates/route.ts`:
```ts
import { NextResponse } from 'next/server'
import { loadTemplates } from '@/lib/styles'

export async function GET() {
  try {
    const templates = await loadTemplates()
    return NextResponse.json(templates)
  } catch {
    return NextResponse.json({ error: 'Failed to load templates' }, { status: 500 })
  }
}
```

- [ ] **Step 4: Create single template API (with resolved params)**

Write `app/api/templates/[id]/route.ts`:
```ts
import { NextResponse } from 'next/server'
import { loadTemplate, resolveTemplate } from '@/lib/styles'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const [template, resolvedParams] = await Promise.all([
      loadTemplate(id),
      resolveTemplate(id),
    ])
    return NextResponse.json({ ...template, resolvedParams })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Not found'
    return NextResponse.json({ error: message }, { status: 404 })
  }
}
```

- [ ] **Step 5: Verify API endpoints work**

Run dev server in background, then test:
```bash
curl -s http://localhost:3000/api/styles | node -e "process.stdin.resume(); let d=''; process.stdin.on('data',c=>d+=c); process.stdin.on('end',()=>{const j=JSON.parse(d); console.log(j.length+' styles loaded')})"
```
Expected: "3 styles loaded"

```bash
curl -s http://localhost:3000/api/styles/classic | node -e "process.stdin.resume(); let d=''; process.stdin.on('data',c=>d+=c); process.stdin.on('end',()=>{const j=JSON.parse(d); console.log(j.name)})"
```
Expected: "经典黑白"

```bash
curl -s http://localhost:3000/api/templates | node -e "process.stdin.resume(); let d=''; process.stdin.on('data',c=>d+=c); process.stdin.on('end',()=>{const j=JSON.parse(d); console.log(j.length+' templates loaded')})"
```
Expected: "2 templates loaded"

```bash
curl -s http://localhost:3000/api/templates/tech-gradient | node -e "process.stdin.resume(); let d=''; process.stdin.on('data',c=>d+=c); process.stdin.on('end',()=>{const j=JSON.parse(d); console.log(j.name, '- resolved params:', j.resolvedParams.colorDark)})"
```
Expected: "科技渐变 - resolved params: #0284c7"

- [ ] **Step 6: Commit**

```bash
git add app/api/ && git commit -m "feat: add API routes for styles and templates

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 7: QR Renderer (Client-Side)

**Files:**
- Create: `lib/qr-renderer.ts`
- Create: `lib/qr-renderer.test.ts`

- [ ] **Step 1: Write failing tests**

Write `lib/qr-renderer.test.ts`:
```ts
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

  it('builds gradient for qr-code-styling style when gradient enabled', () => {
    const params: StyleParameters = {
      ...defaultParams,
      gradient: { enabled: true, type: 'linear', colors: ['#ff0000', '#0000ff'] },
    }
    const result = buildQROptions(params, 300)
    expect(result.dotsOptions?.gradient).toBeDefined()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run:
```bash
npx vitest run lib/qr-renderer.test.ts
```
Expected: All tests fail.

- [ ] **Step 3: Implement qr-renderer.ts**

Write `lib/qr-renderer.ts`:
```ts
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
    rotation: params.gradient.type === 'linear' ? 0 : 0,
    colorStops: stops,
  }
}

export function buildQROptions(params: StyleParameters, size: number): QROptions {
  const base: QROptions = {
    width: size,
    height: size,
    data: '',
    dotsOptions: {
      color: params.colorDark,
      type: params.dotShape,
      ...(buildGradient(params) && { gradient: buildGradient(params)! }),
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run:
```bash
npx vitest run lib/qr-renderer.test.ts
```
Expected: All 8 tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib/qr-renderer.ts lib/qr-renderer.test.ts && git commit -m "feat: add QR renderer with style parameter mapping

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 8: UI Base Components

**Files:**
- Create: `components/ui/button.tsx`
- Create: `components/ui/select.tsx`
- Create: `components/ui/slider.tsx`
- Create: `components/ui/color-picker.tsx`
- Create: `components/ui/file-upload.tsx`
- Create: `components/ui/accordion.tsx`

- [ ] **Step 1: Create Button component**

Write `components/ui/button.tsx`:
```tsx
import { type ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
  const variants: Record<string, string> = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-500',
    outline: 'border border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-slate-500',
  }
  const sizes: Record<string, string> = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
  }
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  )
}
```

- [ ] **Step 2: Create Select component**

Write `components/ui/select.tsx`:
```tsx
interface SelectProps {
  label?: string
  value: string
  onChange: (value: string) => void
  options: { label: string; value: string }[]
}

export function Select({ label, value, onChange, options }: SelectProps) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}
```

- [ ] **Step 3: Create Slider component**

Write `components/ui/slider.tsx`:
```tsx
interface SliderProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
}

export function Slider({ label, value, min, max, step, onChange }: SliderProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}: {value}
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
    </div>
  )
}
```

- [ ] **Step 4: Create ColorPicker component**

Write `components/ui/color-picker.tsx`:
```tsx
interface ColorPickerProps {
  label: string
  value: string
  onChange: (color: string) => void
}

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <div className="relative">
        <input
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-8 h-8 rounded border border-slate-300 cursor-pointer p-0"
        />
      </div>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-24 h-8 rounded border border-slate-300 px-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}
```

- [ ] **Step 5: Create FileUpload component**

Write `components/ui/file-upload.tsx`:
```tsx
import { useCallback, useState } from 'react'

interface FileUploadProps {
  label: string
  accept: string
  maxSizeKB: number
  onFile: (dataUrl: string | null, error?: string) => void
}

export function FileUpload({ label, accept, maxSizeKB, onFile }: FileUploadProps) {
  const [error, setError] = useState<string | null>(null)

  const handleFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setError(null)
      const file = e.target.files?.[0]
      if (!file) return

      const validTypes = accept.split(',').map(t => t.trim())
      if (!validTypes.some(t => file.name.endsWith(t.replace('.', '')))) {
        const msg = `仅支持 ${accept} 格式`
        setError(msg)
        onFile(null, msg)
        return
      }

      if (file.size > maxSizeKB * 1024) {
        const msg = `文件不能超过 ${maxSizeKB}KB`
        setError(msg)
        onFile(null, msg)
        return
      }

      const reader = new FileReader()
      reader.onload = () => {
        onFile(reader.result as string)
      }
      reader.readAsDataURL(file)
    },
    [accept, maxSizeKB, onFile],
  )

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <input
        type="file"
        accept={accept}
        onChange={handleFile}
        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}
```

- [ ] **Step 6: Create Accordion component**

Write `components/ui/accordion.tsx`:
```tsx
import { useState } from 'react'

interface AccordionProps {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}

export function Accordion({ title, defaultOpen = false, children }: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
      >
        {title}
        <svg
          className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="px-4 pb-4 space-y-3">{children}</div>}
    </div>
  )
}
```

- [ ] **Step 7: Verify compilation**

Run:
```bash
npx tsc --noEmit
```
Expected: No type errors.

- [ ] **Step 8: Commit**

```bash
git add components/ui/ && git commit -m "feat: add base UI components

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 9: Content Input Component

**Files:**
- Create: `components/content-input.tsx`

- [ ] **Step 1: Create ContentInput component**

Write `components/content-input.tsx`:
```tsx
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
      const data = type === 'url' || type === 'text' ? fields.url || fields.text || ''
        : JSON.stringify(fields)
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
            className="w-full h-10 rounded-lg border border-slate-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )
      case 'text':
        return (
          <textarea
            placeholder="输入文本内容..."
            value={fields.text || ''}
            onChange={e => updateField('text', e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        )
      case 'wifi':
        return (
          <div className="space-y-2">
            <input placeholder="网络名 (SSID)" value={fields.ssid || ''} onChange={e => updateField('ssid', e.target.value)} className="w-full h-10 rounded-lg border border-slate-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input placeholder="密码" value={fields.password || ''} onChange={e => updateField('password', e.target.value)} className="w-full h-10 rounded-lg border border-slate-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
            className="w-full h-10 rounded-lg border border-slate-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )
      case 'phone':
        return (
          <input
            type="tel" placeholder="+8613800138000"
            value={fields.phone || ''} onChange={e => updateField('phone', e.target.value)}
            className="w-full h-10 rounded-lg border border-slate-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )
      case 'sms':
        return (
          <div className="space-y-2">
            <input placeholder="电话号码" value={fields.phone || ''} onChange={e => updateField('phone', e.target.value)} className="w-full h-10 rounded-lg border border-slate-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <textarea placeholder="消息内容" value={fields.message || ''} onChange={e => updateField('message', e.target.value)} rows={2} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
        )
      case 'vcard':
        return (
          <div className="space-y-2">
            <input placeholder="姓" value={fields.lastName || ''} onChange={e => updateField('lastName', e.target.value)} className="w-full h-10 rounded-lg border border-slate-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input placeholder="名" value={fields.firstName || ''} onChange={e => updateField('firstName', e.target.value)} className="w-full h-10 rounded-lg border border-slate-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input placeholder="电话" value={fields.phone || ''} onChange={e => updateField('phone', e.target.value)} className="w-full h-10 rounded-lg border border-slate-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input placeholder="邮箱" value={fields.email || ''} onChange={e => updateField('email', e.target.value)} className="w-full h-10 rounded-lg border border-slate-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input placeholder="公司" value={fields.org || ''} onChange={e => updateField('org', e.target.value)} className="w-full h-10 rounded-lg border border-slate-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
```

- [ ] **Step 2: Verify compilation**

Run:
```bash
npx tsc --noEmit
```
Expected: No type errors.

- [ ] **Step 3: Commit**

```bash
git add components/content-input.tsx && git commit -m "feat: add content input component with type switching

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 10: Style Panel Component

**Files:**
- Create: `components/style-panel.tsx`

- [ ] **Step 1: Create StylePanel component**

Write `components/style-panel.tsx`:
```tsx
'use client'

import type { Style, StyleParameters, Template } from '@/lib/types'
import type { DotShape, CornerSquareType, CornerDotType, ErrorCorrectionLevel, GradientType } from '@/lib/types'
import { Select } from './ui/select'
import { Slider } from './ui/slider'
import { ColorPicker } from './ui/color-picker'
import { FileUpload } from './ui/file-upload'
import { Accordion } from './ui/accordion'

interface StylePanelProps {
  styles: Style[]
  templates: Template[]
  params: StyleParameters
  onParamsChange: (params: StyleParameters) => void
  onTemplateSelect: (template: Template) => void
}

const DOT_SHAPE_OPTIONS: { label: string; value: DotShape }[] = [
  { label: '方块', value: 'square' },
  { label: '圆点', value: 'dots' },
  { label: '圆角', value: 'rounded' },
  { label: '经典', value: 'classy' },
  { label: '经典圆角', value: 'classy-rounded' },
  { label: '超圆角', value: 'extra-rounded' },
]

const CORNER_SQUARE_OPTIONS: { label: string; value: CornerSquareType }[] = [
  { label: '方块', value: 'square' },
  { label: '圆点', value: 'dot' },
  { label: '超圆角', value: 'extra-rounded' },
]

const CORNER_DOT_OPTIONS: { label: string; value: CornerDotType }[] = [
  { label: '方块', value: 'square' },
  { label: '圆点', value: 'dot' },
]

const ECC_OPTIONS: { label: string; value: ErrorCorrectionLevel }[] = [
  { label: 'L (7%)', value: 'L' },
  { label: 'M (15%)', value: 'M' },
  { label: 'Q (25%)', value: 'Q' },
  { label: 'H (30%)', value: 'H' },
]

const GRADIENT_TYPE_OPTIONS: { label: string; value: GradientType }[] = [
  { label: '线性', value: 'linear' },
  { label: '径向', value: 'radial' },
]

export function StylePanel({ styles, templates, params, onParamsChange, onTemplateSelect }: StylePanelProps) {
  const update = (patch: Partial<StyleParameters>) => {
    onParamsChange({ ...params, ...patch })
  }

  return (
    <div className="space-y-3">
      {/* Templates */}
      <Accordion title="模板预设" defaultOpen>
        <div className="grid grid-cols-2 gap-2">
          {templates.map(t => (
            <button
              key={t.id}
              onClick={() => onTemplateSelect(t)}
              className="text-left p-2 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-colors text-sm"
            >
              <div className="font-medium text-slate-800 truncate">{t.name}</div>
              <div className="text-xs text-slate-500 truncate">{t.description}</div>
            </button>
          ))}
        </div>
      </Accordion>

      {/* Colors */}
      <Accordion title="颜色">
        <ColorPicker label="深色" value={params.colorDark} onChange={v => update({ colorDark: v })} />
        <ColorPicker label="背景" value={params.colorLight} onChange={v => update({ colorLight: v })} />
      </Accordion>

      {/* Dot Shape */}
      <Accordion title="数据点样式">
        <Select
          value={params.dotShape}
          onChange={v => update({ dotShape: v as DotShape })}
          options={DOT_SHAPE_OPTIONS}
        />
      </Accordion>

      {/* Corner Styles */}
      <Accordion title="定位角样式">
        <Select
          label="外角方块"
          value={params.cornerSquareType}
          onChange={v => update({ cornerSquareType: v as CornerSquareType })}
          options={CORNER_SQUARE_OPTIONS}
        />
        <Select
          label="内角圆点"
          value={params.cornerDotType}
          onChange={v => update({ cornerDotType: v as CornerDotType })}
          options={CORNER_DOT_OPTIONS}
        />
      </Accordion>

      {/* Gradient */}
      <Accordion title="渐变">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={params.gradient.enabled}
            onChange={e => update({ gradient: { ...params.gradient, enabled: e.target.checked } })}
            className="rounded"
          />
          启用渐变
        </label>
        {params.gradient.enabled && (
          <div className="space-y-2">
            <Select
              value={params.gradient.type}
              onChange={v => update({ gradient: { ...params.gradient, type: v as GradientType } })}
              options={GRADIENT_TYPE_OPTIONS}
            />
            {params.gradient.colors.map((c, i) => (
              <ColorPicker
                key={i}
                label={`颜色 ${i + 1}`}
                value={c}
                onChange={v => {
                  const colors = [...params.gradient.colors]
                  colors[i] = v
                  update({ gradient: { ...params.gradient, colors } })
                }}
              />
            ))}
            <div className="flex gap-1">
              <button
                onClick={() => update({ gradient: { ...params.gradient, colors: [...params.gradient.colors, '#000000'] } })}
                className="flex-1 h-8 text-xs rounded border border-slate-300 hover:bg-slate-50"
              >
                + 添加色标
              </button>
              {params.gradient.colors.length > 2 && (
                <button
                  onClick={() => update({ gradient: { ...params.gradient, colors: params.gradient.colors.slice(0, -1) } })}
                  className="flex-1 h-8 text-xs rounded border border-slate-300 hover:bg-slate-50 text-red-500"
                >
                  - 移除色标
                </button>
              )}
            </div>
          </div>
        )}
      </Accordion>

      {/* Logo */}
      <Accordion title="Logo / 图标">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={params.logo.enabled}
            onChange={e => update({ logo: { ...params.logo, enabled: e.target.checked } })}
            className="rounded"
          />
          启用 Logo
        </label>
        {params.logo.enabled && (
          <div className="space-y-2">
            <FileUpload
              label="上传 logo"
              accept=".png,.svg"
              maxSizeKB={200}
              onFile={(url, err) => {
                if (url) update({ logo: { ...params.logo, url } })
              }}
            />
            <Slider
              label="大小比例"
              value={params.logo.size}
              min={0.1}
              max={0.35}
              step={0.05}
              onChange={v => update({ logo: { ...params.logo, size: v } })}
            />
          </div>
        )}
      </Accordion>

      {/* Error Correction */}
      <Accordion title="纠错等级">
        <Select
          value={params.errorCorrection}
          onChange={v => update({ errorCorrection: v as ErrorCorrectionLevel })}
          options={ECC_OPTIONS}
        />
        <p className="text-xs text-slate-500">
          高纠错可容纳更大的 Logo，但会增加码的密度
        </p>
      </Accordion>
    </div>
  )
}
```

- [ ] **Step 2: Verify compilation**

Run:
```bash
npx tsc --noEmit
```
Expected: No type errors.

- [ ] **Step 3: Commit**

```bash
git add components/style-panel.tsx && git commit -m "feat: add style panel with template selector and parameter controls

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 11: QR Preview Component

**Files:**
- Create: `components/qr-preview.tsx`

- [ ] **Step 1: Create QRPreview component**

Write `components/qr-preview.tsx`:
```tsx
'use client'

import { useEffect, useRef, useCallback } from 'react'
import QRCodeStyling from 'qr-code-styling'
import type { StyleParameters } from '@/lib/types'
import { buildQROptions } from '@/lib/qr-renderer'
import { Button } from './ui/button'

interface QRPreviewProps {
  data: string | null
  params: StyleParameters
}

export function QRPreview({ data, params }: QRPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const qrRef = useRef<QRCodeStyling | null>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const opts = buildQROptions(params, 280)
    opts.data = data || ''

    if (!qrRef.current) {
      qrRef.current = new QRCodeStyling(opts)
      qrRef.current.append(containerRef.current)
    } else {
      qrRef.current.update(opts)
    }
  }, [data, params])

  const handleDownload = useCallback(
    (extension: 'png' | 'svg') => {
      if (!qrRef.current || !data) return
      qrRef.current.download({ extension, name: `qr-code` })
    },
    [data],
  )

  const hasData = data && data.length > 0

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        ref={containerRef}
        className={`w-[280px] h-[280px] flex items-center justify-center rounded-xl bg-white ${
          !hasData ? 'border-2 border-dashed border-slate-300' : ''
        }`}
      >
        {!hasData && (
          <div className="text-center text-slate-400">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2.48a2.5 2.5 0 00-4.52-3m10.04-5a2.5 2.5 0 00-3.52-3M8.48 20H6.5" />
            </svg>
            <p className="text-sm">输入内容后自动生成</p>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          variant="primary"
          size="sm"
          disabled={!hasData}
          onClick={() => handleDownload('png')}
        >
          下载 PNG
        </Button>
        <Button
          variant="secondary"
          size="sm"
          disabled={!hasData}
          onClick={() => handleDownload('svg')}
        >
          下载 SVG
        </Button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify compilation**

Run:
```bash
npx tsc --noEmit
```
Expected: No type errors.

- [ ] **Step 3: Commit**

```bash
git add components/qr-preview.tsx && git commit -m "feat: add QR preview component with download buttons

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 12: QR Generator Container and Main Page

**Files:**
- Create: `components/qr-generator.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create QRGenerator container**

Write `components/qr-generator.tsx`:
```tsx
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
  gradient: { enabled: false, type: 'linear', colors: ['#3b82f6', '#8b5cf6'] },
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
      <div className="w-full lg:w-[400px] lg:flex-shrink-0 space-y-4 overflow-y-auto max-h-[calc(100vh-120px)] pr-2">
        <section>
          <h2 className="text-lg font-semibold text-slate-800 mb-3">内容</h2>
          <ContentInput onContent={handleContent} />
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-800 mb-3">样式</h2>
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
      <div className="flex-1 flex flex-col items-center justify-start pt-4">
        <div className="lg:sticky lg:top-6">
          <QRPreview data={qrData} params={params} />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Update main page**

Read `app/page.tsx` first, then write it:
```tsx
import { QRGenerator } from '@/components/qr-generator'

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 p-4 lg:p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">AI QR</h1>
        <p className="text-sm text-slate-500 mt-1">在线二维码生成器 — 支持多种样式与全类型内容</p>
      </header>
      <QRGenerator />
    </main>
  )
}
```

- [ ] **Step 3: Verify compilation and dev server**

Run:
```bash
npx tsc --noEmit
```
Expected: No type errors.

Start dev server and verify the page renders at http://localhost:3000.

- [ ] **Step 4: Commit**

```bash
git add components/qr-generator.tsx app/page.tsx && git commit -m "feat: wire up QR generator container and main page

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 13: Layout and Global Styles Polish

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Update layout with metadata**

Read `app/layout.tsx` first, then write it:
```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI QR - 在线二维码生成器',
  description: '支持多种样式和模板，可下载 PNG/SVG。支持 URL、文本、WiFi、邮箱、电话、短信、vCard 全部类型。',
  keywords: '二维码, QR code, 二维码生成, QR生成器, 二维码样式',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
```

- [ ] **Step 2: Update global CSS**

Read `app/globals.css` first, then write it:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}
```

- [ ] **Step 3: Full verification**

Run:
```bash
npx tsc --noEmit && npx vitest run
```
Expected: No type errors, all tests pass.

Start `npm run dev` and verify:
- Page renders with header and layout
- Content type selector works
- QR code generates and updates when input changes
- Style parameters change QR appearance in real time
- PNG and SVG download work
- Template selection applies styles

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx app/globals.css && git commit -m "feat: polish layout metadata and global styles

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 14: Final Integration Test and Cleanup

**Files:**
- Modify: `package.json` (add test script if missing)

- [ ] **Step 1: Ensure test script exists**

Check `package.json` has:
```json
"scripts": {
  "test": "vitest run"
}
```
If not, add it.

- [ ] **Step 2: Run full test suite**

Run:
```bash
npm test
```
Expected: All tests pass (format-content + styles + qr-renderer).

- [ ] **Step 3: Run type check**

Run:
```bash
npx tsc --noEmit
```
Expected: No type errors.

- [ ] **Step 4: Build production**

Run:
```bash
npm run build
```
Expected: Build succeeds without errors.

- [ ] **Step 5: Commit final state**

```bash
git add -A && git commit -m "chore: final integration check, all tests passing

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```