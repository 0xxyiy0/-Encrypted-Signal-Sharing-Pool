# ⚡ 快速部署到 Netlify

## ✅ 构建已完成

最新的构建文件已生成在：`frontend/dist`

**已修复的问题**：
- ✅ RevenueDistribution 组件的 App 导入问题
- ✅ 所有组件都已正确使用 App.useApp()

---

## 🚀 立即部署（3步完成）

### 步骤 1：打开 Netlify

访问：https://app.netlify.com  
登录你的账户

### 步骤 2：拖拽部署

1. 如果这是**新站点**：
   - 点击 "Add new site" → "Deploy manually"
   - 将 `frontend/dist` 文件夹**拖拽**到部署区域

2. 如果这是**更新现有站点**：
   - 进入你的站点
   - 点击 "Deploys" 标签
   - 将 `frontend/dist` 文件夹**拖拽**到部署区域

### 步骤 3：配置环境变量（如果是新站点）

进入：**Site settings → Environment variables**

添加以下变量：

```
VITE_CONTRACT_MOCK=0xFcA70e08afb3E19d4B81F55b89f8900255DbfEC0
VITE_CONTRACT_FHE=0x2ef21fa971d29D9c1A3f997350b05d142f3A0800
VITE_FHEVM_ENABLED=false
VITE_SEPOLIA_RPC_URL=https://eth-sepolia.public.blastapi.io
```

然后重新部署。

---

## 📁 需要上传的文件夹

**上传这个文件夹**：`frontend/dist`

**文件夹内容**：
- ✅ index.html
- ✅ _redirects（SPA 路由重定向）
- ✅ assets/（所有 JS、CSS、WASM 文件）
- ✅ vite.svg

**总大小**：约 9 MB

---

## ⚡ 使用 Netlify CLI（可选）

如果你安装了 Netlify CLI：

```bash
# 进入项目根目录
cd E:\ZAMAcode\F--007

# 部署
netlify deploy --prod --dir=frontend/dist
```

---

## ✅ 部署后验证

1. **打开部署的 URL**（`.netlify.app`）
2. **检查控制台**：F12 → Console，确认没有错误
3. **测试钱包连接**
4. **测试各个页面**：
   - ✅ Signal Input
   - ✅ Aggregation Dashboard
   - ✅ Contribution Tracking
   - ✅ Revenue Distribution（刚刚修复的）
   - ✅ Settings

---

## 🎯 本次更新内容

- ✅ 修复 RevenueDistribution 组件黑屏问题
- ✅ 修复 App 导入错误
- ✅ 优化 message.loading 使用方式
- ✅ 所有组件现在都正确使用 App.useApp()

---

**准备好了吗？开始部署！** 🚀

