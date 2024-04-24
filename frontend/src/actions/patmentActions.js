import axios from 'axios';


// actions/paymentActions.js

export const processPayment = ({phoneNumber,amount, orderId}) => async (dispatch) => {
    try {
        // Add the orderId to the paymentDetails object
       const paymentDetails ={
            phoneNumber,
            amount,
            orderId
        }

        // Send the POST request with the paymentDetails object
        const response = await axios.post('/mpesa/stk-push-request', paymentDetails);

        dispatch({ type: 'PAYMENT_SUCCESS', payload: response.data });
        console.log(response);
    } catch (error) {
        dispatch({ type: 'PAYMENT_FAILURE', payload: error.message });
    }
};


