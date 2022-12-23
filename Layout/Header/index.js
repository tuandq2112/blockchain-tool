import { useWeb3Modal } from "@web3modal/react";
import { Button } from "antd";
import MenuConfig from "constants/menu";
import { useAccount, useDisconnect } from "wagmi";
import { CustomMenu, HeaderWrapper } from "./styled";

function Header() {
  const { connector, isConnected } = useAccount();
  const { isOpen, open, close } = useWeb3Modal();
  const { disconnect } = useDisconnect();
  console.log(isConnected);
  return (
    <HeaderWrapper>
      <CustomMenu
        mode="horizontal"
        defaultSelectedKeys={["2"]}
        items={MenuConfig}
      />
      <div>
        {!isConnected ? (
          <Button onClick={open} type="primary">
            Connect wallet
          </Button>
        ) : (
          <Button onClick={disconnect} type="primary">
            Disconnect
          </Button>
        )}{" "}
      </div>
    </HeaderWrapper>
  );
}

export default Header;
