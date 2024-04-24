import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { PayPalButton } from 'react-paypal-button-v2'
import { Link } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { processPayment } from '../actions/patmentActions';

import { getUserDetails } from '../actions/userActions'
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from '../actions/orderActions'
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from '../constants/orderConstants'

const OrderScreen = ({ match, history }) => {
  const orderId = match.params.id


  const [sdkReady, setSdkReady] = useState(false)

  const dispatch = useDispatch()
  const [isloading, setisLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  


 
  const orderDetails = useSelector((state) => state.orderDetails)
  const { order, loading, error } = orderDetails

  const orderPay = useSelector((state) => state.orderPay)
  const { loading: loadingPay, success: successPay } = orderPay

  const orderDeliver = useSelector((state) => state.orderDeliver)
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin
 
  
  const userDetails = useSelector((state) => state.userDetails)
  const {  user } = userDetails
  console.log(user)
  const phoneNumber = localStorage.getItem('phoneNumber');
  const processedPhoneNumber = `254${phoneNumber.slice(1)}`;
  console.log(phoneNumber)

  if (!loading) {
    //   Calculate prices
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2)
    }

    order.itemsPrice = addDecimals(
      order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    )
  }

  useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    }
    else if(!orderId){
      orderId = order._id
      console.log(orderId)
    }
    else{
      if(!user?.name){
        dispatch(getUserDetails(userInfo._id))
      }
    }

    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get('/api/config/paypal')
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
      script.async = true
      script.onload = () => {
        setSdkReady(true)
      }
      document.body.appendChild(script)
    }

    if (!order || successPay || successDeliver || success) {
      dispatch({ type: ORDER_PAY_RESET })
      dispatch({ type: ORDER_DELIVER_RESET })
      dispatch(getOrderDetails(orderId))
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript()
      } else {
        setSdkReady(true)
      }
    }
  }, [dispatch, orderId, successPay, successDeliver, order, success])

  const successPaymentHandler = (paymentResult) => {
    console.log(paymentResult)
    dispatch(payOrder(orderId, paymentResult))
  }

  const payMpesa = async () => {
    setisLoading(true); 
    const numberTotalPrice = parseInt(order.totalPrice);
    const roundedTotalPrice = Math.round(numberTotalPrice);
    // Create an object with phoneNumber and amount
    const orderId = match.params.id
    console.log(orderId)
   try {
    
     // Dispatch the processPayment action with the paymentDetails object
     await dispatch(processPayment({phoneNumber: processedPhoneNumber,orderId, amount:roundedTotalPrice }));
   } catch (error) {
    console.error('Payment failed:', error);
   }
   finally{
    setisLoading(false);
    dispatch(getOrderDetails(orderId))
   }
   
   }

   

  const deliverHandler = () => {
    dispatch(deliverOrder(order))
  }

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <>
      <h1>Order {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>{' '}
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Address:</strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant='success'>
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant='danger'>Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant='success'>Paid on {order.paidAt}</Message>
              ) : (
                <Message variant='danger'>Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                        {item.qty} x {order.paymentMethod === 'Mpesa' ? 'Ksh' : '$'}{order.paymentMethod === 'Mpesa' ? item.price : (item.price / 100)} = {order.paymentMethod === 'Mpesa' ? 'Ksh' : '$'}{order.paymentMethod === 'Mpesa' ? (item.qty * item.price) : (item.qty * (item.price / 100))}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
  <Row>
    <Col>Items</Col>
    <Col>{order.paymentMethod === 'Mpesa' ? 'Ksh' : '$'}{order.paymentMethod === 'Mpesa' ? order.itemsPrice : (order.itemsPrice / 100)}</Col>
  </Row>
</ListGroup.Item>
<ListGroup.Item>
  <Row>
    <Col>Shipping</Col>
    <Col>{order.paymentMethod === 'Mpesa' ? 'Ksh' : '$'}{order.paymentMethod === 'Mpesa' ? order.shippingPrice : (order.shippingPrice / 100)}</Col>
  </Row>
</ListGroup.Item>
<ListGroup.Item>
  <Row>
    <Col>Tax</Col>
    <Col>{order.paymentMethod === 'Mpesa' ? 'Ksh' : '$'}{order.paymentMethod === 'Mpesa' ? order.taxPrice : (order.taxPrice / 100)}</Col>
  </Row>
</ListGroup.Item>
<ListGroup.Item>
  <Row>
    <Col>Total</Col>
    <Col>{order.paymentMethod === 'Mpesa' ? 'Ksh' : '$'}{order.paymentMethod === 'Mpesa' ? order.totalPrice : (order.totalPrice / 100)}</Col>
  </Row>
</ListGroup.Item>


              {!order.isPaid && (
                  <>
                      {loadingPay && <Loader />}
                      {!sdkReady ? (
                        <Loader />
                      ) : (
                        <PayPalButton
                          amount={order.totalPrice}
                          onSuccess={successPaymentHandler}
                        />
                      )}
                       {isloading && <Loader />}
                      {order.paymentMethod === 'Mpesa' && (
                        
                        <Button
                          variant="primary"
                          className="btn btn-block"
                          onClick={payMpesa}
                          disabled={loading}
                        >
                           {isloading ? 'Processing...' : 'Pay with Mpesa'}
                        </Button>
                      )}
                      
                  </>
                  )}

              {loadingDeliver && <Loader />}
              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type='button'
                      className='btn btn-block'
                      onClick={deliverHandler}
                      style={{
                        color: 'white',
                        outline: '#f0b90b',
                        backgroundColor: '#1e2329',
                        border: '2px solid #f0b90b',
                        borderRadius: '5px',
                        textAlign: 'left',
                        fontSize: '1rem',
                        fontWeight: '900',
                      }}
                    >
                      Mark As Delivered
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default OrderScreen
