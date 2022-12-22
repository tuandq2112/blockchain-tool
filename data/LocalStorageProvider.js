import CryptoJS from "crypto-js";
export const save = (key, value) => {
  return new Promise((resolve, reject) => {
    try {
      var data = {
        value,
      };
      let encryptData = CryptoJS.AES.encrypt(
        JSON.stringify(data),
        process.env.NEXT_PUBLIC_PROJECT_SECRET_KEY
      );
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
    item = CryptoJS.AES.decrypt(
      item,
      process.env.NEXT_PUBLIC_PROJECT_SECRET_KEY
    ).toString(CryptoJS.enc.Utf8);
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
