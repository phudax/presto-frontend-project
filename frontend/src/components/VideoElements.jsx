import React, { useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

import PopupError from './PopupError'
import { FaRegFileVideo } from 'react-icons/fa6';

function VideoElements ({ token, presentation, slideId }) {
  const [showVideo, setShowVideo] = useState(false);
  const handleVideoModalClose = () => setShowVideo(false);
  const handleVideoModalShow = () => setShowVideo(true);
  const [error, setError] = React.useState(null);
  const [videoHeight, setVideoHeight] = React.useState('');
  const [videoWidth, setVideoWidth] = React.useState('');
  const [videoUrl, setVideoUrl] = React.useState('');
  const [autoPlay, setAutoPlay] = useState(false);

  const handleAutoPlay = (event) => {
    setAutoPlay(event.target.checked);
  }

  const handleSaveText = async (event) => {
    const type = 'video';
    event.preventDefault();
    if (videoHeight.length === 0) {
      setError('Please enter the video height!');
      return;
    } else if (videoWidth.length === 0) {
      setError('Please enter the video width!');
      return;
    } else if (videoUrl.length === 0) {
      setError('Please enter the video URL!');
      return;
    }

    try {
      // fetch store
      const existingDataResponse = await axios.get('http://localhost:5005/store', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (existingDataResponse.data && existingDataResponse.data.store) {
        const store = existingDataResponse.data.store;
        const updatedStore = store.map(presentationItem => {
          // match the presentation
          if (presentationItem.presentationId === presentation.presentationId) {
            // match the slide
            const updatedSlides = presentationItem.slides.map(slide => {
              if (slide.slideId === slideId) {
                // create the video box object
                const videoElementId = uuidv4();
                const newVideoElement = {
                  type,
                  videoElementId,
                  videoHeight,
                  videoWidth,
                  videoUrl,
                  autoPlay,
                }
                // If slide already has elements, concatenate the new video,
                // otherwise, initialize elements with the new video element.
                const updatedElements = slide.elements
                  ? [...slide.elements, newVideoElement]
                  : [newVideoElement];

                return {
                  ...slide,
                  elements: updatedElements,
                };
              } else {
                return slide;
              }
            });
            return {
              ...presentationItem,
              slides: updatedSlides
            };
          } else {
            return presentationItem;
          }
        });
        await axios.put('http://localhost:5005/store', { store: updatedStore }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      handleVideoModalClose();
    } catch (err) {
      setError(err.response.data.error);
    }
  }

  // dismiss error
  const dismissError = () => {
    setError(null);
  }
  return (
    <div className='d-flex flex-column text-center'>
      <button className='btn p-4 border-bottom' onClick={handleVideoModalShow}>
      <FaRegFileVideo className='mb-2'/><br/>
        Add Video
      </button>
      {/* Modal for Text */}
      <Modal show={showVideo} onHide={handleVideoModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Video Element</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FloatingLabel controlId="floatingInput" label="Video Height (in %)" className="mb-3" >
            <Form.Control type="text" placeholder="Enter the height of the video in %" onChange={e => setVideoHeight(e.target.value)} value={videoHeight} />
          </FloatingLabel>
          <FloatingLabel controlId="floatingInput" label="Video Width (in %)" className="mb-3" >
            <Form.Control type="text" placeholder="Enter the width of the video in %" onChange={e => setVideoWidth(e.target.value)} value={videoWidth} />
          </FloatingLabel>
          <FloatingLabel controlId="floatingInput" label="Video URL (Embed Link)" className="mb-3" >
            <Form.Control type="text" placeholder="Enter the video embed link" onChange={e => setVideoUrl(e.target.value)} value={videoUrl} />
          </FloatingLabel>
          <div className="mb-3" >
            Autoplay: <input type="checkbox" checked={autoPlay} onChange={handleAutoPlay}/>
          </div>
          {error && <span className="text-danger">{error}</span>}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSaveText} className="bg-success">
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {error && <PopupError errorMsg={error} dismissError={dismissError} />}
    </div>
  );
}

export default VideoElements;
