import { useWeb3Modal } from "@web3modal/react";
import { Dropdown, Select, Tooltip, message } from "antd";
import { AvatarLoginIcon } from "assets/svg";
import { LOGIN_INFORMATION } from "constants/key";
import { MenuConfig } from "constants/menu";
import { read } from "data/LocalStorageProvider";
import { SIGN_MESSAGE } from "env/config";
import useObjectState from "hooks/useObjectState";
import moment from "moment";
import { createRef } from "react";
import { useDispatch } from "react-redux";
import request from "utils/request";
import { useAccount, useDisconnect, useNetwork, useSwitchNetwork } from "wagmi";
import { CustomMenu, HeaderWrapper } from "./styled";

export const verifyRef = createRef();
function Header() {
  /**
   * @hook
   */
  const { connector, isConnected, address } = useAccount();
  const { open } = useWeb3Modal();
  const { disconnect } = useDisconnect();
  const [state, setState] = useObjectState();
  const { cartOpen, walletOpen } = state;
  const { login, updateData } = useDispatch().auth;
  const { chains, chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
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
      <div style={{ display: "flex", gap: "20px" }}>
        <Tooltip title={address}>
          <strong
            style={{
              width: "100px",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textAlign: "center",
              verticalAlign: "middle",
              lineHeight: "30px",
            }}
          >
            {address}
          </strong>
        </Tooltip>{" "}
        <Dropdown
          menu={{
            items: [
              {
                key: "1",
                label: <strong onClick={disconnect}>Disconnect</strong>,
              },
            ],
          }}
          placement="bottom"
          disabled={!isConnected}
          trigger="hover"
        >
          <AvatarLoginIcon onClick={open} />
        </Dropdown>
        <Select
          options={(chains || []).map((item) => ({
            label: item.name,
            value: item.id,
          }))}
          value={chain?.id}
          onChange={switchNetwork}
        />
        {/* <Tooltip title={"Click to view detail"}> */}
        {/* </Tooltip> */}
      </div>
      {/* <div> */}

      {/* <Tooltip title="Wallet" onClick={onLogin}>
          <WalletIcon />
        </Tooltip>

        <Tooltip title="Cart" onClick={openCartDrawer}>
          <CardIcon />
        </Tooltip> */}
      {/* </div> */}

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
