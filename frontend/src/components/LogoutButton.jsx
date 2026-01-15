import React from 'react';
import axios from 'axios';

// import components
import PopupError from '../components/PopupError'

function LogoutButton ({ token, setToken }) {
  const [error, setError] = React.useState(null);
  const dismissError = () => {
    setError(null);
  }
  const logout = async () => {
    try {
      await axios.post('http://localhost:5005/admin/auth/logout', {}, {
        headers: {
          Authorization: token,
        }
      });
      // set token to null
      setToken(null);
    } catch (err) {
      setError(err.response.data.error)
    }
  };
  return (
    <>
      <button onClick={logout} className="text-center btn bg-success text-light fw-bold my-3">Logout</button>
      {error && <PopupError errorMsg={error} dismissError={dismissError} />}
    </>
  );
}

export default LogoutButton;
