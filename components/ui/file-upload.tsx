'use client'

import { useCallback, useState } from 'react'

interface FileUploadProps {
  label: string
  accept: string
  maxSizeKB: number
  onFile: (dataUrl: string | null, error?: string) => void
}

export function FileUpload({ label, accept, maxSizeKB, onFile }: FileUploadProps) {
  const [error, setError] = useState<string | null>(null)

  const handleFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setError(null)
      const file = e.target.files?.[0]
      if (!file) return

      const validTypes = accept.split(',').map(t => t.trim())
      if (!validTypes.some(t => file.name.endsWith(t.replace('.', '')))) {
        const msg = `仅支持 ${accept} 格式`
        setError(msg)
        onFile(null, msg)
        return
      }

      if (file.size > maxSizeKB * 1024) {
        const msg = `文件不能超过 ${maxSizeKB}KB`
        setError(msg)
        onFile(null, msg)
        return
      }

      const reader = new FileReader()
      reader.onload = () => {
        onFile(reader.result as string)
      }
      reader.readAsDataURL(file)
    },
    [accept, maxSizeKB, onFile],
  )

  return (
    <div>
      <label className="block text-sm font-semibold text-purple-800 mb-1.5">{label}</label>
      <input
        type="file"
        accept={accept}
        onChange={handleFile}
        className="block w-full text-sm text-purple-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}