import { Button, Col, Form, Input, message, Row, Space, Table } from "antd";
import { DeleteIcon, HoeIcon } from "assets/svg";
import Erc20Builder from "builder/Erc20Builder";
import BaseModal from "components/base/BaseModal";
import { read, save } from "data/LocalStorageProvider";
import { ethers } from "ethers";
import useObjectState from "hooks/useObjectState";
import { isEmpty } from "lodash";
import { useEffect, useRef } from "react";
import { DeployWrapper } from "styles/styled";
import {
  deployContract,
  getContractInstance,
  parseEther,
  toDecimal,
} from "utils";
import { useAccount } from "wagmi";
function Deploy() {
  //Hooks
  const { connector, isConnected } = useAccount();
  const [state, setState] = useObjectState();
  const mintRef = useRef();

  useEffect(() => {
    if (state.chainId) {
      getData();
    }
  }, [state.chainId]);

  useEffect(() => {
    if (connector) {
      if (!isEmpty(state.tokens)) {
        getContracts();
      } else {
        setState({ contracts: [] });
      }
      getChainId();
    }
  }, [state.tokens, connector]);
  //Functions
  const deployNewERC20 = async () => {
    let signer = await connector.getSigner();
    deployContract([state.name, state.symbol], Erc20Builder, signer)
      .then((res) => {
        let newToken = Object.assign([], state.tokens);
        newToken.push(res.address);
        saveData(newToken);
        setState({ tokens: newToken });
        message.success("Create successfully!");
      })
      .catch((err) => {
        message.error("Create fail!");
      });
  };
  const handleChangeInput = (event) => {
    setState({ [event.target.name]: event.target.value });
  };

  const saveData = (newTokens = []) => {
    save(state.chainId, newTokens);
  };

  const getData = () => {
    let tokens = read(state.chainId);
    setState({ tokens });
  };

  const getContracts = async () => {
    let tokens = state.tokens;
    let signer = await connector.getSigner();
    let currentAccount = await signer.getAddress();
    let contracts = await Promise.all(
      tokens.map(async (item) => {
        let contract = getContractInstance(item, Erc20Builder.abi, signer);
        let balanceOf = await contract.balanceOf(currentAccount);
        let name = await contract.name();
        let symbol = await contract.symbol();
        let address = item;
        let owner;
        try {
          owner = await contract.owner();
        } catch (error) {
          owner = "Not have owner";
        }

        return {
          address,
          name,
          symbol,
          balanceOf: toDecimal(balanceOf),
          contract,
          owner,
        };
      })
    );
    setState({ contracts });
  };
  const importToken = async () => {
    const contract = state.address;

    if (ethers.utils.isAddress(contract)) {
      let newToken = Object.assign([], state.tokens);
      newToken.push(contract);
      saveData(newToken);
      setState({ tokens: newToken });
      message.success("Import token successfully!");
    } else {
      message.error("Invalid address");
    }
  };
  const removeToken = (index) => async () => {
    try {
      let newToken = Object.assign([], state.tokens);
      newToken.splice(index, 1);
      debugger;

      saveData(newToken);
      setState({ tokens: newToken });
      message.success("Delete successfully!");
    } catch (error) {
      message.success("Delete fail!");
    }
  };
  const getChainId = async () => {
    setState({ chainId: await connector.getChainId() });
  };
  const submit = async (record) => {
    let erc20 = getContractInstance(
      record.address,
      Erc20Builder.abi,
      await connector.getSigner()
    );
    await form
      .validateFields()
      .then(async (res) => {
        await erc20
          .mint(res.address, parseEther(res.amount))
          .then((res) => {
            return res.wait();
          })
          .then((res) => {
            message.success("Mint success!");
            getContracts();
          });
      })
      .catch((err) => {
        message.error("Mint fail!");
      });
  };
  const showModal = (record) => () => {
    mintRef?.current?.show({
      submit: () => {
        submit(record);
      },
    });
  };

  const columns = [
    { title: "Address", dataIndex: "address", key: "address" },
    { title: "Owner", dataIndex: "owner", key: "owner" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Symbol", dataIndex: "symbol", key: "symbol" },
    { title: "Balance Of", dataIndex: "balanceOf", key: "balanceOf" },
    {
      title: "Action",
      dataIndex: "contract",
      key: "contract",
      align: "center",
      render: (_, record, index) => {
        return (
          <Space>
            <Button onClick={showModal(record)}>
              <HoeIcon />
            </Button>
            <Button onClick={removeToken(index)}>
              <DeleteIcon />
            </Button>
          </Space>
        );
      },
    },
  ];
  //Effects
  const [form] = Form.useForm();
  const renderForm = () => {
    return (
      <Form layout="vertical" form={form}>
        <Form.Item
          name={"address"}
          label="Address"
          rules={[{ required: true, message: "Please input address!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={"amount"}
          label="Amount"
          rules={[{ required: true, message: "Please input amount!" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    );
  };

  return (
    <DeployWrapper>
      <Row gutter={[24, 24]}>
        <Col lg={12} xs={24}>
          <h1>Deploy new token</h1>{" "}
          <Space>
            <Input
              placeholder="Input name"
              onChange={handleChangeInput}
              name="name"
              value={state.name}
            ></Input>
            <Input
              placeholder="Input symbol"
              onChange={handleChangeInput}
              name="symbol"
              value={state.symbol}
            ></Input>
            <Button
              onClick={deployNewERC20}
              disabled={!isConnected || !state.name || !state.symbol}
            >
              Deploy
            </Button>
          </Space>
        </Col>

        <Col lg={12} xs={24}>
          <h1>Import token</h1>{" "}
          <Space>
            <Input
              placeholder="Input address"
              onChange={handleChangeInput}
              name="address"
              value={state.address}
            ></Input>

            <Button
              onClick={importToken}
              disabled={!isConnected || !state.address}
            >
              Import
            </Button>
          </Space>
        </Col>

        <Col span={24}>
          <h1>Token manage</h1>{" "}
          <Table
            dataSource={state?.contracts}
            rowKey="address"
            columns={columns}
          />
        </Col>
      </Row>
      <BaseModal
        title="Mint (only owner)"
        submitText="Mint"
        ref={mintRef}
        renderForm={renderForm}
      />
    </DeployWrapper>
  );
}
export async function getStaticProps() {
  return {
    props: {},
  };
}
export default Deploy;
