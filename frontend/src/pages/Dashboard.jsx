import React from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
// import components
import Header from '../components/Header';
import PopupError from '../components/PopupError'
import NewPresentationButton from '../components/NewPresentationButton';
import PresentationCard from '../components/PresentationCard';

function Dashboard ({ token, setTokenFunction }) {
  const [store, setStore] = React.useState([]);
  const [error, setError] = React.useState(null);
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5005/store', {
          headers: {
            Authorization: token,
          }
        });
        setStore(response.data.store);
      } catch (err) {
        setError(err.response.data.error)
      }
    };
    fetchData();
  }, []);
  console.log(store);
  // if token is null redirect to the register page
  if (token === null) {
    return <Navigate to='/login' />;
  }
  const rerenderPage = async () => {
    try {
      const response = await axios.get('http://localhost:5005/store', {
        headers: {
          Authorization: token,
        }
      });
      setStore(response.data.store);
    } catch (err) {
      setError(err.response.data.error);
    }
  }
  const dismissError = () => {
    setError(null);
  }
  return (
    <>
      <Header token={token} setToken={setTokenFunction} />
      <div className='w-100 bg-light'>
        <div className='vh-100 container py-4'>
          <NewPresentationButton token={token} rerenderPage={rerenderPage}/>
          <div className='d-flex flex-wrap py-2'>
            {/* Map through the store array and render PresentationCard for each item */}
            {store && store.length > 0 && store.slice().reverse().map((presentation) => (
              <PresentationCard
                key={presentation.presentationId}
                presentationId={presentation.presentationId}
                title={presentation.presentationTitle}
                thumbnail={presentation.presentationThumbnail}
                description={presentation.presentationDescription}
                slidesCount={presentation.slides.length}
              />
            ))}
          </div>
        </div>
      </div>
      {error && <PopupError errorMsg={error} dismissError={dismissError}/>}
    </>
  );
}

export default Dashboard;
