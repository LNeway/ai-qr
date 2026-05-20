import { QRGenerator } from '@/components/qr-generator'

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 p-4 lg:p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">AI QR</h1>
        <p className="text-sm text-slate-500 mt-1">在线二维码生成器 — 支持多种样式与全类型内容</p>
      </header>
      <QRGenerator />
    </main>
  )
}