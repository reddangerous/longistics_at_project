import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { login } from '../actions/userActions'

const LoginScreen = ({ location, history }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { loading, error, userInfo } = userLogin

  const redirect = location.search ? location.search.split('=')[1] : '/'

  useEffect(() => {
    if (userInfo) {
      history.push(redirect)
    }
  }, [history, userInfo, redirect])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(login(email, password))
  }

  return (
    <FormContainer>
      <h1 className='text-center text-dark '>Sign In</h1>
      {error && <Message variant='danger'>{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
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
          ></Form.Control>
        </Form.Group>

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

        <Button type='submit' variant='primary'
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
          Sign In
        </Button>
      </Form>

      <Row className='py-3'>
        <Col>
          New Customer?{' '}
          <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} style = {{color:'#f0b90b'}}>
            Register
          </Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default LoginScreen
