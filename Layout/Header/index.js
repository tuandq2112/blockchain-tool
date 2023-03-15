import { useWeb3Modal } from "@web3modal/react";
import { Drawer, Dropdown, Tooltip } from "antd";
import {
  AvatarDefaultIcon,
  AvatarLoginIcon,
  CardIcon,
  WalletIcon
} from "assets/svg";
import MenuConfig from "constants/menu";
import useObjectState from "hooks/useObjectState";
import { useAccount, useDisconnect } from "wagmi";
import { CustomMenu, HeaderWrapper } from "./styled";
const items = [
  {
    key: "1",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.antgroup.com"
      >
        1st menu item
      </a>
    ),
  },
  {
    key: "2",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.aliyun.com"
      >
        2nd menu item
      </a>
    ),
  },
  {
    key: "3",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.luohanacademy.com"
      >
        3rd menu item
      </a>
    ),
  },
];
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
          menu={{ items }}
          placement="bottom"
          disabled={!isConnected}
          trigger="hover"
        >
          <Tooltip title="Account" placement="left">
            {!isConnected ? (
              <AvatarDefaultIcon onClick={open} />
            ) : (
              <AvatarLoginIcon onClick={open} />
            )}{" "}
          </Tooltip>
        </Dropdown>

        <Tooltip title="Wallet" onClick={openWalletDrawer}>
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
    </HeaderWrapper>
  );
}

export default Header;
