import React from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import "./App.less"
import Contract from "./pages/Contact.jsx"
import ZombieOwnership from "./pages/ZombieOwnership.jsx"
const { Header, Content, Footer, Sider } = Layout;
const items1 = ['Home', 'Zombies'].map((key) => ({
  key,
  label: `${key}`,
}));

const menu = [
  {
    key: "zombies",
    icon: React.createElement(UserOutlined),
    label: "zombies"
  },
  {
    key: "rank",
    icon: React.createElement(LaptopOutlined),
    label: "rank"
  },
  {
    key: "trading",
    icon: React.createElement(NotificationOutlined),
    label: "trading"
  },
]

const App = () => (
  <Layout className="app">
    <Header className="header">
      <div className="logo" />
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} items={items1} />
    </Header>
    <Content
      style={{
        padding: '0 50px',
      }}
    >
      <Breadcrumb
        style={{
          margin: '16px 0',
        }}
      >
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>App</Breadcrumb.Item>
      </Breadcrumb>
      <Layout className="site-layout-background" height="100%" style={{height: '100%'}}>
        <Sider className="site-layout-background" width={200}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['zombies']}
            style={{
              height: '100%',
            }}
            items={menu}
          />
        </Sider>
        <Content
          style={{
            padding: '0 24px',
            minHeight: 280,
          }}
        >
          <ZombieOwnership/>
        </Content>
      </Layout>
    </Content>
    <Footer
      style={{
        textAlign: 'center',
      }}
    >
      Ant Design ©2018 Created by Ant UED
    </Footer>
  </Layout>
);

export default App;