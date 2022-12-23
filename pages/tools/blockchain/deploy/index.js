import { useWeb3Modal } from "@web3modal/react";
import { Button, Col, Input, message, Row, Table } from "antd";
import Erc20Builder from "builder/Erc20Builder";
import BaseModal from "components/base/BaseModal";
import { read, save } from "data/LocalStorageProvider";
import { ethers } from "ethers";
import useObjectState from "hooks/useObjectState";
import { isEmpty } from "lodash";
import { useEffect, useRef } from "react";
import { DeployWrapper } from "styles/styled";
import { deployContract, toDecimal } from "utils";
import { useAccount, useDisconnect } from "wagmi";
function Deploy() {
  //Hooks
  const { connector, isConnected } = useAccount();
  const [state, setState] = useObjectState();
  const mintRef = useRef();
  //Functions
  const deployNewERC20 = async () => {
    debugger;

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
    save("tokens", newTokens);
  };

  const getData = () => {
    let tokens = read("tokens");
    setState({ tokens });
  };

  const getContracts = async () => {
    let tokens = state.tokens;
    let signer = await connector.getSigner();

    let contracts = await Promise.all(
      tokens.map(async (item) => {
        let contract = new ethers.Contract(item, Erc20Builder.abi, signer);
        let balanceOf = await contract.balanceOf(await signer.getAddress());
        let name = await contract.name();
        let symbol = await contract.symbol();
        let owner = await contract.owner();
        let address = item;

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

  const columns = [
    { title: "Address", dataIndex: "address", key: "address" },
    // { title: "Owner", dataIndex: "owner", key: "owner" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Symbol", dataIndex: "symbol", key: "symbol" },
    { title: "Balance Of", dataIndex: "balanceOf", key: "balanceOf" },
    { title: "Action", dataIndex: "contract", key: "contract" },
  ];
  //Effects
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (!isEmpty(state.tokens) && connector) {
      getContracts();
    }
  }, [state.tokens, connector]);

  return (
    <DeployWrapper>
      <Row gutter={[24, 24]}>
        <Col lg={12} xs={24}>
          <h1>Deploy new token ERC20</h1>{" "}
          <Input
            placeholder="Name"
            onChange={handleChangeInput}
            name="name"
            value={state.name}
          ></Input>
          <Input
            placeholder="Symbol"
            onChange={handleChangeInput}
            name="symbol"
            value={state.symbol}
          ></Input>
          <Button onClick={deployNewERC20} disabled={!isConnected}>
            Deploy erc20 contract
          </Button>
        </Col>
        <Col span={24}>
          <h1>Tokens</h1>{" "}
          <Table
            dataSource={state?.contracts}
            rowKey="address"
            columns={columns}
          />
        </Col>
      </Row>
      <BaseModal ref={mintRef} />
    </DeployWrapper>
  );
}
export async function getStaticProps() {
  return {
    props: {},
  };
}
export default Deploy;
