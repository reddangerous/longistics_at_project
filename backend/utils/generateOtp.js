// Function to generate a random OTP
function generateOTP() {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp;
}

export default generateOTP;
