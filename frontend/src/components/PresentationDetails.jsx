import React from 'react';

import PopupError from '../components/PopupError'
import EditTitle from '../components/TitleEditing';
import EditThumbnail from '../components/ThumbnailEditing';
import Slide from '../pages/Slide';
import NewSlideButton from '../components/NewSlideButton';
import Button from 'react-bootstrap/Button';

function PresentationDetails ({ token, presentation, updateTitle, updateThumbnail, setPresentation, setCurrentSlideId }) {
  const [error, setError] = React.useState(null);
  const [currSlideIndex, setCurrSlideIndex] = React.useState(0);
  const prevPresentationId = React.useRef(null);
  const [prevSlideIndex, setPrevSlideIndex] = React.useState(0);
  // set slide index to 0 when encountering a new presentation
  React.useEffect(() => {
    const currentPresentationId = presentation ? presentation.presentationId : null;
    if (prevPresentationId.current !== currentPresentationId) {
      setCurrSlideIndex(0);
    } else {
      setCurrSlideIndex(prevSlideIndex);
    }
    prevPresentationId.current = currentPresentationId;
  }, [presentation]);

  // next slide
  const nextSlide = React.useCallback(() => {
    setCurrSlideIndex((prevIndex) => Math.min(prevIndex + 1, presentation.slides.length - 1));
    setCurrentSlideId(presentation.slides[currSlideIndex + 1].slideId);
  }, [presentation, currSlideIndex, setCurrentSlideId]);

  // prev slide
  const prevSlide = React.useCallback(() => {
    setCurrSlideIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    setCurrentSlideId(presentation.slides[currSlideIndex - 1].slideId);
  }, [currSlideIndex, setCurrentSlideId]);

  // add left and right keys to change slides
  React.useEffect(() => {
    const keyLeftRight = (event) => {
      if (event.key === 'ArrowLeft' && currSlideIndex > 0) {
        prevSlide();
      } else if (event.key === 'ArrowRight' && currSlideIndex < (presentation?.slides?.length || 1) - 1) {
        nextSlide();
      }
    };
    window.addEventListener('keydown', keyLeftRight);

    return () => {
      window.removeEventListener('keydown', keyLeftRight);
    };
  }, [prevSlide, nextSlide, currSlideIndex, presentation]);

  // error dismiss
  const dismissError = () => {
    setError(null);
  }

  return (
    <div className='d-flex flex-wrap py-4'>
      <div className='d-flex flex-wrap w-100 justify-content-between'>
        <div className='d-flex flex-wrap'>
          <EditThumbnail presentation={presentation} token={token} updateThumbnail={updateThumbnail} />
          <EditTitle presentation={presentation} token={token} updateTitle={updateTitle} />
        </div>
        <NewSlideButton presentation={presentation} setPresentation={setPresentation} token={token} />
      </div>
      {presentation && (
        presentation.slides.map((slide, index) => (
          <Slide
            key={slide.slideId}
            slideId={slide.slideId}
            index={index}
            currSlideIndex={currSlideIndex}
            presentation={presentation}
            token={token}
            setPresentation={setPresentation}
            setCurrSlideIndex={setCurrSlideIndex}
            setCurrentSlideId={setCurrentSlideId}
            prevSlideIndex={prevSlideIndex}
            setPrevSlideIndex={setPrevSlideIndex}
          />
        ))
      )}
       <div className='w-100 text-center'>
        {currSlideIndex > 0 && (
          <Button variant="primary" onClick={prevSlide} className='m-2'>
            &larr; Previous
          </Button>
        )}
        {currSlideIndex < (presentation?.slides?.length || 0) - 1 && (
          <Button variant="primary" onClick={nextSlide} className='m-2'>
            Next &rarr;
          </Button>
        )}
      </div>
      {error && <PopupError errorMsg={error} dismissError={dismissError} />}
    </div>
  );
}

export default PresentationDetails;
