import { type ComponentProps } from 'react'

interface FormInputProps extends ComponentProps<'input'> {
  label: string
}

export function FormInput({ label, className, ...props }: FormInputProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 ml-1">
        {label}
      </label>
      <input
        className={`w-full bg-black text-white border-b border-white/30 focus:border-white px-4 py-3 outline-none transition-colors duration-300 placeholder:text-gray-700 ${className}`}
        {...props}
      />
    </div>
  )
}
