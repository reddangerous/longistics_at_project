import React, { useState } from 'react'
import { Form, Button, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { savePaymentMethod } from '../actions/cartActions'

const PaymentScreen = ({ history }) => {
  const cart = useSelector((state) => state.cart)
  const { shippingAddress } = cart

  if (!shippingAddress) {
    history.push('/shipping')
  }

  const [paymentMethod, setPaymentMethod] = useState('PayPal')

  const dispatch = useDispatch()

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(savePaymentMethod(paymentMethod))
    history.push('/placeorder')
  }

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as='legend'>Select Method</Form.Label>
          <Col  style={{
                color: 'white',
                backgroundColor: '#1e2329',
                border: '2px solid #f0b90b',
                borderRadius: '5px',
                textAlign: 'left',
                fontSize: '1rem',
                fontWeight: '900',
              }}>
            <Form.Check
              type='radio'
              label='PayPal or Credit Card'
              id='PayPal'
              name='paymentMethod'
              value='PayPal'
              checked
              onChange={(e) => setPaymentMethod(e.target.value)}
             
            ></Form.Check>
            <Form.Check
              type='radio'
              label='Mpesa'
              id='Mpesa'
              name='paymentMethod'
              value='Mpesa'
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
          </Col>
        </Form.Group>

        <Button type='submit' style={{
            color: 'white',
            outline: '#f0b90b',
            backgroundColor: '#f0b90b',
            borderRadius: '5px',
            textAlign: 'center',
            fontSize: '1rem',
            fontWeight: '900',

          }}>
          Continue
        </Button>
      </Form>
    </FormContainer>
  )
}

export default PaymentScreen
