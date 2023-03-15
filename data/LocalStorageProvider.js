import CryptoJS from "crypto-js";
import { SECRET_KEY } from "env/config";
export const save = (key, value) => {
  return new Promise((resolve, reject) => {
    try {
      var data = {
        value,
      };
      let encryptData = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY);
      localStorage.setItem(key, encryptData.toString());
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

export const read = (key, defaultValue) => {
  if (localStorage.hasOwnProperty(key)) {
    var item = localStorage.getItem(key);
    item = CryptoJS.AES.decrypt(item, SECRET_KEY).toString(CryptoJS.enc.Utf8);
    if (item)
      try {
        var data = JSON.parse(item);

        if (data && data.value) {
          return data.value;
        }
      } catch (error) {}
  }
  return defaultValue;
};
