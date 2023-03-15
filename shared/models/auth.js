import { LOGIN_INFORMATION } from "constants/key";
import AuthenticationProvider from "data/AuthenticationProvider";
import { save } from "data/LocalStorageProvider";
import moment from "moment/moment";
import { dispatch } from "shared";
import request from "utils/request";
const auth = {
  state: {
    loginInformation: null,
  },
  reducers: {
    updateData(payload = {}, state) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  effects: {
    login: (data, state) => {
      return new Promise((resolve, reject) => {
        AuthenticationProvider.login(data)
          .then((res) => {
            let data = res.data.data;
            console.log(data);
            data.expirationDate = moment
              .unix(moment().unix() + data.expiresIn)
              .format("DD/MM/YYYY HH:mm:ss");
            save(LOGIN_INFORMATION, data);
            dispatch.auth.updateData({ loginInformation: data });
            request.token = data.token;
            resolve(data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
  },
};

export default auth;
