import React from 'react';
import { useNavigate } from 'react-router-dom';

import LogoutButton from './LogoutButton';
import DarkMode from './DarkMode';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import logo from '../images/presto-logo-small.png'

function Header ({ token, setToken }) {
  const navigate = useNavigate();

  const clickLogo = () => {
    navigate('/dashboard');
  }
  return (
    <Navbar expand="lg" className="bg-primary-subtle px-5">
      <div className='container'>
      <Navbar.Brand onClick={clickLogo} style={{ cursor: 'pointer' }}><img src={logo} alt="Presto logo" className="img-fluid"></img></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <DarkMode></DarkMode>
            <LogoutButton token={token} setToken={setToken}/>
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
}

export default Header;
