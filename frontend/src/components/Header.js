import React from 'react'
import { Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap'
import SearchBox from './SearchBox'
import { logout } from '../actions/userActions'
import { ChevronDown, ShoppingCart, UserRoundCog } from 'lucide-react'
import '../index.css'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {  LockKeyhole  } from 'lucide-react'

const Header = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin
  const [isOpen, setIsOpen] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  const toggleProfileOpen = () => setIsProfileOpen((prev) => !prev)

  const toggleOpen = () => setIsOpen((prev) => !prev)
  useEffect(() => {
    if (isOpen) toggleOpen()
    if (isProfileOpen) toggleProfileOpen()
  }, [location.pathname])



  const logoutHandler = () => {
    dispatch(logout())
  }

  return (
    <header>
      <Navbar className="navbar navbar-expand-md fixed-top mb-5" style={{backgroundColor: '#1e2329' , textAlign: 'center',
    color: '#f0b90b'
    }} expand='lg' collapseOnSelect>
        <Container  >
          <a href='/' style= {{
              color: '#f0b90b',
              fontSize: '1.5rem',
              fontWeight: '900',
              textDecoration: 'none',
            }}>BigManComputers
          </a>
          <Navbar.Toggle aria-controls='basic-navbar-nav' className="custom-toggler"/>
          <Navbar.Collapse id='basic-navbar-nav' style={{color: '#f0b90b'}}>
            <Route render={({ history }) => <SearchBox history={history} />} />
            <Nav className='ml-auto'>
              <LinkContainer to='/cart'>
                <Nav.Link  className='d-flex align-items-center'>
                <ShoppingCart style={{color: '#f0b90b', }} />
                <p 
                 style= {{
              color: '#f0b90b',
              fontSize: '1rem',
              fontWeight: '900',
              textDecoration: 'none',
              verticalAlign: 'middle',
              paddingTop: '20px',
              paddingLeft: '5px',
            }}>Cart
          </p>
                </Nav.Link>
              </LinkContainer>
              {userInfo && (
                <Button  id='username'style= {{
                  color: '#f0b90b', backgroundColor: '#1e2329',}}
                  onClick={toggleProfileOpen}
                  className='d-flex align-items-center z-50 h-5 w-5 '
                  ><UserRoundCog style={{
                    color: '#f0b90b',
                  }}/> 
                     <p 
                 style= {{
              color: '#f0b90b',
              fontSize: '1rem',
              fontWeight: '900',
              textDecoration: 'none',
              verticalAlign: 'middle',
              paddingTop: '20px',
              paddingLeft: '5px',
            }}>{userInfo.name}
          </p>
          <ChevronDown style={{ color: '#f0b90b' }} />
            </Button>
            )}
            {isProfileOpen &&(
              <div >
                <div style={{position: 'absolute', top: '100%'
              , left: '0', width: '100%', backgroundColor: '#1e2329', color: '#f0b90b', zIndex: '50'
            }}>
                  <LinkContainer to='/profile' >
                    <NavDropdown.Item  className='d-flex align-items-left'>
                    <p 
                 style= {{
              color: '#f0b90b',
              fontSize: '1rem',
              fontWeight: '900',
              textDecoration: 'none',
            }}>Profile
          </p>
                    </NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler} className='d-flex align-items-left' >
                  <p 
                 style= {{
              color: '#f0b90b',
              fontSize: '1rem',
              fontWeight: '900',
              textDecoration: 'none',
             
            }}>Logout
          </p>
                  </NavDropdown.Item>
                </div>
                </div>
              )}
              {!userInfo && (
                <LinkContainer to='/login'>
                  <Nav.Link  className='d-flex align-items-center'>
                  <UserRoundCog style={{
                    color: '#f0b90b',
                  }}/>   <p 
                  style= {{
               color: '#f0b90b',
               fontSize: '1rem',
               fontWeight: '900',
               textDecoration: 'none',
               paddingTop: '20px',
              paddingLeft: '5px',
             }}>Login
           </p>
                  </Nav.Link>
                </LinkContainer>
              )}
              {userInfo && userInfo.isAdmin &&(
                <Button
                style={{ backgroundColor: '#1e2329', border: 'none' }}
                onClick={toggleOpen}
                className='d-flex align-items-center z-50 h-5 w-5'
              ><LockKeyhole style={{ color: '#f0b90b' }}/>
               <p 
                 style= {{
              color: '#f0b90b',
              fontSize: '1rem',
              fontWeight: '900',
              textDecoration: 'none',
              verticalAlign: 'middle',
              paddingTop: '20px',
              paddingLeft: '5px',
            }}>Admin
          </p>
          <ChevronDown style={{ color: '#f0b90b' }} />
               </Button>
              )}
                {isOpen &&( 
              <div style={{position: 'absolute', top: '100%'
              , left: '0', width: '100%', backgroundColor: '#1e2329', color: '#f0b90b', zIndex: '50'
            }}>
                <LinkContainer to='/admin/userlist' >
                    <NavDropdown.Item  className='d-flex align-items-left'>
                    <p style={{textDecoration: 'none', color: '#f0b90b',
              fontSize: '1rem',
              fontWeight: '900',}}>Users</p>
                  </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to = '/admin/productlist'>
                  <NavDropdown.Item  className='d-flex align-items-left'>
                    <p style={{textDecoration: 'none',
                  color: '#f0b90b',
                  fontSize: '1rem',
                  fontWeight: '900',
                  }}>Products</p>
                  </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to = '/admin/orderlist'>
                    <NavDropdown.Item  className='d-flex align-items-left'>
                    <p  style={{textDecoration: 'none'
                  ,color: '#f0b90b',
                  fontSize: '1rem',
                  fontWeight: '900',
                  }}>Orders</p>
                </NavDropdown.Item>
                </LinkContainer>  
                
              </div>
           
            
            
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header
