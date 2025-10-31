/**
 * 创建 .env 文件
 * 运行: node scripts/setup_env.js
 */

const fs = require('fs');
const path = require('path');

const envContent = `SEPOLIA_RPC_URL=https://eth-sepolia.public.blastapi.io
PRIVATE_KEY=0x57493420e1a6a7cfe40c62bfca1085be54ed1f46f697ff13f07c49272806c8e1
`;

const envPath = path.join(__dirname, '..', '.env');

try {
  fs.writeFileSync(envPath, envContent, 'utf8');
  console.log('✅ .env 文件已创建:', envPath);
  console.log('\n📋 文件内容:');
  console.log(envContent);
} catch (error) {
  console.error('❌ 创建 .env 文件失败:', error.message);
  process.exit(1);
}

