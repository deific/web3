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


### 配置私钥
为方便获取，在 .env 中放入的私钥，格式为 "PRIVATE_KEY=xxxx", 然后代码自动从中读取
另外需要设置你的 infura 节点 id，在 .env 中放入的私钥，格式为 "INFURA_ID=xxxx"

### 部署合约(用于测试 graph 的简单合约)
```javascript
npx hardhat run ./scripts/deploy.js --network rinkeby
```
输出信息类似如下:
```javascript
Deploying contracts with the account: 0x42e77900ee1cF000a4e62106b490e40FD5330504
Account balance: 394314454468688531
Greeter deployed to: 0xd76fbe79091131f459aCf4E020f9C46339EF0d22
Transfer 50 to receiver  0x42e77900ee1cF000a4e62106b490e40FD5330504
Account balance of receiver is:  1000000000
allowance of 0x42e77900ee1cF000a4e62106b490e40FD5330504 to 0x42e77900ee1cF000a4e62106b490e40FD5330504 is  100000
```

### TheGraph 创建一个 Subgraph 空间
因为需要借助 TheGraph 的节点来完成数据的索引，因此我们需要在 [TheGraph Studio](https://thegraph.com/studio/) 上创建一个 Subgraph。
如果没有 The Graph 的账户，可以直接连接钱包注册，账户名即为钱包地址，以下称之为 <THEGRAPH_USERNAME>。
批准钱包签名之后，会跳转到 My Subgraphs 面板，点击 Create a Subgraph 按钮。

### 开发和部署 subgraph
先使用 yarn 在全局安装 Graph CLI
```javascript
yarn global add @graphprotocol/graph-cli
```

### 初始化配置
```javascript
graph init --studio <SUBGRAPH_NAME>
```

在 "Subgraph name" 和 "Directory to create the subgraph" 直接回车即可
Ethereum network 这里选择 rinkeby
"Contract address" 这里输入在步骤 3 中部署合约时生成的合约地址
上面执行到 "fetch ABI from Etherscan" 时会报执行失败，然后出现 "ABI file (path)" 字样，提示输入本机中 abi 的文件路径，这里我们输入 SimpleToken.json 所在的路径即可(./abis/SimpleToken.json)
如果 yarn install 失败(例如网络错误)，可以进入新生成的项目目录，手动安装 npm 依赖

```javascript
sss@macbook hardhat-graph % graph init --studio mygraph
✔ Protocol · ethereum
✔ Subgraph slug · mygraph
✔ Directory to create the subgraph in · mygraph
? Ethereum network … 
? Ethereum network … 
? Ethereum network … 
✔ Ethereum network · rinkeby
✔ Contract address · 0xd76fbe79091131f459aCf4E020f9C46339EF0d22
✖ Failed to fetch ABI from Etherscan: ABI not found, try loading it from a local file
✔ ABI file (path) · ./artifacts/contracts/SimpleToken.sol/SimpleToken.json
✔ Contract Name · SimpleToken
———
  Generate subgraph
  Write subgraph to directory
✔ Create subgraph scaffold
✔ Initialize networks config
✔ Initialize subgraph repository
✔ Install dependencies with yarn
✔ Generate ABI and schema types with yarn codegen
✔ Add another contract? (y/N) · false

Subgraph mygraph created in mygraph

Next steps:

  1. Run `graph auth` to authenticate with your deploy key.

  2. Type `cd mygraph` to enter the subgraph.

  3. Run `yarn deploy` to deploy the subgraph.

Make sure to visit the documentation on https://thegraph.com/docs/ for further information.
```

## 修改定义模式
两个文件的修改范例在 ./scripts/schema.graphql 和 ./scripts/mapping.ts
<SUBGRAPH_NAME>/schema.graphql,定义合约事件对应的实体结构，修改文件内容如下

```javascript
  type TransferEntity @entity {
    id: ID!
    from: Bytes! # address
    to: Bytes! # address
    value: BigInt!
  }

  type ApprovalEntity @entity {
    id: ID!
    owner: Bytes! # address
    spender: Bytes! # address
    value: BigInt!
  }
```
### 修改simple-token
<SUBGRAPH_NAME>/src/simple-token.ts，添加处理合约事件的方法


### 修改实体名字
进入 mygraph 目录
修改 subgraph.yaml 中 entities 定义如下
---
entities:
  - TransferEntity
  - ApprovalEntity
  - RoleGrantedEntity

### 授权
首先获取你的 <DEPLOY KEY>，在你的 subgraph 项目主页可以找到：
Authenticate within the CLI, build and deploy your subgraph to the Studio.
```javascript
graph auth --studio <DEPLOY KEY>
```
### 生成代码和编译

```javascript
cd mygraph
graph codegen && graph build
```

### 部署
```javascript
graph deploy --studio mygraph
```
## 检验 subgraph 是否部署成功
从 subgraphs 面板进入你的 subgraph 项目主页， 查看索引进度，当进度 100%可以开始调用。
这里已经预生成了一个示例请求，点击播放按钮即可请求数据。至此 subgraph 部署成功

