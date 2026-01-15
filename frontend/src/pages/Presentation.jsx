import React from 'react';
import axios from 'axios';
import { Navigate, useLocation } from 'react-router-dom';
// import components
import Header from '../components/Header';
import PopupError from '../components/PopupError'
import PresentationPageButtons from '../components/PresentationPageButtons';
import PresentationDetails from '../components/PresentationDetails';
import Elements from '../components/Elements';

function Presentation ({ token, setTokenFunction }) {
  const [error, setError] = React.useState(null);
  const [store, setStore] = React.useState([]);
  const [presentation, setPresentation] = React.useState(null);
  const [currSlideId, setCurrSlideId] = React.useState(null);
  const location = useLocation();

  // fetch presentation id
  const queryParams = new URLSearchParams(location.search);
  const presentationId = queryParams.get('presentationId');

  // fetch title and presentation thumbnail from store
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5005/store', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setStore(response.data.store);
      } catch (err) {
        setError(err.response.data.error)
      }
    };
    fetchData();
  }, [token]);

  // update the presentation title
  const updateTitle = (newTitle) => {
    setPresentation(prevPresentation => ({
      ...prevPresentation,
      presentationTitle: newTitle
    }));
  }

  // update the presentation thumbnail
  const updateThumbnail = (newThumbnail) => {
    setPresentation(prevPresentation => ({
      ...prevPresentation,
      presentationThumbnail: newThumbnail
    }));
  }

  // find the presentation
  React.useEffect(() => {
    const presentationPage = store.find(p => p.presentationId === presentationId);
    setPresentation(presentationPage);
    console.log(presentation);
  }, [store, presentationId])

  // set slideId
  console.log(currSlideId);
  const setCurrentSlideId = (slideId) => {
    setCurrSlideId(slideId);
  }
  // if token is null redirect to the register page
  if (token === null) {
    return <Navigate to='/login' />;
  }

  const dismissError = () => {
    setError(null);
  }
  return (
    <>
      <Header token={token} setToken={setTokenFunction} />
      <div className='d-flex flex-row'>
        <div className='col-sm-2 border-end'>
          <Elements token={token} presentation={presentation} slideId={currSlideId}/>
        </div>
        <div className='p-3 p-md-5 col-sm-10'>
          <PresentationPageButtons token={token} presentation={presentation}/>
          <PresentationDetails
            token={token}
            presentation={presentation}
            updateTitle={updateTitle}
            updateThumbnail={updateThumbnail}
            setPresentation={setPresentation}
            setCurrentSlideId={setCurrentSlideId}
          />
        </div>
      </div>
      {error && <PopupError errorMsg={error} dismissError={dismissError} />}
    </>
  );
}

export default Presentation;
