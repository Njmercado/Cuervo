import { type ComponentProps } from 'react'

interface Option {
  label: string
  value: string
}

interface FormSelectProps extends ComponentProps<'select'> {
  label: string
  options: (string | Option)[]
  placeholder?: string
}

export function FormSelect({ label, options, placeholder = 'Select an option', className, ...props }: FormSelectProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 ml-1">
        {label}
      </label>
      <select
        className={`w-full bg-black text-white border-b border-white/30 focus:border-white px-4 py-3 outline-none transition-colors duration-300 cursor-pointer appearance-none ${className}`}
        {...props}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((opt) => {
          const label = typeof opt === 'string' ? opt : opt.label
          const value = typeof opt === 'string' ? opt : opt.value
          return <option key={value} value={value}>{label}</option>
        })}
      </select>
    </div>
  )
}
