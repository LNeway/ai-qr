import { useId } from 'react'

interface SelectProps {
  label?: string
  value: string
  onChange: (value: string) => void
  options: { label: string; value: string }[]
}

export function Select({ label, value, onChange, options }: SelectProps) {
  const id = useId()
  return (
    <div>
      {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <select
        id={id}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}