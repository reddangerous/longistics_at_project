import axios from "axios";
import moment from "moment";
function usernamePassBase64(consumer_key, consumer_secret) {
  const base64 = Buffer.from(`${consumer_key}:${consumer_secret}`).toString(
    "base64"
  );
  return base64;
}

export function getMpesaPassword(shortCode, passKey, timestamp) {
  let password = Buffer.from(shortCode + passKey + timestamp).toString(
    "base64"
  );
  return password;
}

export const reduceMpesaMetadata = (metadata) =>
  metadata.reduce((result, entry) => {
    const { Name, Value } = entry;
    result[Name] = Value;
    return result;
  }, {});

export const paymentVerification = async (CheckoutRequestID) => {
  console.log("This is getting exececuted....");
  while (true) {
    try {
      const timestamp = moment().format("YYYYMMDDHHmmss");
      const password = getMpesaPassword(
        process.env.SHORT_CODE,
        process.env.MPESA_EXPRESS_PASSKEY,
        timestamp
      );
      let token = await getAcessToken();
      const response = await axios.post(
        process.env.STK_PUSH_QUERY,
        {
          BusinessShortCode: process.env.SHORT_CODE,
          Password: password,
          Timestamp: timestamp,
          CheckoutRequestID: CheckoutRequestID,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Query Response", response.data);
      if (response.data.ResponseCode === "0") {
        if (response.data.ResultCode !== "0") {
          return { success: false, data: response.data.ResultDesc };
        }
        console.log("Payment Object finally returned", response.data);
        return { success: true, data: response.data };
      }
    } catch (error) {
      console.log("Errr", error.response.data);
    }
    await new Promise((resolve) => setTimeout(resolve, 3000)); //wait
  }
};

export const getAcessToken = async () => {
  try {
    // get the auth token
    const auth = usernamePassBase64(
      process.env.CONSUMER_KEY,
      process.env.CONSUMER_SECRET
    );

    const response = await axios.get(process.env.AUTH_LINK, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
    });
    return response.data.access_token;
  } catch (error) {
    console.log(`There was an error in genarating acces_token:${error}`);
  }
};


