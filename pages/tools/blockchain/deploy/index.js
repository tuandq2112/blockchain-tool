import { getContract, waitForTransaction } from "@wagmi/core";
import { Button, Col, Form, Input, Row, Space, Table, message } from "antd";
import { DeleteIcon, HoeIcon } from "assets/svg";
import Erc20Builder from "builder/Erc20Builder";
import BaseModal from "components/base/BaseModal";
import { read, save } from "data/LocalStorageProvider";
import { ethers } from "ethers";
import useObjectState from "hooks/useObjectState";
import { isEmpty } from "lodash";
import { useEffect, useRef } from "react";
import { DeployWrapper } from "styles/styled";
import { getContractInstance, parseEther, toDecimal } from "utils";
import { useAccount, useNetwork, useWalletClient } from "wagmi";
function Deploy() {
  //Hooks
  const { connector, isConnected, address } = useAccount();
  const { data: walletClient } = useWalletClient();

  const [state, setState] = useObjectState();
  const mintRef = useRef();
  const { chain, chains } = useNetwork();

  useEffect(() => {
    if (chain) {
      getData();
    }
  }, [chain]);

  useEffect(() => {
    if (isConnected && address) {
      if (!isEmpty(state.tokens)) {
        getContracts();
      } else {
        setState({ contracts: [] });
      }
    }
  }, [state.tokens, isConnected, address]);
  //Functions
  const deployNewERC20 = async () => {
    walletClient
      .deployContract({
        abi: Erc20Builder.abi,
        bytecode: Erc20Builder.bytecode,
        args: [state.name, state.symbol],
      })
      .then(async (hash) => {
        return await waitForTransaction({ hash });
      })
      .then((res) => {
        addToken(res.contractAddress);
      });
  };
  const handleChangeInput = (event) => {
    setState({ [event.target.name]: event.target.value });
  };

  const saveData = (newTokens = []) => {
    save(chain.id, newTokens);
  };

  const getData = () => {
    let tokens = read(chain.id);
    setState({ tokens });
  };

  const getContracts = async () => {
    setState({ loading: true });
    let tokens = state.tokens;
    let contracts = await Promise.all(
      tokens.map(async (item) => {
        let contract = getContract({
          address: item,
          abi: Erc20Builder.abi,
          walletClient,
        });
        let balanceOf = await contract.read.balanceOf([address]);
        let name = await contract.read.name();
        let symbol = await contract.read.symbol();
        let smcAddress = item;
        let owner;
        try {
          owner = await contract.read.owner();
        } catch (error) {
          owner = "Not have owner";
        }

        return {
          address: smcAddress,
          name,
          symbol,
          balanceOf: toDecimal(balanceOf),
          contract,
          owner,
        };
      })
    );
    setState({ contracts, loading: false });
  };

  const addToken = async (contract) => {
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
      saveData(newToken);
      setState({ tokens: newToken });
      message.success("Delete successfully!");
    } catch (error) {
      message.success("Delete fail!");
    }
  };

  const submit = async (record) => {
    const library = new ethers.providers.Web3Provider(walletClient);
    let erc20 = getContractInstance(
      record.address,
      Erc20Builder.abi,
      library.getSigner()
    );
    await form.validateFields().then(async (res) => {
      await erc20
        .mint(res.address, parseEther(res.amount))
        .then((res) => {
          return res.wait();
        })
        .then((res) => {
          message.success("Mint success!");
          getContracts();
        })
        .catch((err) => {
          message.error(err?.reason);
        });
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
    { title: "Index", dataIndex: "index", key: "index", width: 70 },
    { title: "Address", dataIndex: "address", key: "address", width: 250 },
    { title: "Owner", dataIndex: "owner", key: "owner", width: 250 },
    { title: "Name", dataIndex: "name", key: "name", width: 100 },
    { title: "Symbol", dataIndex: "symbol", key: "symbol", width: 100 },
    {
      title: "Balance",
      dataIndex: "balanceOf",
      key: "balanceOf",
      width: 150,
    },
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
            dataSource={state?.contracts?.map((item, index) => ({
              ...item,
              index: index + 1,
            }))}
            rowKey="index"
            columns={columns}
            scroll={{ y: 500, x: 800 }}
            tableLayout="fixed"
            loading={state.loading}
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
