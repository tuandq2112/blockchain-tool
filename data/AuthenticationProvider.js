import { AuthenticationPath } from "constants/data";
import request from "utils/request";

const AuthenticationProvider = {
  login: (data) => {
    return request.requestApi({
      method: "POST",
      url: AuthenticationPath.login,
      ignoreAuth: true,
      data,
    });
  },
};
export default AuthenticationProvider;
