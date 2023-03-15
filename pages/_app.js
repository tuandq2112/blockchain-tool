import CustomLayout from "Layout";
import { Web3Modal } from "@web3modal/react";
import { nonWeb3ModalPaths } from "constants/global";
import { wagmiClient, web3ModalConfig } from "constants/web3modal";
import DefaultHead from "Layout/DefaultHead";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import store from "shared";
import { GlobalStyled } from "styles/styled";
import { WagmiConfig } from "wagmi";

// 4. Wrap your app with WagmiProvider and add <Web3Modal /> compoennt
function App({ Component, pageProps }) {
  const { pathname } = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <Provider store={store}>
      <GlobalStyled />
      <DefaultHead />
      {ready && (
        <WagmiConfig client={wagmiClient}>
          <CustomLayout {...pageProps}>
            <Component />
          </CustomLayout>
        </WagmiConfig>
      )}
      {!nonWeb3ModalPaths.includes(pathname) && (
        <Web3Modal {...web3ModalConfig} />
      )}
    </Provider>
  );
}

export default App;
