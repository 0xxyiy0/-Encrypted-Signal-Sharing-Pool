/**
 * 检查 Sepolia 钱包余额
 * 运行: npx hardhat run scripts/check_balance.js --network sepolia
 */

const { ethers, network } = require("hardhat");

async function main() {
  const [account] = await ethers.getSigners();
  const address = account.address;
  const balance = await ethers.provider.getBalance(address);
  const balanceInEth = ethers.formatEther(balance);
  
  console.log('\n💰 钱包余额检查:');
  console.log('=' .repeat(60));
  console.log('地址:', address);
  console.log('余额:', balanceInEth, 'ETH');
  console.log('余额 (Wei):', balance.toString());
  console.log('=' .repeat(60));
  
  const minBalance = ethers.parseEther("0.01"); // 最少 0.01 ETH
  if (balance < minBalance) {
    console.log('\n⚠️  警告: 余额不足！');
    console.log('建议至少 0.01 ETH 用于部署和测试');
    console.log('从 Sepolia 水龙头获取测试 ETH:');
    console.log('- https://www.alchemy.com/faucets/ethereum-sepolia');
    console.log('- https://sepoliafaucet.com/');
    console.log('- https://faucet.quicknode.com/ethereum/sepolia');
  } else {
    console.log('\n✅ 余额充足，可以开始部署！');
  }
  console.log('\n');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

