import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Row, Col, ListGroup, Image, Card, Modal, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import CheckoutSteps from '../components/CheckoutSteps'
import { createOrder } from '../actions/orderActions'
import { getUserDetails, updateUserProfile } from '../actions/userActions'

const PlaceOrderScreen = ({ history }) => {
  const dispatch = useDispatch()

  const userDetails = useSelector((state) => state.userDetails)
  const {  user } = userDetails
  console.log(user)

  const userId = user._id
  console.log(userId)

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    } else {
      if (!user?.name) {
        dispatch(getUserDetails('profile'))
      }
      else if(user.phoneNumber){
        history.push(`/order/${order._id}`)
      }
    }
  }, [dispatch, history, userInfo, user])
 

  const cart = useSelector((state) => state.cart)
  console.log(cart)
  const [showModal, setShowModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  
  //   Calculate prices
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2)
  }

  cart.itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  )
  cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 100)
  cart.taxPrice = addDecimals(Number(((0.15 * cart.itemsPrice )/100).toFixed(2)))
  cart.totalPrice = (
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice) +
    Number(cart.taxPrice)
  ).toFixed(2)

  const orderCreate = useSelector((state) => state.orderCreate)
  const { order, success, error } = orderCreate

  useEffect(() => {
    if (success) {
      history.push(`/order/${order._id}`)
    }
    // eslint-disable-next-line
  }, [history, success])

  const placeOrderHandler = () => {
    if (cart.paymentMethod === 'Mpesa') {
       setShowModal(true);

    }
    else {
       dispatch(
         createOrder({
           orderItems: cart.cartItems,
           shippingAddress: cart.shippingAddress,
           paymentMethod: cart.paymentMethod,
           itemsPrice: cart.itemsPrice,
           shippingPrice: cart.shippingPrice,
           taxPrice: cart.taxPrice,
           totalPrice: cart.totalPrice,
         })
       );
    }
   };
   
  
   const handleSubmit = (e) => {
    e.preventDefault()
    const processedPhoneNumber = `254${phoneNumber.slice(1)}`;
    dispatch(updateUserProfile({ id: userId, phoneNumber:  processedPhoneNumber}))
    setShowModal(false);
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      })
    );
  }


  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address:</strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city}{' '}
                {cart.shippingAddress.postalCode},{' '}
                {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <strong>Method: </strong>
              {cart.paymentMethod === 'Mpesa' ? 'Mpesa' : 'Other Method'}
              </ListGroup.Item>


              <ListGroup.Item>
 <h2>Order Items</h2>
 {cart.cartItems.length === 0 ? (
    <Message>Your cart is empty</Message>
 ) : (
    <ListGroup variant='flush'>
      {cart.cartItems.map((item, index) => (
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
              {item.qty} x {cart.paymentMethod === 'Mpesa' ? 'Ksh' : '$'}{cart.paymentMethod === 'Mpesa' ? item.price : (item.price / 100)} = {cart.paymentMethod === 'Mpesa' ? 'Ksh' : '$'}{cart.paymentMethod === 'Mpesa' ? (item.qty * item.price) : (item.qty * (item.price / 100))}
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
      <Col>{cart.paymentMethod === 'Mpesa' ? 'Ksh' : '$'}{cart.paymentMethod === 'Mpesa' ? cart.itemsPrice : (cart.itemsPrice / 100)}</Col>
    </Row>
 </ListGroup.Item>
 <ListGroup.Item>
    <Row>
      <Col>Shipping</Col>
      <Col>{cart.paymentMethod === 'Mpesa' ? 'Ksh' : '$'}{cart.paymentMethod === 'Mpesa' ? cart.shippingPrice : (cart.shippingPrice / 100)}</Col>
    </Row>
 </ListGroup.Item>
 <ListGroup.Item>
    <Row>
      <Col>Tax</Col>
      <Col>{cart.paymentMethod === 'Mpesa' ? 'Ksh' : '$'}{cart.paymentMethod === 'Mpesa' ? cart.taxPrice : (cart.taxPrice / 100)}</Col>
    </Row>
 </ListGroup.Item>
 <ListGroup.Item>
    <Row>
      <Col>Total</Col>
      <Col>{cart.paymentMethod === 'Mpesa' ? 'Ksh' : '$'}{cart.paymentMethod === 'Mpesa' ? cart.totalPrice : (cart.totalPrice / 100)}</Col>
    </Row>
 </ListGroup.Item>
 <ListGroup.Item>
    {error && <Message variant='danger'>{error}</Message>}
 </ListGroup.Item>
 <ListGroup.Item>
    <Button
      type='button'
      className='btn-block'
      disabled={cart.cartItems === 0}
      onClick={placeOrderHandler}
      style={{
        color: 'white',
        outline: '#f0b90b',
        backgroundColor: '#f0b90b',
        borderRadius: '5px',
        textAlign: 'center',
        fontSize: '1rem',
        fontWeight: '900',

      }}
    >
      Place Order
    </Button>
 </ListGroup.Item>
</ListGroup>

          </Card>
        </Col>
      </Row>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
 <Modal.Header closeButton>
    <Modal.Title>Enter Phone Number</Modal.Title>
 </Modal.Header>
 <Modal.Body>
    <Form>
      <Form.Group controlId="formPhoneNumber">
        <Form.Label>Phone Number</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter phone number"
          value={phoneNumber}
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
          onChange={(e) => {
            const newPhoneNumber = e.target.value;
            setPhoneNumber(newPhoneNumber);
            // Set the phone number in local storage
            localStorage.setItem('phoneNumber', newPhoneNumber);
            
         }}
        />
      </Form.Group>
    </Form>
 </Modal.Body>
 <Modal.Footer>
    <Button variant="primary" onClick={() => setShowModal(false)}>
      Close
    </Button>
    <Button  onClick={handleSubmit}
    style={{
      color: 'white',
      outline: '#f0b90b',
      backgroundColor: '#f0b90b',
      borderRadius: '5px',
      textAlign: 'center',
      fontSize: '1rem',
      fontWeight: '900',

    }}
    >
      Save Changes
    </Button>
 </Modal.Footer>
</Modal>

    </>
  )
}

export default PlaceOrderScreen
