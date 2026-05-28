import { QRGenerator } from '@/components/qr-generator'

export default function Home() {
  return (
    <main className="min-h-screen p-4 lg:p-8">
      <header className="mb-8 pb-6 border-b border-purple-200">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2.48a2.5 2.5 0 00-4.52-3m10.04-5a2.5 2.5 0 00-3.52-3M8.48 20H6.5" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-purple-900 tracking-tight">QR Code</h1>
        </div>
        <p className="text-sm text-purple-400 mt-2 ml-11">在线二维码生成器，支持多种样式与全类型内容</p>
      </header>
      <QRGenerator />
    </main>
  )
}