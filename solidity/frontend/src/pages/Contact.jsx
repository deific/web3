import React from "react";
import { Card, Button, Descriptions } from "antd";
import { ethers } from "ethers";
import SofiaCoin from "../abi/SofiaCoin.json";

class Contract extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    walletInfo: {
      loadings: false,
      token: "ETH",
      account: "no connect",
      balance: "0.00",
      transactionCount: 0,
    },
    sofiaInfo: {
      loadings: false,
      token: "SOF",
      contractAddress: "0xaD3432C5caD510fA10617a44f0CE58c51B545D0D",
      account: "no connect",
      balance: "0.00",
      transactionCount: 0,
    },
  };

  componentDidMount() {}

  async connectMetamask() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const walletInfo = {
      account: await signer.getAddress(),
      balance: await await signer.getBalance(),
      transactionCount: await signer.getTransactionCount(),
    };

    walletInfo.balance = ethers.utils.formatUnits(walletInfo.balance, 18);
    this.setState({
      walletInfo: Object.assign(this.state.walletInfo, walletInfo),
    });
  }

  async connectSofiaCoin() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    let accountAddress = await signer.getAddress();
    // 使用Provider 连接合约，将只有对合约的可读权限
    let contract = new ethers.Contract(
      this.state.sofiaInfo.contractAddress,
      SofiaCoin.abi,
      provider
    );

    let currentValue = await contract.balanceOf(accountAddress);
    const sofiaInfo = {
      account: contract.address,
      balance: ethers.utils.formatUnits(currentValue, 18),
    };
    this.setState({
      sofiaInfo: Object.assign(this.state.sofiaInfo, sofiaInfo),
    });
  }

  render() {
    let { walletInfo, sofiaInfo } = this.state;
    return (
      <div>
        <Card
          title={walletInfo.token}
          extra={
            <Button
              type="primary"
              loading={walletInfo.loadings}
              onClick={() => this.connectMetamask()}
            >
              Connect Metamask
            </Button>
          }
        >
          <Descriptions title="Wallet Info">
            <Descriptions.Item label="Account">
              {walletInfo.account}
            </Descriptions.Item>
            <Descriptions.Item label="Balance">
              {walletInfo.balance} {walletInfo.token}
            </Descriptions.Item>
            <Descriptions.Item label="TransactionCount">
              {walletInfo.transactionCount}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card
          title={sofiaInfo.token}
          extra={
            <Button
              type="primary"
              loading={sofiaInfo.loadings}
              onClick={() => this.connectSofiaCoin()}
            >
              Connect Metamask
            </Button>
          }
        >
          <Descriptions title="Wallet Info">
            <Descriptions.Item label="Account">
              {sofiaInfo.account}
            </Descriptions.Item>
            <Descriptions.Item label="Balance">
              {sofiaInfo.balance} {sofiaInfo.token}
            </Descriptions.Item>
            <Descriptions.Item label="TransactionCount">
              {sofiaInfo.transactionCount}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>
    );
  }
}

export default Contract;
