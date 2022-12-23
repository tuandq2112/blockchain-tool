import CustomLayout from "Layout";

import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { nonWeb3ModalPaths } from "constants/global";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { GlobalStyled } from "styles/styled";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { bsc, bscTestnet } from "wagmi/chains";

// 1. Get projectID at https://cloud.walletconnect.com
if (!process.env.NEXT_PUBLIC_PROJECT_ID) {
  throw new Error("You need to provide NEXT_PUBLIC_PROJECT_ID env variable");
}

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

// 2. Configure wagmi client
const chains = [
  // mainnet,
  // polygon,
  // optimism,
  // arbitrum,
  // avalanche,
  // fantom,
  bsc,
  bscTestnet,
];
const { provider } = configureChains(chains, [
  walletConnectProvider({ projectId }),
]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({ appName: "web3Modal", chains }),
  provider,
});

// 3. Configure modal ethereum client
export const ethereumClient = new EthereumClient(wagmiClient, chains);

// 4. Wrap your app with WagmiProvider and add <Web3Modal /> compoennt
export default function App({ Component, pageProps }) {
  const { pathname } = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <>
      <GlobalStyled />
      {ready ? (
        <WagmiConfig client={wagmiClient}>
          <CustomLayout {...pageProps}>
            <Component />
          </CustomLayout>
        </WagmiConfig>
      ) : null}

      {!nonWeb3ModalPaths.includes(pathname) && (
        <Web3Modal
          projectId={projectId}
          ethereumClient={ethereumClient}
          themeColor={"blue"}
          themeMode={"light"}
          themeBackground={"gradient"}
          mobileWallets={[
            {
              id: "trust",
              name: "Trust Wallet",
              links: {
                native: "trust://",
                universal: "https://link.trustwallet.com",
              },
            },
            {
              id: "rainbow",
              name: "Rainbow",
              links: { native: "rainbow://", universal: "https://rainbow.me" },
            },
            {
              id: "zerion",
              name: "Zerion",
              links: {
                native: "zerion://",
                universal: "https://wallet.zerion.io",
              },
            },
            {
              id: "tokenary",
              name: "Tokenary",
              links: {
                native: "tokenary://",
                universal: "https://tokenary.io",
              },
            },
          ]}
          // Custom Linking Desktop Wallets
          desktopWallets={[
            {
              id: "ledger",
              name: "Ledger Live",
              links: {
                native: "ledgerlive://",
                universal: "https://www.ledger.com",
              },
            },
            {
              id: "zerion",
              name: "Zerion",
              links: {
                native: "zerion://",
                universal: "https://wallet.zerion.io",
              },
            },
            {
              id: "tokenary",
              name: "Tokenary",
              links: {
                native: "tokenary://",
                universal: "https://tokenary.io",
              },
            },
            {
              id: "oreid",
              name: "OREID",
              links: {
                native: "",
                universal: "https://www.oreid.io/",
              },
            },
          ]}
        />
      )}
    </>
  );
}
