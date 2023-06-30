import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { PROJECT_ID } from "env/config";
import { configureChains, createConfig } from "wagmi";
import { bsc, bscTestnet } from "wagmi/chains";

const projectId = PROJECT_ID;
const customTestnet = bscTestnet;
customTestnet.rpcUrls.default = {
  http: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
};
const chains = [bsc, customTestnet];

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ version: 2, chains, projectId }),
  publicClient,
});

// 3. Configure modal ethereum client
export const ethereumClient = new EthereumClient(wagmiConfig, chains);
