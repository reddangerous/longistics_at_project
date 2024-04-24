import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

const Footer = () => {
  return (
    <footer style={{backgroundColor: '#1e2329' , textAlign: 'center',
    color: '#f0b90b'
    }}>
      <Container style={{backgroundColor: '#1e2329' , textAlign: 'center',
    color: '#f0b90b'
    }}>
        <Row>
          <Col className='text-center py-3'>Big man Computer for partial fulfillment of BSC Software development </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
