import { Web3Modal } from "@web3modal/react";
import CustomLayout from "Layout";
import DefaultHead from "Layout/DefaultHead";
import { ConfigProvider, message } from "antd";
import { nonWeb3ModalPaths } from "constants/global";
import { ethereumClient, wagmiConfig } from "constants/web3modal";
import { PROJECT_ID } from "env/config";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import store from "shared";
import { CenterDiv, GlobalStyled } from "styles/styled";
import { WagmiConfig } from "wagmi";
import Image from "next/image";

message.config({
  duration: 2,
  maxCount: 2,
});

function App({ Component, pageProps }) {
  const { pathname } = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  }, []);
  return loading ? (
    <CenterDiv>
      <Image
        alt="Picture of the author"
        src={"/wait.gif"}
        width="500"
        height="500"
      />{" "}
    </CenterDiv>
  ) : (
    <ConfigProvider>
      <Provider store={store}>
        <GlobalStyled />
        <DefaultHead />
        <WagmiConfig config={wagmiConfig}>
          <CustomLayout {...pageProps}>
            <Component />
          </CustomLayout>
        </WagmiConfig>
        {!nonWeb3ModalPaths.includes(pathname) && (
          <Web3Modal
            projectId={PROJECT_ID}
            ethereumClient={ethereumClient}
            explorerRecommendedWalletIds={[
              "060da523cddd8e2ce9c60dfff883f293b911c8e7e17ec8c70174069e9b5e716d",
              "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96",
              "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0",
              "1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369",
            ]}
          />
        )}
      </Provider>
    </ConfigProvider>
  );
}

export default App;
