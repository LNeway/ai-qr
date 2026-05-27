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
              className="text-left p-2 rounded-lg border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
            >
              <div className="font-normal text-gray-700 truncate">{t.name}</div>
              <div className="text-xs text-gray-400 truncate">{t.description}</div>
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
                className="flex-1 h-8 text-xs rounded border border-gray-200 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
              >
                + 添加色标
              </button>
              {params.gradient.colors.length > 2 && (
                <button
                  onClick={() => update({ gradient: { ...params.gradient, colors: params.gradient.colors.slice(0, -1) } })}
                  className="flex-1 h-8 text-xs rounded border border-gray-200 hover:bg-gray-50 text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
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
              onFile={(url) => {
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
        <p className="text-xs text-gray-500">
          高纠错可容纳更大的 Logo，但会增加码的密度
        </p>
      </Accordion>
    </div>
  )
}