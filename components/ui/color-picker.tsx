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
        className="w-24 h-8 rounded border border-gray-300 px-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-gray-400"
      />
    </div>
  )
}