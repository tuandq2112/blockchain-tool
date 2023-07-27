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
export const recommendWalletIDs = [
  "060da523cddd8e2ce9c60dfff883f293b911c8e7e17ec8c70174069e9b5e716d",
  "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96",
  "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0",
  "1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369",
];
