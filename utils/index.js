import { ContractFactory, ethers } from "ethers";
export const phraseToPrivateKey = (phrase) => {
  let wallet = ethers.Wallet.fromMnemonic(phrase);
  let signingKey = wallet._signingKey();
  return signingKey.privateKey;
};
export const convertPhrase = (pathName) => {
  let array = pathName.split("/");
  let ignoreEmptyString = array.filter((item) => item);
};
//Functions
async function sleep(ms = 1000) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
export const loopCreateBeautyWallet = (
  value,
  isPrefixes,
  callback = () => {}
) => {
  return new Promise(async (resolve, reject) => {
    try {
      let startTime = new Date();
      let stop = true;
      let wallet;
      let i = 0;
      while (stop) {
        wallet = ethers.Wallet.createRandom();
        let subAddress = wallet.address.substring(2);
        if (i && i % 10 == 0) {
          callback(i);
          await sleep();
        }
        i++;
        if (
          (isPrefixes && subAddress.startsWith(value)) ||
          (!isPrefixes && subAddress.endsWith(value))
        ) {
          stop = false;
        }
      }
      callback(i);

      let endTime = new Date();
      resolve({ startTime, endTime, wallet });
    } catch (error) {
      reject(error);
    }
  });
};
export const deployContract = async (args, fileBuild, account) => {
  return new Promise(async (resolve, reject) => {
    try {
      const factory = new ContractFactory(
        fileBuild.abi,
        fileBuild.bytecode,
        account
      );
      const contract = await factory.deploy(...args);
      resolve(contract);
    } catch (error) {
      reject(error);
    }
  });
};
export const toDecimal = (amount) => {
  return amount ? ethers.utils.formatUnits(amount, "ether") : 0;
};

export const toNumber = (amount) => {
  return amount ? ethers.utils.formatUnits(amount, 0) : 0;
};
export const parseEther = (amount) => {
  return ethers.utils.parseEther(amount);
};
