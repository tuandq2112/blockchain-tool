import axios from "axios";
import { SERVICE_URL, TIMEOUT } from "env/config";

const request = {
  token: "",
  serviceUrl: SERVICE_URL,
  requestAxios({
    method = "",
    url = "",
    params = {},
    data,
    timeout = TIMEOUT,
    isUseServiceUrl = true,
    headers,
    responseType,
  }) {
    url = isUseServiceUrl ? this.serviceUrl + url : url;

    return new Promise((resolve, reject) => {
      axios({
        responseType,
        method,
        url,
        params,
        timeout,
        data,
        headers: headers
          ? headers
          : {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.token}`,
            },
      })
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  requestApi({ method, url, data }) {
    return new Promise((resolve, reject) => {
      this.requestAxios({
        method,
        url,
        data,
      })
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  requestFile({ method, url, file }) {
    let data = new FormData();
    data.append("file", file);

    return new Promise((resolve, reject) => {
      this.requestAxios({
        method,
        url,
        data,
        headers: {
          "Content-Type": "application/form-data",
          Authorization: `Bearer ${this.token}`,
        },
      })
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  getFile({ url }) {
    return new Promise((resolve, reject) => {
      this.requestAxios({
        method: "GET",
        url,
        headers: {
          "Content-Type": "application/form-data",
          Authorization: `Bearer ${this.token}`,
        },
        responseType: "blob",
      })
        .then((response) => {
          const blobUrl = window.URL.createObjectURL(response.data);
          resolve(blobUrl);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};

export default request;
