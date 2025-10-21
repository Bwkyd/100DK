/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // 静态导出
  distDir: 'out',    // 输出目录
  images: {
    unoptimized: true  // 禁用图片优化
  },
  // 确保 API 调用指向本地 Tauri 命令
  trailingSlash: true,
}

module.exports = nextConfig