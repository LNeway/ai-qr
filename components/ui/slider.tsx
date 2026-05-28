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
      <label className="block text-sm font-semibold text-purple-800 mb-2">
        {label}: <span className="text-purple-600">{value}</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-2 bg-purple-100 rounded-full appearance-none cursor-pointer accent-purple-500 hover:accent-purple-600 transition-all"
      />
    </div>
  )
}