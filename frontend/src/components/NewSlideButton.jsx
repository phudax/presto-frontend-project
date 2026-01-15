import React from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import PopupError from '../components/PopupError'

function NewSlideButton ({ presentation, token, setPresentation }) {
  const [error, setError] = React.useState(null);
  const handleAddSlide = async () => {
    try {
      // fetch store
      const response = await axios.get('http://localhost:5005/store', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const store = response.data.store;

      // add slide to the store
      const updatedData = {
        store: store.map(presentationItem => {
          if (presentationItem.presentationId === presentation.presentationId) {
            const slideId = uuidv4();
            const slide = { slideId };
            return {
              ...presentationItem,
              slides: [...presentationItem.slides, slide]
            };
          }
          return presentationItem;
        })
      }

      // update the store
      await axios.put('http://localhost:5005/store', updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // update presentation
      setPresentation(updatedData.store.find(p => p.presentationId === presentation.presentationId));
    } catch (err) {
      setError(err.response.data.error);
    }
  }

  const dismissError = () => {
    setError(null);
  }

  return (
    <>
      <button onClick={handleAddSlide} className='text-center btn bg-primary text-light fw-bold my-3'>Add Slide</button>
      {error && <PopupError errorMsg={error} dismissError={dismissError} />}
    </>
  )
}

export default NewSlideButton;
