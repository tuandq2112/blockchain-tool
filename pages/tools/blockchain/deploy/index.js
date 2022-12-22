import { useWeb3Modal } from "@web3modal/react";
import { Button, Col, Input, message, Row } from "antd";
import Erc20Builder from "builder/Erc20Builder";
import useObjectState from "hooks/useObjectState";
import { DeployWrapper } from "styles/styled";
import { deployContract } from "utils";
import { useAccount, useDisconnect } from "wagmi";
function Deploy() {
  const { isOpen, open, close } = useWeb3Modal();
  const { connector, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [state, setState] = useObjectState();

  const deployNewERC20 = async () => {
    let signer = await connector.getSigner();
    deployContract([state.name, state.symbol], Erc20Builder, signer)
      .then((res) => {
        console.log(res);
        message.success("Create successfully!");
      })
      .catch((err) => {
        message.error("Create fail!");
      });
  };
  const handleChangeInput = (event) => {
    setState({ [event.target.name]: event.target.value });
  };
  return (
    <DeployWrapper>
      <Row gutter={[24, 24]}>
        <Col span={8}>
          {!isConnected ? (
            <Button onClick={open}>Connect wallet</Button>
          ) : (
            <Button onClick={disconnect}>Disconnect</Button>
          )}{" "}
        </Col>
        <Col span={8}>
          {" "}
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
          <Button onClick={deployNewERC20}>Deploy erc20 contract</Button>
        </Col>
        <Col span={8}></Col>
      </Row>
    </DeployWrapper>
  );
}

export default Deploy;
