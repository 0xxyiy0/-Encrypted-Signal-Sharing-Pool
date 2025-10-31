/**
 * 测试钱包工具
 * 用于快速导入测试钱包进行开发测试
 * 
 * 使用方法：
 * 1. 在 MetaMask 中：设置 -> 导入账户 -> 粘贴助记词
 * 2. 或使用此脚本生成私钥用于测试
 */

import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 确保 scripts 目录存在
if (!fs.existsSync(__dirname)) {
  fs.mkdirSync(__dirname, { recursive: true });
}

// 测试助记词（来自 .env.test.local）
const TEST_MNEMONIC = "share auto grow stay palace orange couple release near shoot life scout";

/**
 * 从助记词生成钱包信息
 */
function generateWalletFromMnemonic(mnemonic) {
  try {
    const wallet = ethers.Wallet.fromPhrase(mnemonic);
    
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: mnemonic,
      publicKey: wallet.publicKey,
    };
  } catch (error) {
    console.error('❌ 生成钱包失败:', error.message);
    throw error;
  }
}

/**
 * 显示钱包信息（隐藏敏感信息）
 */
function displayWalletInfo(walletInfo) {
  console.log('\n📝 测试钱包信息:');
  console.log('=' .repeat(50));
  console.log('地址 (Address):', walletInfo.address);
  console.log('公钥 (Public Key):', walletInfo.publicKey);
  console.log('私钥 (Private Key):', walletInfo.privateKey);
  console.log('助记词 (Mnemonic):', walletInfo.mnemonic);
  console.log('=' .repeat(50));
  console.log('\n⚠️  安全提醒:');
  console.log('1. 这是测试钱包，仅用于本地开发');
  console.log('2. 不要将私钥或助记词提交到版本控制');
  console.log('3. 不要在生产环境使用此钱包');
  console.log('\n💡 导入钱包到 MetaMask:');
  console.log('1. 打开 MetaMask');
  console.log('2. 点击账户图标 -> "导入账户"');
  console.log('3. 选择 "使用助记词导入"');
  console.log('4. 粘贴助记词:', TEST_MNEMONIC);
  console.log('\n');
}

/**
 * 主函数
 */
async function main() {
  console.log('🔐 测试钱包工具');
  console.log('=' .repeat(50));
  
  try {
    const walletInfo = generateWalletFromMnemonic(TEST_MNEMONIC);
    displayWalletInfo(walletInfo);
    
    // 可选：保存到文件（仅在需要时）
    const outputPath = path.join(__dirname, 'test-wallet-info.json');
    console.log(`\n💾 钱包信息已保存到: ${outputPath}`);
    console.log('⚠️  请确保此文件已添加到 .gitignore');
    
    fs.writeFileSync(
      outputPath,
      JSON.stringify(walletInfo, null, 2),
      'utf8'
    );
    
    console.log('\n✅ 完成！');
    
  } catch (error) {
    console.error('❌ 错误:', error.message);
    process.exit(1);
  }
}

// 运行主函数
main().catch((error) => {
  console.error('❌ 脚本执行失败:', error);
  process.exit(1);
});

