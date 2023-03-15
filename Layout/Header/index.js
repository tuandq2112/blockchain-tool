import { useWeb3Modal } from "@web3modal/react";
import { Drawer, Dropdown, Tooltip } from "antd";
import {
  AvatarDefaultIcon,
  AvatarLoginIcon,
  CardIcon,
  WalletIcon,
} from "assets/svg";
import BaseModal from "components/base/BaseModal";
import { AvatarDropdownConfig, MenuConfig } from "constants/menu";
import useObjectState from "hooks/useObjectState";
import useVerifyAuth from "hooks/useVerifyAuth";
import { createRef } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { CustomMenu, HeaderWrapper } from "./styled";

export const verifyRef = createRef();
function Header() {
  /**
   * @hook
   */
  const { connector, isConnected } = useAccount();
  const { open } = useWeb3Modal();
  const { disconnect } = useDisconnect();
  const [state, setState] = useObjectState();
  const { cartOpen, walletOpen } = state;
  /**
   * @function
   */
  const openCartDrawer = () => {
    setState({ cartOpen: true });
  };

  const closeCartDrawer = () => {
    setState({ cartOpen: false });
  };

  const openWalletDrawer = () => {
    setState({ walletOpen: true });
  };
  const verifyAuthTest = useVerifyAuth({ action: openWalletDrawer });
  const closeWalletDrawer = () => {
    setState({ walletOpen: false });
  };

  return (
    <HeaderWrapper>
      <CustomMenu
        mode="horizontal"
        defaultSelectedKeys={["2"]}
        items={MenuConfig}
      />
      <div>
        <Dropdown
          menu={{ items: AvatarDropdownConfig }}
          placement="bottom"
          disabled={!isConnected}
          trigger="hover"
        >
          <Tooltip title="Account" placement="left">
            {isConnected ? (
              <AvatarLoginIcon />
            ) : (
              <AvatarDefaultIcon onClick={verifyAuthTest} />
            )}{" "}
          </Tooltip>
        </Dropdown>

        <Tooltip title="Wallet" onClick={verifyAuthTest}>
          <WalletIcon />
        </Tooltip>

        <Tooltip title="Cart" onClick={openCartDrawer}>
          <CardIcon />
        </Tooltip>
      </div>

      <Drawer
        title="Your wallet"
        placement="right"
        onClose={closeWalletDrawer}
        open={walletOpen}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>

      <Drawer
        title="Your cart"
        placement="right"
        onClose={closeCartDrawer}
        open={cartOpen}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>
      <BaseModal title="Welcome to OpenHeo" ref={verifyRef}></BaseModal>
    </HeaderWrapper>
  );
}

export default Header;
