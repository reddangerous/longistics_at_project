// otpStore.js
const otpStore = {};

export const setOTP = (email, otp) => {
  otpStore[email] = otp;
};

export const getOTP = (email) => {
  return otpStore[email];
};

export const removeOTP = (email) => {
  delete otpStore[email];
};
