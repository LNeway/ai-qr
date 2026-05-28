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
      {label && <label htmlFor={id} className="block text-sm font-semibold text-purple-800 mb-1.5">{label}</label>}
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full h-10 appearance-none rounded-lg border border-purple-200 bg-white pl-3 pr-8 text-sm text-gray-800 transition-all hover:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 cursor-pointer"
        >
          {options.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5">
          <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
        </div>
      </div>
    </div>
  )
}
