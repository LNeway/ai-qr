import { useId } from 'react'

interface ColorPickerProps {
  label: string
  value: string
  onChange: (color: string) => void
}

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  const id = useId()
  return (
    <div className="flex items-center gap-2">
      <label htmlFor={id} className="text-sm font-semibold text-purple-800">{label}</label>
      <input
        id={id}
        type="color"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-8 h-8 rounded border border-purple-200 cursor-pointer p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-1"
      />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-24 h-8 rounded border border-purple-200 px-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-400"
      />
    </div>
  )
}