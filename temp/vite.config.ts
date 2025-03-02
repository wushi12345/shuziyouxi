import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/AI数字游戏/', // 修改为GitHub仓库名称，确保在GitHub Pages上能正确加载资源
})
