import { type ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
  const variants: Record<string, string> = {
    primary: 'bg-purple-600 text-white hover:bg-purple-700 shadow-sm shadow-purple-200 hover:shadow-md hover:shadow-purple-300 focus:ring-purple-400 active:scale-[0.98]',
    secondary: 'bg-purple-100 text-purple-700 hover:bg-purple-200 shadow-sm hover:shadow focus:ring-purple-400',
    outline: 'border-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 focus:ring-purple-400',
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