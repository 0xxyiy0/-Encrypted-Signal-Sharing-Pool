# 📊 部署状态

## ✅ Mock 合约部署成功

**合约地址**: `0xFcA70e08afb3E19d4B81F55b89f8900255DbfEC0`  
**网络**: Sepolia Testnet  
**部署账户**: `0xFa6a3f29719A72cE35175D2AB8030DffD6e2A6Da`  
**部署时间**: 2025-01-XX

### Etherscan 链接

查看合约: https://sepolia.etherscan.io/address/0xFcA70e08afb3E19d4B81F55b89f8900255DbfEC0

### 前端配置

已更新 `frontend/.env.local`:
- ✅ `VITE_CONTRACT_MOCK=0xFcA70e08afb3E19d4B81F55b89f8900255DbfEC0`
- ✅ `VITE_FHEVM_ENABLED=false`

## ✅ FHE 合约部署成功

**合约地址**: `0x2ef21fa971d29D9c1A3f997350b05d142f3A0800`  
**网络**: Sepolia Testnet  
**部署账户**: `0xFa6a3f29719A72cE35175D2AB8030DffD6e2A6Da`  
**部署时间**: 2025-10-31  
**交易哈希**: `0x70371e4863e10d233df6d41aeb19955cf6996b183cd368cdc67bb4106ed19a58`

### Etherscan 链接

查看合约: https://sepolia.etherscan.io/address/0x2ef21fa971d29D9c1A3f997350b05d142f3A0800

### 前端配置

已更新 `frontend/.env.local`:
- ✅ `VITE_CONTRACT_MOCK=0xFcA70e08afb3E19d4B81F55b89f8900255DbfEC0`
- ✅ `VITE_CONTRACT_FHE=0x2ef21fa971d29D9c1A3f997350b05d142f3A0800`
- ✅ `VITE_FHEVM_ENABLED=false` (默认 Mock 模式)

### 切换 FHE 模式

要启用 FHE 模式，修改 `frontend/.env.local`:
```
VITE_FHEVM_ENABLED=true
```

然后重启前端开发服务器。

---

**最后更新**: 2025-10-31

