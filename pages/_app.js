import { Web3Modal } from "@web3modal/react";
import CustomLayout from "Layout";
import DefaultHead from "Layout/DefaultHead";
import { ConfigProvider, message } from "antd";
import { nonWeb3ModalPaths } from "constants/global";
import {
  ethereumClient,
  recommendWalletIDs,
  wagmiConfig,
} from "constants/web3modal";
import { PROJECT_ID } from "env/config";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import store from "shared";
import { GlobalStyled } from "styles/styled";
import { WagmiConfig } from "wagmi";
import { Turnstile } from 'react-turnstile';
import axios from "axios";
import Script from 'next/script';

BigInt.prototype.toJSON = function () {
  return this.toString();
};

message.config({
  duration: 2,
  maxCount: 2,
});

function App({ Component, pageProps }) {
  const { pathname } = useRouter();
  const [isVerify, setVerify] = useState(false);

  const handleVerify = async (token) => {
    if (token) {
      setVerify(true);
    } else {
      setVerify(false);
    }
  };
  const isProduction = process.env.NODE_ENV === "production";

  return <>
    <DefaultHead />
    {isProduction && <> <Script
      src="https://challenges.cloudflare.com/turnstile/v0/api.js"
      onLoad={() => {
        window.turnstile?.render('#turnstile-widget', {
          sitekey: "0x4AAAAAAAzbUXu9tBbouE2A",
          callback: handleVerify,
        });
      }}
    />
      <div id="turnstile-widget"></div>
    </>}
    {isVerify?"True":"false"}
    {((isProduction && isVerify) || !isProduction) && <ConfigProvider>
      <Provider store={store}>
        <GlobalStyled />
        <WagmiConfig config={wagmiConfig}>
          <CustomLayout>
            <Component {...pageProps} />
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
    </ConfigProvider>}


  </>
}

export default App;
