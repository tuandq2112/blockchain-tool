import { useWeb3Modal } from "@web3modal/react";
import { LOGIN_INFORMATION } from "constants/key";
import { read } from "data/LocalStorageProvider";
import { SIGN_MESSAGE } from "env/config";
import moment from "moment";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import request from "utils/request";
import { useAccount, useDisconnect } from "wagmi";

function useVerifyAuth({ action = () => {} }) {
  const { disconnect } = useDisconnect();
  const { connector, isConnected } = useAccount();
  const { open, isOpen } = useWeb3Modal();

  const { login, updateData } = useDispatch().auth;
  useEffect(() => {
    if (!isOpen && isConnected && connector) {
      onLogin();
    }
  }, [isOpen, isConnected, connector]);

  const onLogin = async () => {
    let loginInformation = await read(LOGIN_INFORMATION);
    const isValidInformation =
      loginInformation && moment() < moment(loginInformation.expirationDate);

    if (isValidInformation) {
      updateData({ loginInformation });
      request.token = loginInformation.token;
    } else {
      const signer = await connector.getSigner();
      const address = await signer.getAddress();
      const message = SIGN_MESSAGE + address;

      signer
        .signMessage(message)
        .then(async (signature) => {
          const payload = { message, address, signature };
          await login(payload);
        })
        .catch((err) => {
          onLogin();
        });
    }
  };

  const { loginInformation } = useSelector((state) => state.auth);
  const verifyFunction = () => {
    if (loginInformation) {
      action();
    } else {
      open();
    }
  };
  return verifyFunction;
}

export default useVerifyAuth;
