import { useWeb3Modal } from "@web3modal/react";
import { Drawer, Dropdown, Tooltip, message } from "antd";
import { AvatarLoginIcon } from "assets/svg";
import BaseModal from "components/base/BaseModal";
import { LOGIN_INFORMATION } from "constants/key";
import { AvatarDropdownConfig, MenuConfig } from "constants/menu";
import { read } from "data/LocalStorageProvider";
import { SIGN_MESSAGE } from "env/config";
import useObjectState from "hooks/useObjectState";
import moment from "moment";
import { createRef } from "react";
import { useDispatch } from "react-redux";
import request from "utils/request";
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
  const { login, updateData } = useDispatch().auth;

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
  const onLogin = async () => {
    let loginInformation = await read(LOGIN_INFORMATION);
    const isValidInformation =
      loginInformation &&
      moment() < moment(loginInformation.expirationDate, "DD/MM/YYYY HH:mm:ss");

    if (isValidInformation) {
      updateData({ loginInformation });
      request.token = loginInformation.token;
    } else {
      const signer = await connector.getSigner();

      const address = await signer.getAddress();
      const signMessage = SIGN_MESSAGE + address;

      signer
        .signMessage(signMessage)
        .then(async (signature) => {
          const payload = { message: signMessage, address, signature };
          await login(payload);
        })
        .catch((err) => {
          message.error(err?.reason || err?.message);
        });
    }
  };

  return (
    <HeaderWrapper>
      <CustomMenu
        mode="horizontal"
        defaultSelectedKeys={["2"]}
        items={MenuConfig}
      />
      <div>
        {/* <Dropdown
          menu={{ items: AvatarDropdownConfig }}
          placement="bottom"
          disabled={!isConnected}
          trigger="hover"
        > */}
          <Tooltip title="Account" placement="left">
            <AvatarLoginIcon onClick={open} />
          </Tooltip>
        {/* </Dropdown> */}

        {/* <Tooltip title="Wallet" onClick={onLogin}>
          <WalletIcon />
        </Tooltip>

        <Tooltip title="Cart" onClick={openCartDrawer}>
          <CardIcon />
        </Tooltip> */}
      </div>

      {/* <Drawer
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
      </Drawer> */}
      {/* <BaseModal title="Welcome to OpenHeo" ref={verifyRef}></BaseModal> */}
    </HeaderWrapper>
  );
}

export default Header;
