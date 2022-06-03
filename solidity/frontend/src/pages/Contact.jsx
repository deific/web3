import React from "react";
import { Card, Button, Descriptions } from "antd";
import { ethers } from "ethers";

class Contract extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    loadings: false,
    walletInfo: {
      address: "no connect",
      token: "WCUBE",
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
      address: await signer.getAddress(),
      balance: await await signer.getBalance(),
      transactionCount: await signer.getTransactionCount(),
    };

    walletInfo.balance = ethers.utils.formatUnits(walletInfo.balance, 18);
    this.setState({
      walletInfo: Object.assign(this.state.walletInfo, walletInfo),
    });
  }

  render() {
    let { walletInfo } = this.state;
    return (
      <div>
        <Card
          title={walletInfo.address}
          extra={
            <Button
              type="primary"
              loading={this.state.loadings}
              onClick={() => this.connectMetamask()}
            >
              Connect Metamask
            </Button>
          }
        >
          <Descriptions title="Wallet Info">
            <Descriptions.Item label="Token">
              {walletInfo.token}
            </Descriptions.Item>
            <Descriptions.Item label="Balance">
              {walletInfo.balance} {walletInfo.token}
            </Descriptions.Item>
            <Descriptions.Item label="TransactionCount">
              {walletInfo.transactionCount}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>
    );
  }
}

export default Contract;
