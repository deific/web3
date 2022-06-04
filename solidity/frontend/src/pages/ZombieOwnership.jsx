import React from "react";
import { Row, Col, Space, Card, Button, Descriptions } from "antd";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";

import { ethers } from "ethers";
import ZombieOwnership from "../abi/ZombieOwnership.json";

class Contract extends React.Component {
  constructor(props) {
    super(props);
  }
  contractInfo = {
    address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    type: "NTF",
    contract: null,
    provider: null,
    signer: null,
    account: null,
  };

  state = {
    zombieInfo: {
      loadings: false,
      account: "no connect",
      token: "Zombie",
      zombieList: [],
      transactionCount: 0,
    },
  };

  componentDidMount() {
    // this.connectZombie();
  }

  async connectZombie() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    let accountAddress = await signer.getAddress();
    // 使用Provider 连接合约，将只有对合约的可读权限
    let contract = new ethers.Contract(
      this.contractInfo.address,
      ZombieOwnership.abi,
      signer
    );

    this.contractInfo.contract = contract;
    this.contractInfo.provider = provider;
    this.contractInfo.signer = signer;
    this.contractInfo.account = accountAddress;

    await this.showZombies();
  }

  async showZombies() {
    if (this.contractInfo.contract == null) {
      await this.connectZombie();
    }
    // 获取该地址所有的僵尸id列表
    let zombieIds = await this.contractInfo.contract.getZombiesByOwner(
      this.contractInfo.account
    );
    let zombieList = [];
    for (let id of zombieIds) {
      let zombie = await this.contractInfo.contract.zombies(id);
      zombieList.push(zombie);
    }

    const zombieInfo = {
      account: this.contractInfo.account,
      zombieList: zombieList,
    };
    this.setState({
      zombieInfo: Object.assign(this.state.zombieInfo, zombieInfo),
    });
  }

  newZombie() {
    // 创建一个僵尸
    let result = this.contractInfo.contract.createRandomZombie("frist");
  }

  showZombie(zombie) {
    return (
      <Card
        title={"Zombie:" + zombie.name}
        actions={[
          <SettingOutlined key="setting" />,
          <EditOutlined key="edit" />,
          <EllipsisOutlined key="ellipsis" />,
        ]}
      >
        <Descriptions column={2}>
          <Descriptions.Item label="DNA">
            {zombie.dna.toString()}
          </Descriptions.Item>
          <Descriptions.Item label="level">
            {zombie.level.toString()}
          </Descriptions.Item>
          <Descriptions.Item label="winCount">
            {zombie.winCount.toString()}
          </Descriptions.Item>
          <Descriptions.Item label="lossCount">
            {zombie.lossCount.toString()}
          </Descriptions.Item>
          <Descriptions.Item label="readyTime">
            {zombie.readyTime.toString()}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    );
  }

  render() {
    let { zombieInfo } = this.state;
    return (
      <div>
        <Row gutter={[16, 16]} justify="end">
          <Space>
            <Button
              type="primary"
              loading={zombieInfo.loadings}
              onClick={() => this.connectZombie()}
            >
              Connect Metamask
            </Button>

            <Button
              loading={zombieInfo.loadings}
              onClick={() => this.newZombie()}
            >
              Create Zombie
            </Button>
          </Space>
        </Row>
        <Row gutter={16}>
          <Space>
            {zombieInfo.zombieList.length > 0
              ? zombieInfo.zombieList.map((zombie) => (
                  <Col span={8}>{this.showZombie(zombie)}</Col>
                ))
              : ""}
          </Space>
        </Row>
      </div>
    );
  }
}

export default Contract;
