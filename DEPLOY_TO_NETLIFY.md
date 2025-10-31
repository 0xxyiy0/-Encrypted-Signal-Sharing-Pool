# 🚀 Netlify 手动部署指南

## ✅ 构建已完成

构建输出目录：`frontend/dist`

## 📦 部署步骤

### 方法一：拖拽部署（最简单）

1. **打开 Netlify Dashboard**
   - 访问：https://app.netlify.com
   - 登录你的账户

2. **手动部署**
   - 点击 "Add new site" → "Deploy manually"
   - 或者直接拖拽 `frontend/dist` 文件夹到部署区域

3. **等待部署完成**
   - Netlify 会自动部署
   - 你会得到一个 `.netlify.app` 的 URL

4. **配置环境变量**
   - 进入 Site settings → Environment variables
   - 添加以下变量：

```
VITE_CONTRACT_MOCK=0xFcA70e08afb3E19d4B81F55b89f8900255DbfEC0
VITE_CONTRACT_FHE=0x2ef21fa971d29D9c1A3f997350b05d142f3A0800
VITE_FHEVM_ENABLED=false
VITE_SEPOLIA_RPC_URL=https://eth-sepolia.public.blastapi.io
```

5. **重新部署以应用环境变量**
   - Site settings → Deploys → Trigger deploy → Deploy site

### 方法二：使用 Netlify CLI

```bash
# 1. 安装 Netlify CLI
npm install -g netlify-cli

# 2. 登录
netlify login

# 3. 初始化（如果还没有）
netlify init

# 4. 部署
netlify deploy --prod --dir=frontend/dist
```

## ⚙️ 已创建的配置文件

1. **`netlify.toml`** - Netlify 构建配置
   - 构建命令：`cd frontend && npm install && npm run build`
   - 发布目录：`frontend/dist`
   - SPA 路由重定向配置

2. **`.netlifyignore`** - 部署时忽略的文件
   - 避免上传不必要的文件（如合约、文档等）

3. **`frontend/_redirects`** - SPA 路由重定向
   - 确保 React Router 正常工作

## 🔍 部署后检查清单

- [ ] 网站可以正常访问
- [ ] 环境变量已配置
- [ ] 钱包连接功能正常
- [ ] 没有控制台错误
- [ ] Mock 模式功能正常（当前 `VITE_FHEVM_ENABLED=false`）

## 📝 注意事项

1. **SDK 问题**：当前 FHE 加密功能有 SDK 兼容性问题，建议保持 Mock 模式（`VITE_FHEVM_ENABLED=false`）

2. **环境变量**：所有 Vite 环境变量必须以 `VITE_` 开头

3. **路由**：SPA 应用需要配置重定向，已通过 `netlify.toml` 和 `_redirects` 文件配置

4. **构建大小**：注意构建警告，某些 chunk 较大（主要是 SDK 的 WASM 文件）

## 🐛 如果遇到问题

1. **页面空白**
   - 检查 `netlify.toml` 中的重定向配置
   - 确保 `frontend/_redirects` 文件在 `dist` 目录中

2. **环境变量未生效**
   - 确认变量名以 `VITE_` 开头
   - 重新部署以应用环境变量

3. **构建失败**
   - 查看 Netlify 构建日志
   - 确保 Node.js 版本兼容（推荐 18.x 或 20.x）

## 📚 更多信息

详细部署文档请参考：`docs/NETLIFY_DEPLOYMENT.md`

