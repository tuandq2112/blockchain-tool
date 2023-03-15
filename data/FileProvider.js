import { FilePath } from "constants/data";
import request from "utils/request";

const FileProvider = {
  uploadSingleFile: (file) => {
    return request.requestFile({
      method: "POST",
      url: FilePath.upload,
      file,
    });
  },
  getSingleFile: (url) => {
    return request.getFile({
      url: FilePath.static + "/" + url,
    });
  },
};
export default FileProvider;
