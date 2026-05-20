import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI QR - 在线二维码生成器',
  description: '支持多种样式和模板，可下载 PNG/SVG。支持 URL、文本、WiFi、邮箱、电话、短信、vCard 全部类型。',
  keywords: '二维码, QR code, 二维码生成, QR生成器, 二维码样式',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>{children}</body>
    </html>
  )
}