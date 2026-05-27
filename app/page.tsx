import { QRGenerator } from '@/components/qr-generator'

export default function Home() {
  return (
    <main className="min-h-screen bg-white p-4 lg:p-8">
      <header className="mb-6">
        <h1 className="text-lg font-medium text-gray-900 tracking-tight">QR Code</h1>
        <p className="text-sm text-gray-400 mt-0.5">在线二维码生成器，支持多种样式与全类型内容</p>
      </header>
      <QRGenerator />
    </main>
  )
}