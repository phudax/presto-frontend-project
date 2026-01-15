import React from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import axios from 'axios';
import DarkMode from '../components/DarkMode';
// import logo
import logo from '../images/presto-logo.png'

// import components
import PopupError from '../components/PopupError'

// import bootstrap components
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

function Register ({ token, setTokenFunction }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState(null);
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const navigate = useNavigate();

  if (token !== null) {
    return <Navigate to='/dashboard' />
  }
  const register = async (event) => {
    event.preventDefault();
    // if input boxes are empty
    if (email.length === 0) {
      setError('Please enter email!');
      return;
    } else if (name.length === 0) {
      setError('Please enter name!');
      return;
    } else if (password.length === 0) {
      setError('Please enter password!');
      return;
    } else if (confirmPassword.length === 0) {
      setError('Please confirm password!');
      return;
    }

    // passwords do not match
    if (confirmPassword !== password) {
      setError('Passwords do not match');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5005/admin/auth/register', {
        email,
        password,
        name
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
        <h2 className="mb-3">Register Now</h2>
        <form>
          <FloatingLabel controlId="floatingInput" label="Name" className="mb-3" >
            <Form.Control type="text" placeholder="Full Name" onChange={e => setName(e.target.value)} value={name} />
          </FloatingLabel>
          <FloatingLabel controlId="floatingInput" label="Email address" className="mb-3" >
            <Form.Control type="text" placeholder="name@example.com" onChange={e => setEmail(e.target.value)} value={email} />
          </FloatingLabel>
          <FloatingLabel controlId="floatingPassword" label="Password" className="mb-3">
            <Form.Control type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} value={password} />
          </FloatingLabel>
          <FloatingLabel controlId="floatingPassword" label="ConfirmPassword" className="mb-3">
            <Form.Control type="password" placeholder="ConfirmPassword" onChange={e => setConfirmPassword(e.target.value)} value={confirmPassword} />
          </FloatingLabel>
          <button type='submit' onClick={register} className="w-50 text-center btn bg-success text-light fw-bold my-3">Register</button>
          <div className="w-100">Already have an account? <Link to='/login'>Login</Link> </div><br />
        </form>
      </div>
      <DarkMode />
      {error && (<PopupError errorMsg={error} dismissError={dismissError} />)}
    </div>
  )
}

export default Register;
