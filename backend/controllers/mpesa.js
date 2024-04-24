import axios from 'axios'
import expressAsyncHandler from "express-async-handler"

import {
  getAcessToken,
  getMpesaPassword,
  paymentVerification,
  reduceMpesaMetadata,
} from "../utils/mpesaUtil.js";
import Order from '../models/orderModel.js'
import moment from "moment";


export const makeStkPushRequest = expressAsyncHandler(async (req, res) => {
  try {
    // Get the access token first
    const { phoneNumber, amount, orderId } = req.body;
    const timestamp = moment().format("YYYYMMDDHHmmss");
    const password = getMpesaPassword(
      process.env.SHORT_CODE,
      process.env.MPESA_EXPRESS_PASSKEY,
      timestamp
    );
    let token = await getAcessToken();
    const response = await axios.post(
      process.env.STK_LINK,
      {
        BusinessShortCode: process.env.SHORT_CODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phoneNumber,
        PartyB: process.env.SHORT_CODE,
        PhoneNumber: phoneNumber,
        CallBackURL: `${process.env.APP_DOMAIN}/mpesa/stk-push/callback`,
        AccountReference: "BigManComputers Payment",
        TransactionDesc: "BigManComputers Payment",
      },
      {
        headers: {
          Authorization: ` Bearer ${token}`,
        },
      }
    );
    const CheckoutRequestID = response.data.CheckoutRequestID;
    console.log("CheckoutRequestID", CheckoutRequestID);
    const paymentVerificationResponse = await paymentVerification(
      CheckoutRequestID
    );
    if (!paymentVerificationResponse || !paymentVerificationResponse.success) {
      res.status(400).json({
        message: "There was an error completing your payment request",
      });
      // DB LOGIC
      console.log("error verifying payment")
    }
    if (paymentVerificationResponse.success) {

      // DB Logic
  const order = await Order.findById(orderId)
  console.log(order)

  if (order) {
    order.isPaid = true
    order.paidAt = Date.now()
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      //email_address: req.body.payer.email_address,
    }

    const updatedOrder = await order.save()

    res.json(updatedOrder)
    console.log(updatedOrder)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
    }
    res.status(200).json({ mpesaResponse: paymentVerificationResponse });
  } catch (error) {
    console.log(`Error in making stk push request :${error}`);
    return res.status(500).json({
      message: "There was an error in completing your payment request",
    });
  }
});

export const stkCallBackUrl = expressAsyncHandler(async (req, res) => {
  try {
    console.log("This callback function was called.....");
    console.log("################### MPESA CALLBACK ###############");
    console.log(req.body.Body);
    console.log("################### MPESA CALLBACK ###############");
    const mpesaDumpedData = req.body.Body.stkCallback.CallbackMetadata.Item;
    const { Amount, PhoneNumber, MpesaReceiptNumber, TransactionDate } =
      reduceMpesaMetadata(mpesaDumpedData);
    console.log("Amount Paid", Amount);
    console.log("PhoneNumber Paying", PhoneNumber);
    console.log("Transaction Date", TransactionDate);
    console.log("Mpesa Receipt", MpesaReceiptNumber);
    // Transaction table update
  
  } catch (error) {
    console.log(`Error in Callback Function :${error}`);
  }
});

