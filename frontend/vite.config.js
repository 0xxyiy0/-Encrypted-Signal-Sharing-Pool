import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Netlify 部署配置：确保 base 路径正确
  base: '/',
  
  // ✅ 重要：处理 SDK 依赖（参考手册 3.2 节）
  optimizeDeps: {
    include: [
      "ethers"
    ]
    // 注意：@zama-fhe/relayer-sdk 暂时不加入 optimizeDeps
    // 等真正使用时再配置（需要使用 @zama-fhe/relayer-sdk/web 导入）
  },
  
  // ✅ 解决包解析问题
  resolve: {
    alias: {
      // 如果需要，可以添加别名
    }
  },
  
  // ✅ 定义全局变量（解决 process 和 global 未定义问题）
  define: {
    'process.env': {},
    'global': 'globalThis', // 解决 @zama-fhe/relayer-sdk 中 buffer 包的 global is not defined 错误
  },
})
