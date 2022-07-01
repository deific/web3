# Basic Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```

# 基于Hardhat发现ERC20代币

## 步骤
### 安装环境
1、git
https://git-scm.com/
2、nodejs
https://nodejs.org/en/download/
3、yarn
https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable

### 准备
```javascript
mkdir hardhat-graph
cd hardhat-graph & yarn init
```

### 安装依赖
```javascript
// js 的 solidity 开发脚手架，可以编译、测试、部署以太坊兼容的开发环境
yarn add --dev hardhat
// 合约标准库
yarn add --dev @openzeppelin/contracts 
// 环境配置组件
yarn add --dev dotenv
// 合约验证库
yarn add @nomiclabs/hardhat-etherscan --dev
```

### 初始化hardhat
```javascript
yarn hardhat
// 选择 Create a basic sample project
```
