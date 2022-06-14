# 闪电贷款学习

## 来源
源码：(Buidler DAO 系列课程: 闪电贷基础)[https://github.com/Wiger123/BuidlerDao-FlashLoan]
视频：
## 安装依赖
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

## 初始化hardhat
```javascript
yarn hardhat
// 选择 Create a basic sample project
```



## hardhat commands
```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```