import { message } from "antd";
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
      resolve(await contract.deployed());
    } catch (error) {
      reject(error);
    }
  });
};

export const getContractInstance = (address, abi, signer) => {
  return new ethers.Contract(address, abi, signer);
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

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
const convertOneRecord = (typeData, values) => {
  let type = typeData.type;
  
  if (
    (type.startsWith("uint") || type.startsWith("int")) &&
    !type.includes("[]")
  ) {
    return values.toString();
  } else if (type == "tuple[]") {
    let components = typeData.components;
    let result = [];
    for (let i = 0; i < values.length; i++) {
      let response = {};

      for (let j = 0; j < components.length; j++) {
        const component = components[j];
        const name = component.name;
        response[name] = convertOneRecord(component, values[i][name]);
      }
      result.push(response);
    }
    return result;
  } else if (
    (type.startsWith("uint") || type.startsWith("int")) &&
    type.endsWith("[]")
  ) {
    let result = [];
    for (let index = 0; index < values.length; index++) {
      const element = values[index];
      result.push(element.toString());
    }
    return result;
  } else {
    return values?.toString();
  }
};
export function convertOutput(outputs, values) {
  debugger
  if (outputs.length == 1) {
    return [convertOneRecord(outputs[0], values)];
  } else {
    let result = [];
    for (let index = 0; index < outputs.length; index++) {
      const output = outputs[index];
      let data = convertOneRecord(output, values[index]);
      result.push(data);
    }

    return result;
  }
}
export const copyToClipBoard = async (
  text = "",
  notificationText = "Copy successfully!"
) => {
  await navigator.clipboard.writeText(text);
  message.success(notificationText);
};
export const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
