import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { register, sendEmailSend, authEmail } from '../actions/userActions'






const RegisterScreen = ({ location, history }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const otpRef = useRef()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState(null)
  const [retryCountdown, setRetryCountdown] = useState(60);
  const [isButtonclicked, setisButtonclicked] = useState(false)
  const [iscountDown, setiscountDown] = useState(false)
  const [formState, setFormState] = useState("EMAIL-NOT-VERIFIED");
  const dispatch = useDispatch()
  const userRegister = useSelector((state) => state.userRegister)
  const { loading, error, userInfo } = userRegister

  const redirect = location.search ? location.search.split('=')[1] : '/'

  useEffect(() => {
    if (userInfo) {
      console.log(userInfo)
      history.push(redirect)
    }
  }, [history, userInfo, redirect])

  const submitHandler = (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
    } else {
      dispatch(register(name, email, password))
     
    }
  }
const sendOtp = async (e) => {
    e.preventDefault()
    if (email === '') {
      setMessage('Please enter email')
      setFormState("EMAIL-NOT-VERIFIED")
      return
    }
    else{
  dispatch(sendEmailSend(email))
    setMessage('Otp sent to your email')
    setisButtonclicked(true)
    setiscountDown(true)
    setFormState("OTP")
  }
}
const checkOtp = async (e) => {
 e.preventDefault()
 const otp = otpRef.current.value

try{
    const res = await dispatch(authEmail(email, otp))
    console.log(res)
    setFormState("PASSWORDS")


}catch(error){
  console.log(error)
  setFormState("OTP")
}
}
useEffect(() => {
  if (isButtonclicked) {
    const interval = setInterval(() => {
      setRetryCountdown((prevCountdown) => (prevCountdown > 0 ? prevCountdown - 1 : 0));
    }, 1000);
  
    return () => {
      clearInterval(interval);
    };
  }
}, [isButtonclicked]);


  return (
    <div className="d-flex min-vh-100 align-items-center justify-content-center">
    <Card className="bg-white shadow-lg" style={{width: '80%'}} border={true}>
      <Card.Body>
    <FormContainer className = 'd-flex align-items-center justify-content-center'>
      <h1 className="text-black-700 text-center mb-3 text-xl font-bold">Sign Up</h1>
      {message && <Message variant='success'>{message}</Message>}
      {error && <Message variant='danger'>{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler} >
        <Form.Group controlId='name'>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type='name'
            placeholder='Enter name'
            value={name}
            onChange={(e) => setName(e.target.value)}
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
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='email'>
          <Form.Label>Email Address</Form.Label>
              <Form.Control
                type='email'
                placeholder='Enter email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              />
           
            {formState === "EMAIL-NOT-VERIFIED" && (
              <>
           
            
              <Button 
                  className="shadow mt-3"
                  style={{
                    color: 'white',
                    outline: '#f0b90b',
                    backgroundColor: '#f0b90b',
                    borderRadius: '5px',
                    textAlign: 'center',
                    fontSize: '1rem',
                    fontWeight: '900',

                  }}
                   onClick={sendOtp}>Send OTP</Button>
          {iscountDown && (
            <>
          {retryCountdown > 0 && (
            <p  >{`Didn't receive code? Retry in ${retryCountdown}s`}</p>
          )}
          </>
          )}
          </>
            )}
        </Form.Group>
        {formState === "OTP" && (
          <>
        <Form.Group controlId='otp'>
          <Form.Label> Otp</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter otp'
            ref={otpRef}
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
          ></Form.Control>
          <Button onClick={checkOtp}
          className="shadow mt-3"
          style={{
            color: 'white',
            outline: '#f0b90b',
            backgroundColor: '#f0b90b',
            borderRadius: '5px',
            textAlign: 'center',
            fontSize: '1rem',
            fontWeight: '900',

          }}
          > verify Otp</Button>
        
        </Form.Group>
        </>
        )}
        {formState === "PASSWORDS" && (
          <>
        <Form.Group controlId='password'>
          <Form.Label>Password Address</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='confirmPassword'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Confirm password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          ></Form.Control>
        </Form.Group>

        <Button type='submit'  className="shadow mt-3"
          style={{
            color: 'white',
            outline: '#f0b90b',
            backgroundColor: '#f0b90b',
            borderRadius: '5px',
            textAlign: 'center',
            fontSize: '1rem',
            fontWeight: '900',

          }}>
          Register
        </Button>
        </>
        )}
      </Form>
      
      <Row className='py-3'>
        <Col>
          Have an Account?{' '}
          <Link to={redirect ? `/login?redirect=${redirect}` : '/login'} style= {{color: '#f0b90b'}}>
            Login
          </Link>
        </Col>
      </Row>
    </FormContainer>
    </Card.Body>
    </Card>
  </div>
  )
}

export default RegisterScreen
