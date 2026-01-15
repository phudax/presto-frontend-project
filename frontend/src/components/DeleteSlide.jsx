import axios from 'axios';
import React from 'react';

import PopupError from '../components/PopupError'

function DeleteSlide ({ token, presentation, setPresentation, slideId, setPrevSlideIndex }) {
  const [error, setError] = React.useState(null);
  const deleteSlide = async () => {
    try {
      if (presentation.slides.length === 1) {
        setError('Cannot delete only slide. Please delete the Presentation instead');
      } else {
        const response = await axios.get('http://localhost:5005/store', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const store = response.data.store;

        // filter out the deleted slide from presentation
        const newSlides = presentation.slides.filter(slide => slide.slideId !== slideId);

        // find previous index
        const deletedSlideIndex = presentation.slides.findIndex(slide => slide.slideId === slideId);
        if (deletedSlideIndex > 0) {
          setPrevSlideIndex(deletedSlideIndex - 1);
        } else {
          setPrevSlideIndex(0);
        }

        const newPresentation = {
          ...presentation,
          slides: newSlides,
        };

        const newStore = store.map(presentationItem => {
          if (presentationItem.presentationId === presentation.presentationId) {
            return newPresentation;
          }
          return presentationItem;
        });

        // update the store
        await axios.put('http://localhost:5005/store', { store: newStore }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPresentation(newPresentation);
      }
    } catch (err) {
      setError(err.response.data.error);
    }
  }

  const dismissError = () => {
    setError(null);
  }

  return (
    <div className='w-100 d-flex flex-wrap justify-content-between my-0'>
      <div className='w-sm-50'></div>
      <button onClick={deleteSlide} className='text-center btn bg-primary text-light fw-bold my-3'>Delete Slide</button>
      {error && <PopupError errorMsg={error} dismissError={dismissError} />}
    </div>
  )
}

export default DeleteSlide;
