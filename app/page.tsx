import { QRGenerator } from '@/components/qr-generator'

export default function Home() {
  return (
    <main className="min-h-screen p-4 lg:p-8">
      <header className="mb-8 pb-6 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">QR Code</h1>
        <p className="text-sm text-gray-500 mt-1">在线二维码生成器，支持多种样式与全类型内容</p>
      </header>
      <QRGenerator />
    </main>
  )
}