import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { PROJECT_ID } from "env/config";
import { configureChains, createConfig } from "wagmi";
import { bsc, bscTestnet } from "wagmi/chains";

const projectId = PROJECT_ID;

const chains = [bsc, bscTestnet];

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ version: 2, chains, projectId }),
  publicClient,
});

// 3. Configure modal ethereum client
export const ethereumClient = new EthereumClient(wagmiConfig, chains);
