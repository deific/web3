import React from "react";
import {
  Row,
  Col,
  Space,
  Card,
  Input,
  Popconfirm,
  Button,
  Descriptions,
} from "antd";
import {
  EditOutlined,
  EllipsisOutlined,
  ArrowUpOutlined,
  ReloadOutlined,
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
    newName: "",
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

    // const kittyAddress = "0x06012c8cf97BEaD5deAe237070F9587f8E7A266d";
    // let tx = await this.contractInfo.contract.setKittyContractAddress(
    //   kittyAddress
    // );

    await this.showZombies();

    this.contractInfo.contract.on("NewZombie", (id, name, dna) => {
      console.log("new Zombie:", id, name, dna);
    });
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

  async newZombie() {
    // 创建一个僵尸
    let result = await this.contractInfo.contract.createRandomZombie(
      this.state.newName
    );
    console.log(" new zombie result:", result);
    await this.showZombies();
  }

  async feedOnKitty(id) {
    let tx = await this.contractInfo.contract.feedOnKitty(id, 1);
  }

  async levelUp(zombieId) {
    let tx = await this.contractInfo.contract.levelUp(zombieId, {
      value: ethers.utils.parseEther("0.001"),
    });
    await tx.wait();
    console.log(" new zombie result:", tx);
    await this.showZombies();
  }

  renderZombie(id, zombie) {
    return (
      <Card
        title={"Zombie:" + zombie.name}
        actions={[
          <ArrowUpOutlined key="setting" onClick={() => this.levelUp(id)} />,
          this.renderEditDalog(id, zombie),
          <EllipsisOutlined key="ellipsis" onClick={() => this.levelUp(id)} />,
        ]}
        extra={<ReloadOutlined onClick={() => this.feedOnKitty(id)} />}
        key={id}
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

  async changeZombieName(id, zombie) {
    console.log("new name", id, this.state.newName);
    let result = this.contractInfo.contract.changeName(id, this.state.newName);
    console.log(" changeZombieName result:", result);
    await this.showZombies();
  }

  renderEditDalog(id, zombie) {
    return (
      <Popconfirm
        placement="top"
        title={
          <Input
            placeholder="New name"
            onChange={(e) => (this.state.newName = e.target.value)}
          />
        }
        onConfirm={() => this.changeZombieName(id, zombie)}
        okText="Yes"
        cancelText="No"
      >
        <EditOutlined key="edit" />
      </Popconfirm>
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

            <Popconfirm
              placement="top"
              title={
                <Input
                  placeholder="Name"
                  onChange={(e) => (this.state.newName = e.target.value)}
                />
              }
              onConfirm={() => this.newZombie()}
              okText="Yes"
              cancelText="No"
            >
              <Button loading={zombieInfo.loadings}>Create Zombie</Button>
            </Popconfirm>
          </Space>
        </Row>
        <Row gutter={16}>
          <Space>
            {zombieInfo.zombieList.length > 0
              ? zombieInfo.zombieList.map((zombie, id) => (
                  <Col span={8}>{this.renderZombie(id, zombie)}</Col>
                ))
              : ""}
          </Space>
        </Row>
      </div>
    );
  }
}

export default Contract;
