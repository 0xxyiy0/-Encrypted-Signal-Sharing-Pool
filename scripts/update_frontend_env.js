/**
 * 更新前端 .env.local 文件（添加 FHE 合约地址）
 * 运行: node scripts/update_frontend_env.js
 */

const fs = require('fs');
const path = require('path');

// 从部署信息读取 FHE 合约地址
const fheDeploymentPath = path.join(__dirname, '..', 'deployments', 'fhe-sepolia.json');
const mockDeploymentPath = path.join(__dirname, '..', 'deployments', 'mock-sepolia.json');

let fheAddress = '0x0000000000000000000000000000000000000000';
let mockAddress = '0x0000000000000000000000000000000000000000';

// 读取 FHE 部署信息
if (fs.existsSync(fheDeploymentPath)) {
  try {
    const fheDeployment = JSON.parse(fs.readFileSync(fheDeploymentPath, 'utf8'));
    fheAddress = fheDeployment.address;
    console.log(`✅ 读取 FHE 合约地址: ${fheAddress}`);
  } catch (err) {
    console.warn(`⚠️ 无法读取 FHE 部署信息: ${err.message}`);
  }
}

// 读取 Mock 部署信息
if (fs.existsSync(mockDeploymentPath)) {
  try {
    const mockDeployment = JSON.parse(fs.readFileSync(mockDeploymentPath, 'utf8'));
    mockAddress = mockDeployment.address;
    console.log(`✅ 读取 Mock 合约地址: ${mockAddress}`);
  } catch (err) {
    console.warn(`⚠️ 无法读取 Mock 部署信息: ${err.message}`);
  }
}

// 环境变量内容
const envContent = `# 合约地址配置
# Mock 合约（已部署到 Sepolia）
VITE_CONTRACT_MOCK=${mockAddress}

# FHE 合约（已部署到 Sepolia）
VITE_CONTRACT_FHE=${fheAddress}

# 功能开关（false = Mock, true = FHE）
# 默认使用 Mock 模式进行测试，可以改为 true 启用 FHE 模式
VITE_FHEVM_ENABLED=false

# Sepolia RPC（可选，有默认值）
VITE_SEPOLIA_RPC_URL=https://eth-sepolia.public.blastapi.io
`;

const envPath = path.join(__dirname, '..', 'frontend', '.env.local');

try {
  fs.writeFileSync(envPath, envContent, 'utf8');
  console.log('\n✅ frontend/.env.local 文件已更新:', envPath);
  console.log('\n📋 文件内容:');
  console.log(envContent);
  console.log('\n⚠️  重要: 请重启前端开发服务器以加载新的环境变量！');
  console.log('   1. 停止当前服务器 (Ctrl+C)');
  console.log('   2. 运行: cd frontend && npm run dev');
  console.log('\n💡 要切换到 FHE 模式:');
  console.log('   修改 frontend/.env.local 中的 VITE_FHEVM_ENABLED=true');
  console.log('   然后重启前端服务器');
  console.log('');
} catch (error) {
  console.error('❌ 更新 frontend/.env.local 文件失败:', error.message);
  process.exit(1);
}

