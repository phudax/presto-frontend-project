import React, { useEffect } from 'react';
import axios from 'axios';
import { Resizable } from 'react-resizable';
import Draggable from 'react-draggable';
import SlideNumber from '../components/SlideNumber';
import DeleteSlide from '../components/DeleteSlide';
import PopupError from '../components/PopupError';

// import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/default.css';
import 'highlight.js/lib/languages/c';
import 'highlight.js/lib/languages/python';
import 'highlight.js/lib/languages/javascript';

const Slide = ({ slideId, index, currSlideIndex, presentation, token, setPresentation, setCurrSlideIndex, setCurrentSlideId, setPrevSlideIndex }) => {
  const [error, setError] = React.useState(null);
  const [elements, setElements] = React.useState([]);
  const prevElements = React.useRef([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // fetch store
        const existingDataResponse = await axios.get('http://localhost:5005/store',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        if (existingDataResponse.data && existingDataResponse.data.store) {
          const store = existingDataResponse.data.store;
          // get elements
          const currPresentation = store.find(item => item.presentationId === presentation.presentationId);
          if (currPresentation) {
            const currSlide = currPresentation.slides.find(slide => slide.slideId === slideId);
            if (currSlide && currSlide.elements) {
              setElements(currSlide.elements);
              console.log(elements);
            } else {
              setElements([]);
            }
          }
        }
      } catch (err) {
        setError(err.response.data.error);
      }
    }
    if (index === currSlideIndex) {
      fetchData();
    }
  }, [index, currSlideIndex, presentation.presentationId, slideId, token]);

  useEffect(() => {
    if (JSON.stringify(prevElements.current) !== JSON.stringify(elements)) {
      prevElements.current = elements;
    }
    console.log('Updated', elements);
  }, [elements]);

  if (index === currSlideIndex) {
    setCurrentSlideId(slideId)
  }

  const dismissError = () => {
    setError(null);
  }

  const handleResize = (index) => (e, { size }) => {
    setElements(prevElements => {
      const newElements = [...prevElements];
      newElements[index] = { ...newElements[index], width: size.width, height: size.height };
      return newElements;
    });
  };

  const handleDrag = (index) => (e, { x, y }) => {
    const newElements = [...elements];
    newElements[index] = { ...newElements[index], x, y };
    setElements(newElements);
  };

  return (
    <>
      {index === currSlideIndex && (
        <div className="w-100">
          <DeleteSlide
            token={token}
            presentation={presentation}
            setPresentation={setPresentation}
            slideId={slideId}
            currSlideIndex={currSlideIndex}
            setCurrSlideIndex={setCurrSlideIndex}
            setPrevSlideIndex={setPrevSlideIndex}
          />
          <div style={{ height: '500px', overflow: 'hidden', position: 'relative' }} className='w-100 border p-2' id="slide">
            {elements && Array.isArray(elements) && elements.map((element, idx) => (
              <Draggable
                key={idx}
                position={{ x: element.x || 0, y: element.y || 0 }}
                onStop={handleDrag(idx)}
              >
                <Resizable
                  width={element.width || 100}
                  height={element.height || 100}
                  onResizeStop={handleResize(idx)}
                >
                  <div>
                    {element.type === 'text' && (
                      <div key={element.textElementId} className="text-element border p-2" style={{ width: `${element.textAreaSize}%` }}>
                        <p style={{ fontSize: `${element.fontSize}em`, color: element.fontColor, overflow: 'hidden' }}>
                          {element.text}
                        </p>
                      </div>
                    )}
                    {element.type === 'image' && (
                      <div key={element.imageElementId} className="image-element border p-2" style={{ width: `${element.imageWidth}%`, height: `${element.imageHeight}%`, overflow: 'hidden' }}>
                        <img src={`data:image/jpeg;base64,${element.image}`} className="img-fluid" alt={element.imageDescription} />
                      </div>
                    )}
                    {element.type === 'video' && (
                      <div key={element.videoElementId} className="image-element border p-2" style={{ width: `${element.videoWidth}%`, height: `${element.videoHeight}%`, overflow: 'hidden' }}>
                        {element.autoPlay === true ? <iframe width="100%" height="100%" src={`${element.videoUrl}?autoplay=1`} ></iframe> : <iframe width="100%" height="100%" src={element.VideoUrl} ></iframe>}
                      </div>
                    )}
                    {element.type === 'code' && (
                      <div key={element.codeElementId} className="code-element border p-2" style={{ width: `${element.codeWidth}%`, height: `${element.codeHeight}%`, overflow: 'auto' }}>
                        <code style={{ fontSize: `${element.codeFontSize}em`, whiteSpace: 'pre-wrap' }}>
                          {decodeURIComponent(element.code)}
                        </code>
                      </div>
                    )}
                  </div>
                </Resizable>
              </Draggable>
            ))}
          </div>
          {slideId}
          <SlideNumber index={index} />
        </div>
      )}
      {error && <PopupError errorMsg={error} dismissError={dismissError} />}
    </>
  );
}

export default Slide;
