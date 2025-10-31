/**
 * 从助记词获取钱包信息（用于部署配置）
 * 运行: node scripts/get_wallet_info.js
 */

const { ethers } = require('ethers');

const TEST_MNEMONIC = "share auto grow stay palace orange couple release near shoot life scout";

async function main() {
  try {
    const wallet = ethers.Wallet.fromPhrase(TEST_MNEMONIC);
    
    console.log('\n📝 测试钱包信息（用于部署配置）:');
    console.log('=' .repeat(60));
    console.log('地址 (Address):', wallet.address);
    console.log('私钥 (Private Key):', wallet.privateKey);
    console.log('=' .repeat(60));
    console.log('\n💡 使用方法:');
    console.log('1. 复制上面的私钥');
    console.log('2. 创建 .env 文件（如果还没有）');
    console.log('3. 添加: PRIVATE_KEY=<上面复制的私钥>');
    console.log('4. 运行部署命令: npm run deploy:mock');
    console.log('\n⚠️  安全提醒:');
    console.log('- 此私钥仅用于 Sepolia 测试网络');
    console.log('- 不要提交 .env 文件到 Git');
    console.log('- 不要在生产环境使用此私钥');
    console.log('\n');
    
  } catch (error) {
    console.error('❌ 错误:', error.message);
    process.exit(1);
  }
}

main();

