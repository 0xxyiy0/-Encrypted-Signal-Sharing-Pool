# Netlify 部署指南

## 📋 部署前准备

### 1. 检查环境变量

确保以下环境变量已准备好（可在 Netlify Dashboard 中设置）：

```
VITE_CONTRACT_MOCK=0xFcA70e08afb3E19d4B81F55b89f8900255DbfEC0
VITE_CONTRACT_FHE=0x2ef21fa971d29D9c1A3f997350b05d142f3A0800
VITE_FHEVM_ENABLED=false
VITE_SEPOLIA_RPC_URL=https://eth-sepolia.public.blastapi.io
```

### 2. 本地构建测试

在部署前，先本地测试构建：

```bash
cd frontend
npm install
npm run build
npm run preview  # 预览构建结果
```

## 🚀 部署方法

### 方法一：通过 Netlify Dashboard（推荐）

1. **登录 Netlify**
   - 访问 https://app.netlify.com
   - 使用 GitHub/GitLab/Bitbucket 登录

2. **手动部署**
   - 点击 "Add new site" -> "Deploy manually"
   - 或者点击 "Sites" -> "Add new site" -> "Deploy manually"

3. **拖拽部署**
   - 在项目根目录执行：`cd frontend && npm run build`
   - 将生成的 `frontend/dist` 目录拖拽到 Netlify 部署区域

4. **配置环境变量**
   - 进入 Site settings -> Environment variables
   - 添加上述环境变量

### 方法二：通过 Netlify CLI

1. **安装 Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **登录 Netlify**
   ```bash
   netlify login
   ```

3. **初始化项目**
   ```bash
   netlify init
   ```
   - 选择 "Create & configure a new site"
   - 按照提示完成配置

4. **部署**
   ```bash
   netlify deploy --prod
   ```

### 方法三：连接 Git 仓库（自动部署）

1. **在 Netlify Dashboard 中**
   - 点击 "Add new site" -> "Import an existing project"
   - 选择你的 Git 仓库

2. **配置构建设置**
   - Build command: `cd frontend && npm install && npm run build`
   - Publish directory: `frontend/dist`

3. **添加环境变量**
   - Site settings -> Environment variables
   - 添加上述环境变量

4. **触发部署**
   - 每次 push 到主分支会自动触发部署

## ⚙️ 配置说明

### netlify.toml

项目根目录的 `netlify.toml` 已配置：
- 构建命令：`cd frontend && npm install && npm run build`
- 发布目录：`frontend/dist`
- SPA 路由重定向规则

### 环境变量配置

**必需的环境变量：**

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `VITE_CONTRACT_MOCK` | Mock 合约地址 | `0xFcA70e08afb3E19d4B81F55b89f8900255DbfEC0` |
| `VITE_CONTRACT_FHE` | FHE 合约地址 | `0x2ef21fa971d29D9c1A3f997350b05d142f3A0800` |
| `VITE_FHEVM_ENABLED` | FHE 模式开关 | `false` 或 `true` |
| `VITE_SEPOLIA_RPC_URL` | Sepolia RPC URL | `https://eth-sepolia.public.blastapi.io` |

**在 Netlify Dashboard 中设置：**
1. 进入 Site settings
2. 点击 Environment variables
3. 点击 "Add variable"
4. 添加每个变量（Key 和 Value）

## 🔍 部署后检查

1. **检查网站是否正常运行**
   - 访问 Netlify 提供的 URL
   - 检查控制台是否有错误

2. **检查环境变量**
   - 在浏览器控制台检查 `import.meta.env`
   - 确认环境变量正确加载

3. **测试钱包连接**
   - 连接 MetaMask
   - 切换到 Sepolia 网络
   - 测试基本功能

## 🐛 常见问题

### 问题 1：页面显示空白

**原因**：路由重定向未配置

**解决**：
- 确保 `netlify.toml` 中的 `[[redirects]]` 配置正确
- 或确保 `frontend/_redirects` 文件存在

### 问题 2：环境变量未加载

**原因**：环境变量未在 Netlify 中设置

**解决**：
- 在 Netlify Dashboard -> Environment variables 中设置
- 注意变量名必须以 `VITE_` 开头（Vite 要求）
- 重新部署以应用更改

### 问题 3：构建失败

**原因**：依赖安装失败或构建错误

**解决**：
- 检查 Netlify 构建日志
- 确保 Node.js 版本兼容（推荐 18.x 或 20.x）
- 在 `netlify.toml` 中可以指定 Node 版本：
  ```toml
  [build]
    command = "cd frontend && npm install && npm run build"
    publish = "frontend/dist"
  
  [build.environment]
    NODE_VERSION = "20"
  ```

### 问题 4：SDK 相关错误

**原因**：`@zama-fhe/relayer-sdk` 在浏览器环境中的兼容性问题

**解决**：
- 当前已知 SDK 在某些环境下可能有问题
- 可以先使用 Mock 模式（`VITE_FHEVM_ENABLED=false`）
- 等待 Zama SDK 更新

## 📝 部署清单

- [ ] 本地构建测试通过
- [ ] `netlify.toml` 配置正确
- [ ] `.netlifyignore` 已创建
- [ ] 环境变量已在 Netlify 中设置
- [ ] 部署后测试钱包连接
- [ ] 部署后测试基本功能
- [ ] 检查控制台无错误

## 🔗 相关资源

- Netlify 文档：https://docs.netlify.com
- Vite 部署指南：https://vitejs.dev/guide/static-deploy.html
- 项目 README：`README.md`

