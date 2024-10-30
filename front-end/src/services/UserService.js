import axios from "../axios";

const signUpService = (data) => {
  return axios.post(`/user/sign-up`, data);
};

const signInService = (data) => {
  return axios.post(`/user/sign-in`, data);
};

const resetPasswordService = (data) => {
  return axios.post(`/user/reset-password`, data);
};

const sendEmailService = (data) => {
  return axios.post(`/user/send-mail`, data);
};

const verifyOTPService = (data) => {
  return axios.post(`/user/verify-otp`, data);
};

export const UserService = {
  signUpService,
  signInService,
  resetPasswordService,
  sendEmailService,
  verifyOTPService,
};
