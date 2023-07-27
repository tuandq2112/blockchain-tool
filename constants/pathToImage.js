import abiImage from "assets/images/abi.jpg";

import beautyWalletImage from "assets/images/beauty-wallet.jpg";
import convertImage from "assets/images/convert.jpg";
import erc20Image from "assets/images/erc20.jpg";

const pathToImage = {
  "/": { image: abiImage },
  "/tools/blockchain/private": {
    image: convertImage,
    title: "Convert secret phrase to private key",
  },
  "/tools/blockchain/beauty-wallet": {
    image: beautyWalletImage,
    title: "Create beauty wallet",
  },
  "/tools/blockchain/deploy": {
    image: erc20Image,
    title: "BEP20 management",
  },
  "/tools/blockchain/pair": {
    image: beautyWalletImage,
    title: "Support export ivirse",
  },
  "/tools/blockchain/balance-history": {
    image: beautyWalletImage,
    title: "Get balance and balance of history",
  },
};
export default pathToImage;
