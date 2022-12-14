import { ethers } from "ethers";
export const phraseToPrivateKey = (phrase) => {
  let wallet = ethers.Wallet.fromMnemonic(phrase);
  let signingKey = wallet._signingKey();
  return signingKey.privateKey;
};
export const convertPhrase = (pathName) => {
  let array = pathName.split("/");
  let ignoreEmptyString = array.filter((item) => item);
};

export const loopCreateBeautyWallet = (value, isPrefixes) => {
  return new Promise((resolve, reject) => {
    try {
      let startTime = new Date();
      let stop = true;
      let wallet;
      while (stop) {
        wallet = ethers.Wallet.createRandom();
        let subAddress = wallet.address.substring(2);
        console.log("wallet", wallet);

        if (
          (isPrefixes && subAddress.startsWith(value)) ||
          (!isPrefixes && subAddress.endsWith(value))
        ) {
          stop = false;
        }
      }
      let endTime = new Date();
      resolve({ startTime, endTime, wallet });
    } catch (error) {
      reject(error);
    }
  });
};
