import React from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import axios from 'axios';

// import logo
import logo from '../images/presto-logo.png'

// import components
import PopupError from '../components/PopupError'

// import bootstrap components
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import DarkMode from '../components/DarkMode';

function Login ({ token, setTokenFunction }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState(null);
  const navigate = useNavigate();

  if (token !== null) {
    return <Navigate to='/dashboard' />
  }

  const login = async (event) => {
    event.preventDefault()
    // check for empty input
    if (email.length === 0) {
      setError('Please enter email!');
      return;
    } else if (password.length === 0) {
      setError('Please enter password!');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5005/admin/auth/login', {
        email,
        password,
      });
      setTokenFunction(response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response.data.error)
    }
  }
  const dismissError = () => {
    setError(null);
  }
  return (
    <div className="vh-100 d-flex flex-column align-items-center justify-content-center bg-primary-subtle text-center">
      <div className="card p-4 bg-light">
        <img src={logo} alt="Presto logo" className="img-fluid mb-3"></img>
        <form>
          <FloatingLabel controlId="floatingInput" label="Email address" className="mb-3" >
            <Form.Control type="text" placeholder="name@example.com" onChange={e => setEmail(e.target.value)} value={email} data-testid='email'/>
          </FloatingLabel>
          <FloatingLabel controlId="floatingPassword" label="Password" className="mb-3">
            <Form.Control type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} value={password} data-testid='password'/>
          </FloatingLabel>
          <button type='submit' onClick={login} className="w-50 text-center btn bg-success text-light fw-bold my-3">Login</button>
          <div className="w-100">Don&apos;t have an account? <Link to='/register'>Register</Link> </div><br />
        </form>
        {error && <PopupError errorMsg={error} dismissError={dismissError}/>}
      </div>
      <DarkMode style={{ position: 'absolute' }}/>
    </div>
  )
}

export default Login;
