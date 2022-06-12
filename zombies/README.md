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

# DApp 开发

DApp 是去中心化的分布式 APP。DApp 和普通的 APP 从使用效果上都一样，通过交互 UI 提供了服务与用户的功能和信息。DApp 和普通 App 的区别在于：
普通 APP 是前端 UI+后端服务+数据库，部署在中心化的服务器上，对外提供服务。DApp 的前端 UI 和普通 App 一样，Dapp 的后端服务是以区块链上的智能合约实现，数据库是以区块链账本实现。区块链网络是去中心化分布式的，基于区块链为底层数据库，智能合约为服务层，前端页面为表示交互的应用程序，也就实现了去中心化的分布式应用。其中区块链和智能合约依赖于区块链网络公链，如以太坊，solona 等提供的能力。
区块链公链提供了底层区块链数据存储和智能合约执行逻辑的能力，通过分布在全球的各个节点执行并达成共识，需要消耗资源，因此，各公链都使用原生代币的方式控制资源使用。即要使用区块链公链需要消耗代币，以太坊公链使用 ETH，solana 使用 SOL 等。

## 初始化环境

Redmix 提供了在线的智能合约开发和调试功能，但对于工程化的 Dapp 开发不如本地化方便管理。Dapp 的开发主要集中在前端 UI 和智能合约部分。智能合约的开发使用 Solidity，只有使用了兼容以太坊的 EVM 的公链，基本都支持。本地开发一般使用现代前端的开发工程，利用 npm 和其生态中各种库完成前端 UI 和智能合约的开发，编译，测试和部署。
初始化工程命令：

```
npm init --yes
```

## 安装依赖环境

### Hardhat

Hardhat 是一个方便在以太坊上进行构建的任务运行器。使用它可以帮助开发人员管理和自动化构建智能合约和 dApp 的过程中固有的重复任务，以及轻松地围绕此工作流程引入更多功能。
Hardhat 还内置了 Hardhat 网络，Hardhat 网络是为开发而设计的本地以太坊网络。 用来部署合约，运行测试和调试代码。
安装：

```
npm install --save-dev hardhat
```

初始化 hardhat:

```
npx hardhat
```

选择：Create a sample project

初始化完成后，会创建 hardhat.config.js 文件，是 hardhat 的配置文件。

### 安装 ethers.js

ethers.js 是与以太坊进行交互的 js 库，由以太坊基金开发和开源。

## 编写智能合约

在 contracts 目录下，新增合约文件，编写合约内容。

## 编译合约

```
npx hardhat compile
```

## 部署合约

### 在 hardhat 本地网络部署

hardhat 提供了完全兼容以太坊网络的轻量的本地网络，用于开发部署测试合约，这样我们就不需要本地再安装和维护一个以太坊网络，降低开发部署测试复杂度。
启动本地网络：

```
npx hardhat node
```

启动后，本地网络默认提供了 10 个账号，每个账号 1000ETH，用于测试，输出在控制台上。

### 部署脚本

在 scripts 目录下，修改样本 js 脚本内容，通过 hardhat 的 js 库，与 hardhat 本地网络交互，部署编译后的合约。

```
  // We get the contract to deploy
  const ZombieOwnership = await hre.ethers.getContractFactory("ZombieOwnership");
  const zombieOwnership = await ZombieOwnership.deploy();

  await zombieOwnership.deployed();

  console.log("zombieOwnership deployed to:", zombieOwnership.address);
```

运行脚本

```shell
npx hardhat run ./scripts/sample-script.js --network localhost

```

注意：hardhat 部署合约可以将合约部署实际的区块链网络上，部署脚本中的--network localhost 表明将合约部署到本地网络上。如果要部署到其他网路，如 rinkey 等，需要修改--network 后的参数。还需要注意，部署合约的账号，保证其有足够的 ETH 支付 gas 费，否则会失败。

部署成功后，脚本会在控制台会输出合约的地址,类似：

```
zombieOwnership deployed to: 0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82
```

前端与合约进行交互时，需要使用该地址。

### 测试合约

在 test 目录下，编写测试 js 脚本，利用 hardhat 的 js 库，与合约交互，执行测试用例。
执行测试：

```
npx hardhat test
```

## DApp 前端开发

前端页面开发可以使用 VUE，也可以使用 React，并没有特殊的限制，我们使用 React 进行开发。
新建 frontend 目录，并进行初始化：

```
npm create-app frontend
cd frontend && npm install
```

前端与智能合约交互使用 ethers.js，安装：

```
npm install ethers.js
```

### 连接合约

[ethers.js](https://docs.ethers.io/v5/) 与合约进行交互时，需要三个参数：
contractAddress：合约地址。
ABI：需要知道合约结构，包含哪些方法，因此，需要知道合约的 ABI 文件。合约编译后会生成其 ABI 文件，可以在 artifacts/contracts/XXX.sol/XXX.json 文件中找到。
Singer: 签名者，也就是当前连接合约的账户信息。该参数可选，如果包含该参数，则可以调用合约中 view,purse 以外的方法，能修改合约状态（Singger 包含私钥，还需要有足够的 ETH 以支付 gas 费）。
Provider: 提供了与区块链网络节点，也可以是钱包对象，由钱包再连接区块链网络节点。钱包对象如 Metamask，浏览器安装 Metamastk 插件后，在浏览器环境下，会自动注入 window.ethereum 对象，可以直接使用。该参数可选，如果使用该参数，只能调用不需要花费 gas 的 view，purse 方法。

```
let contract = new ethers.Contract(
      contractAddress,
      ZombieOwnership.abi,
      signer or provider
    );
```

#### 调用合约方法

合约方法调用一般都是异步方式，使用 await 转同步

```
await contract.METHOD({PARAMS})
```

#### 监听合约事件

```
contract.on("NewZombie", (id, name, dna) => {
      console.log("new Zombie:", id, name, dna);
      this.showZombies();
    });
```
