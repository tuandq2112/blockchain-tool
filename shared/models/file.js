import FileProvider from "data/FileProvider";
const auth = {
  state: {},
  reducers: {
    updateData(payload = {}, state) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  effects: {
    uploadSingleFile: (data, state) => {
      return new Promise((resolve, reject) => {
        FileProvider.uploadSingleFile(data)
          .then((res) => {
            resolve(res.data.data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },

    getSingleFile: (url) => {
      return new Promise((resolve, reject) => {
        FileProvider.getSingleFile(url)
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
  },
};

export default auth;
