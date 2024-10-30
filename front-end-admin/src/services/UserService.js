import axios from "../axios";

const signInService = (data) => {
  return axios.post("/user/sign-in", data);
}


export const UserService = {
  signInService,
};
