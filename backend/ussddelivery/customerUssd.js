import AfricasTalking from "africastalking";
import dotenv from "dotenv";
dotenv.config();

const africastalking = AfricasTalking({
  apiKey: process.env.LONGISTICS_API_KEY,
  username: process.env.USERNAME,
});

const sms = africastalking.SMS;
const ussd = africastalking.USSD;

const sendSMS = (PhoneNumber, message) => {
  const options = {
    to: PhoneNumber,
    message: message,
  };
  sms
    .send(options)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
};

const handleUSSD = (session) => {
  let response = '';
  if (session.sequence === 1) {
    response = 'CON Welcome to our delivery service. Choose an option:\n1. Place an Order\n2. Track an Order\n3. Contact Support';
  } else if (session.text === '1') {
    response = 'CON Please enter your order details:';
  } else if (session.text === '2') {
    response = 'CON Please enter your order number:';
  } else if (session.text === '3') {
    response = 'CON Please enter your query:';
  }
  // Add more conditions here to handle other user inputs
  return response;
};

// Add code here to set up your server and handle incoming USSD requests using the handleUSSD function

export default { sendSMS, handleUSSD };
