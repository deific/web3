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
mkdir ERC20
cd ERC20 & yarn init
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

### 安装交互钱包
安装Metamask浏览器钱包插件，用于后续的账号、部署合约

### 获取测试环境
#### alchemy
alchemy 是区块链开发的基础设施环境，类似于云开发环境，可以方便的提供各种区块链开发、网络等环境。注册账号后，使用其秘钥来将我们的自己的合约部署到测试网上。
https://www.alchemy.com/

#### etherscan 以太坊浏览器
部署合约后，通过以太坊浏览器可以查询我们的合约数据。注册账号，通过其API验证我们的合约。
 https://etherscan.io/ 

#### Rinkeby测试网测试币
https://faucets.chain.link/rinkeby

### 构建ERC20 代币
直接通过合约标准库的网站页面，根据代币导航生成代币合约代码。
https://docs.openzeppelin.com/contracts/4.x/wizard

将生成的合约代码复制后，保存到项目contracts目录下

编译合约：
```javascript
yarn hardhat compile
```

#### 配置环境变量
将项目中的我们需要的各种环境变量，通过修改配置文件的方式配置进去：
- .env 文件
该文件中保存我们的私有数据，alchemy的api_key，账户的私钥等，该文件不要上传到github中。

- hardhat.config.js 文件
该文件中hardhat的配置信息，主要包含network，即我们要部署的网络配置：
```
    require("@nomiclabs/hardhat-waffle");
    require("@nomiclabs/hardhat-etherscan");
    const dotenv = require("dotenv");
    const result = dotenv.config();
    if (result.error) {
    throw result.error;
    }
    FUJI_C_CHAIN_PROVIDER_URL="https://api.avax-test.network/ext/bc/C/rpc"
    module.exports ={
        solidity:"0.8.4",
        networks: {
            rinkeby: {
                url: process.env.ALCHEMY_API_KEY, // .env 文件中定义的环境变量，node环境会自动识别和赋值
                accounts: [process.env.RINKEBY_PRIVATE_KEY], // .env 文件中定义的环境变量，node环境会自动识别和赋值
            },
            fuji: {
                url: FUJI_C_CHAIN_PROVIDER_URL,
                accounts: [process.env.RINKEBY_PRIVATE_KEY] // .env 文件中定义的环境变量，node环境会自动识别和赋值
            }   },
        etherscan: {
            apiKey: {
                rinkeby: process.env.ETHERSCAN_API_KEY, // .env 文件中定义的环境变量，node环境会自动识别和赋值
                avalancheFujiTestnet: process.env.SNOWTRACE_API_KEY, // .env 文件中定义的环境变量，node环境会自动识别和赋值
            },
        }
    };
```

#### 部署合约：
```javascript
yarn hardhat run scripts/deploy.js --network rinkeby
```
输出：
```javascript
Deploying contract with account: 0x42e77900ee1cF000a4e62106b490e40FD5330504
Deployer accout balance: 100000000000000000
SofiaCoin token deployed to: 0xaD3432C5caD510fA10617a44f0CE58c51B545D0D
Deployer accout balance: 94396391969180156
```

### 查看链上数据
通过https://rinkeby.etherscan.io/查看合约，按部署合约时的输出地址进行搜素：0xaD3432C5caD510fA10617a44f0CE58c51B545D0D

### 认证合约
```javascript
yarn hardhat verify --network rinkeby <contract_address> 
```