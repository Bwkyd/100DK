import './globals.css'

export const metadata = {
  title: '100天配额法 - 习惯追踪器',
  description: '用100天配额法养成好习惯',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}

