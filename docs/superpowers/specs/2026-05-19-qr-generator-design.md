# QR Code Generator Website Design Spec

**Date**: 2026-05-19
**Status**: Approved

## Overview

A public QR code generation website built with Next.js, supporting multiple visual styles and templates. Users can freely customize all QR code parameters (dot shape, color, gradient, corner style, logo, error correction level) and download the result as PNG or SVG. Styles and templates are managed as JSON configuration files, served via API routes.

## Tech Stack

- **Framework**: Next.js (App Router)
- **QR Library**: `qrcode` (npm package, browser-side rendering)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Deployment**: Static-capable with API routes (Vercel or similar)

## Architecture

```
ai-qr/
├── data/
│   ├── styles/              # Style definition JSON files
│   └── templates/           # Template preset JSON files (inherit styles + overrides)
├── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Main page (QR generator)
│   └── api/
│       ├── styles/
│       │   ├── route.ts     # GET /api/styles (list all)
│       │   └── [id]/
│       │       └── route.ts # GET /api/styles/:id
│       └── templates/
│           ├── route.ts     # GET /api/templates (list all)
│           └── [id]/
│               └── route.ts # GET /api/templates/:id
├── components/
│   ├── qr-generator.tsx     # Main container: state management + composition
│   ├── content-input.tsx    # Content type selector + input
│   ├── style-panel.tsx      # Style parameter controls
│   ├── qr-preview.tsx       # Live QR preview + download
│   └── ui/                  # Base UI components (button, select, slider, etc.)
├── lib/
│   ├── qr-renderer.ts       # qrcode lib wrapper, style application
│   ├── styles.ts            # Style/template loading utilities (server-side)
│   └── types.ts             # TypeScript type definitions
└── public/                  # Static assets
```

### Core Principle

- QR content processing and rendering is entirely browser-side (`qrcode` library + Canvas/SVG)
- Styles and templates are read from JSON files on the server, served via API routes
- No database required — configuration files are the source of truth
- No authentication — fully public tool

## Data Models

### Style JSON

```json
{
  "id": "rounded-dots",
  "name": "彩色圆点",
  "category": "modern",
  "parameters": {
    "dotShape": "dots",        // squares | dots | rounded
    "colorDark": "#2563eb",
    "colorLight": "#ffffff",
    "gradient": {
      "enabled": true,
      "type": "radial",        // linear | radial
      "colors": ["#3b82f6", "#8b5cf6"]
    },
    "cornerStyle": "rounded",  // square | rounded | circle
    "logo": {
      "enabled": false,
      "url": "",
      "size": 0.2             // ratio of QR area
    },
    "errorCorrection": "M"     // L | M | Q | H
  }
}
```

### Template JSON

```json
{
  "id": "tech-gradient",
  "name": "科技渐变",
  "description": "适合科技品牌链接",
  "styleId": "rounded-dots",
  "preview": "/previews/tech-gradient.png",
  "overrides": {
    "gradient": { "colors": ["#06b6d4", "#3b82f6"] },
    "colorDark": "#0284c7"
  }
}
```

Templates inherit a base style and optionally override specific parameters. This avoids duplication — new templates only define deltas.

## Component Design

### Data Flow

```
ContentInput ──(type + content)──┐
                                  ↓
StylePanel ──(template + params)──→ qr-generator (state container)
                                       ↓
                                  qr-preview → qr-renderer → Canvas/SVG → Download
```

State management: all state held in `qr-generator` via `useState`, passed down as props. No state management library needed at this scale.

### Components

- **qr-generator**: Main container, holds all state (content, selected template, style params), fetches styles/templates on mount
- **content-input**: Content type selector (URL, text, WiFi, email, phone, SMS, vCard) + type-specific input fields, validates content
- **style-panel**: Template card grid + collapsible parameter groups (color, shape, gradient, logo, error correction), real-time preview update on change
- **qr-preview**: Canvas/SVG element for QR display, PNG/SVG download buttons, download triggered from canvas ref
- **ui/**: Reusable base components — Button, Select, Slider, ColorPicker, FileUpload, Accordion

## Page Layout

```
┌──────────────────────────────────────┐
│  ┌──────────────┐ ┌────────────────┐ │
│  │ Content Input│ │  QR Preview    │ │
│  │ [Type]       │ │  ┌──────────┐  │ │
│  │ [Input]      │ │  │ QR Code  │  │ │
│  ├──────────────┤ │  └──────────┘  │ │
│  │ Style Panel  │ │  [PNG] [SVG]  │ │
│  │ [Templates]  │ │                │ │
│  │ [Color]      │ │                │ │
│  │ [Shape]      │ │                │ │
│  │ [Gradient]   │ │                │ │
│  │ [Logo]       │ │                │ │
│  │ [ECC Level]  │ │                │ │
│  └──────────────┘ └────────────────┘ │
└──────────────────────────────────────┘
```

- Left: scrollable input + control panel
- Right: fixed-position QR preview, always visible
- Responsive: stacks vertically on mobile (input on top, preview below)
- Style parameter groups use accordion (collapsible)
- Template selector: card grid with hover preview

## Error Handling

| Scenario | Behavior |
|----------|----------|
| Empty content | Disable QR preview, show placeholder |
| Content exceeds 2953 bytes (QR max) | Show inline error, block rendering |
| Logo upload > 200KB | Show error, ignore logo |
| Logo not PNG/SVG | Show error, reject file |
| Canvas not ready | Disable download buttons |
| API fetch failure | Show error toast, allow manual style editing |

## Testing Strategy

- **lib/qr-renderer.ts**: Unit tests — verify correct qrcode configuration output for various parameter combinations
- **lib/styles.ts**: Unit tests — verify JSON file reading and parsing
- **Components**: TypeScript type safety for data flow correctness; no E2E tests at this stage

## Out of Scope

- User accounts / authentication
- QR scan analytics / tracking
- Admin UI for style management (edit JSON files directly)
- Bulk QR code generation
- Short URL service
- Database integration