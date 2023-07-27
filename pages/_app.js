import { Web3Modal } from "@web3modal/react";
import CustomLayout from "Layout";
import DefaultHead from "Layout/DefaultHead";
import { ConfigProvider, message } from "antd";
import { nonWeb3ModalPaths } from "constants/global";
import { ethereumClient, recommendWalletIDs, wagmiConfig } from "constants/web3modal";
import { PROJECT_ID } from "env/config";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import store from "shared";
import { CenterDiv, GlobalStyled } from "styles/styled";
import { WagmiConfig } from "wagmi";

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
  return (
    <>
      <DefaultHead />
      {loading ? (
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
            <WagmiConfig config={wagmiConfig}>
              <CustomLayout {...pageProps}>
                <Component />
              </CustomLayout>
            </WagmiConfig>
            {!nonWeb3ModalPaths.includes(pathname) && (
              <Web3Modal
                projectId={PROJECT_ID}
                ethereumClient={ethereumClient}
                explorerRecommendedWalletIds={recommendWalletIDs}
              />
            )}
          </Provider>
        </ConfigProvider>
      )}
    </>
  );
}

export default App;
