const { ethers, network } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("\n🚀 开始部署 SignalPoolFHE 合约...");
  console.log("=" .repeat(60));
  console.log("部署账户:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  const balanceInEth = ethers.formatEther(balance);
  console.log("账户余额:", balanceInEth, "ETH");
  
  if (balance < ethers.parseEther("0.01")) {
    console.log("\n⚠️  警告: 余额可能不足，建议至少 0.01 ETH");
  }
  
  console.log("\n📝 正在部署 FHE 合约（可能需要更长时间）...");
  
  // Deploy FHE contract
  const SignalPoolFHE = await ethers.getContractFactory("SignalPoolFHE");
  const signalPool = await SignalPoolFHE.deploy();
  
  console.log("⏳ 等待部署确认（FHE 合约部署通常需要更长时间）...");
  await signalPool.waitForDeployment();
  const address = await signalPool.getAddress();
  
  console.log("\n✅ 部署成功！");
  console.log("=" .repeat(60));
  console.log("合约地址:", address);
  console.log("网络:", network.name);
  console.log("=" .repeat(60));
  
  // Save deployment info
  const deploymentInfo = {
    network: network.name,
    contract: "SignalPoolFHE",
    address: address,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    transactionHash: signalPool.deploymentTransaction()?.hash
  };
  
  // Save to file
  const deploymentDir = path.join(__dirname, '..', 'deployments');
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir, { recursive: true });
  }
  
  const deploymentFile = path.join(deploymentDir, `fhe-${network.name}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  console.log("\n💾 部署信息已保存到:", deploymentFile);
  
  console.log("\n📋 下一步:");
  console.log("1. 更新前端环境变量: frontend/.env.local");
  console.log("   添加: VITE_CONTRACT_FHE=" + address);
  console.log("   添加: VITE_FHEVM_ENABLED=true");
  console.log("2. 重启前端开发服务器");
  console.log("3. 在前端连接钱包并测试 FHE 功能");
  console.log("\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

