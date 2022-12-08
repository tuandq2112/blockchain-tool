import { ethers } from "ethers";
export const phraseToPrivateKey = (phrase) => {
  let wallet = ethers.Wallet.fromMnemonic(phrase);
  let signingKey = wallet._signingKey();
  return signingKey.privateKey;
};
export const convertPhrase = (pathName) =>{
    let array = pathName.split("/");
    let ignoreEmptyString = array.filter(item=>item);
    
}