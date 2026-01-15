import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Presentation from './pages/Presentation';
import 'bootstrap/dist/css/bootstrap.min.css';

function App () {
  let localToken = null;
  if (localStorage.getItem('token')) {
    localToken = JSON.parse(localStorage.getItem('token'));
  }

  const [token, setToken] = React.useState(localToken);

  // set token , add to local storage
  const addToken = (token) => {
    setToken(token);
    localStorage.setItem('token', JSON.stringify(token));
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to='/login' />} />
          <Route path="/register" element={<Register token={token} setTokenFunction={addToken} />} />
          <Route path="/login" element={<Login token={token} setTokenFunction={addToken} />} />
          <Route path="/dashboard" element={<Dashboard token={token} setTokenFunction={addToken}/>} />
          <Route path="/presentation" element={<Presentation token={token} setTokenFunction={addToken}/>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
