/**
 * 创建前端 .env.local 文件
 * 运行: node scripts/setup_frontend_env.js
 */

const fs = require('fs');
const path = require('path');

const envContent = `# 合约地址配置
# Mock 合约（已部署到 Sepolia）
VITE_CONTRACT_MOCK=0xFcA70e08afb3E19d4B81F55b89f8900255DbfEC0

# FHE 合约（待部署）
VITE_CONTRACT_FHE=0x0000000000000000000000000000000000000000

# 功能开关（false = Mock, true = FHE）
VITE_FHEVM_ENABLED=false

# Sepolia RPC（可选，有默认值）
VITE_SEPOLIA_RPC_URL=https://eth-sepolia.public.blastapi.io
`;

const envPath = path.join(__dirname, '..', 'frontend', '.env.local');

try {
  fs.writeFileSync(envPath, envContent, 'utf8');
  console.log('✅ frontend/.env.local 文件已创建:', envPath);
  console.log('\n📋 文件内容:');
  console.log(envContent);
  console.log('\n⚠️  重要: 请重启前端开发服务器以加载新的环境变量！');
  console.log('   1. 停止当前服务器 (Ctrl+C)');
  console.log('   2. 运行: cd frontend && npm run dev');
  console.log('');
} catch (error) {
  console.error('❌ 创建 frontend/.env.local 文件失败:', error.message);
  process.exit(1);
}

