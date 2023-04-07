import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from "@web3modal/ethereum";
import { PROJECT_ID } from "env/config";
import { configureChains, createClient } from "wagmi";
import { bsc, bscTestnet } from "wagmi/chains";
if (!PROJECT_ID) {
  throw new Error("You need to provide NEXT_PUBLIC_PROJECT_ID env variable");
}

const customTestnet = bscTestnet;
customTestnet.rpcUrls.default = {
  http: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
};
console.log(customTestnet);
const chains = [bsc, customTestnet];
const { provider } = configureChains(chains, [
  walletConnectProvider({ projectId: PROJECT_ID }),
]);

export const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({ appName: "web3Modal", chains }),
  provider,
});

// 3. Configure modal ethereum client
export const ethereumClient = new EthereumClient(wagmiClient, chains);
export const web3ModalConfig = {
  projectId: PROJECT_ID,
  ethereumClient,
  themeColor: "blue",
  themeMode: "light",
  themeBackground: "gradient",
  mobileWallets: [
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
      links: {
        native: "rainbow://",
        universal: "https://rainbow.me",
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
  ],
  desktopWallets: [
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
  ],
};
