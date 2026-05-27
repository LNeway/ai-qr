import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'QR Code - 在线二维码生成器',
  description: '支持多种样式和模板，可下载 PNG/SVG。支持 URL、文本、WiFi、邮箱、电话、短信、vCard。',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}