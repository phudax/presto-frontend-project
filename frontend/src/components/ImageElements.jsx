import React, { useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import PopupError from '../components/PopupError'

import { FaRegImages } from 'react-icons/fa';

function ImageElements ({ token, presentation, slideId }) {
  const [error, setError] = React.useState(null);
  // Image Elements
  const [showImage, setShowImage] = useState(false);
  const handleImageModalClose = () => setShowImage(false);
  const handleImageModalShow = () => setShowImage(true);
  const [image, setImage] = React.useState('');
  const [imageHeight, setImageHeight] = React.useState('');
  const [imageWidth, setImageWidth] = React.useState('');
  const [imageDescription, setImageDescription] = React.useState('');

  // update image type to save it to JSON
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader();
    reader.onloadend = () => {
      // convert image data to Base64 string
      const base64String = reader.result.split(',')[1];
      setImage(base64String);
    }
    reader.readAsDataURL(file);
  };

  const handleSaveImage = async (event) => {
    const type = 'image';
    event.preventDefault();
    if (imageHeight.length === 0) {
      setError('Please enter the image height!');
      return;
    } else if (imageWidth.length === 0) {
      setError('Please enter the image width!');
      return;
    } else if (imageDescription.length === 0) {
      setError('Please enter font size!');
      return;
    } else if (image.length === 0) {
      setError('Please select an image!');
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
                const imageElementId = uuidv4();
                const newImageElement = {
                  type,
                  imageElementId,
                  imageHeight,
                  imageWidth,
                  imageDescription,
                  image,
                };
                // If slide already has elements, concatenate the new image element,
                // otherwise, initialize elements with the new image element.
                const updatedElements = slide.elements
                  ? [...slide.elements, newImageElement]
                  : [newImageElement];

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
              slides: updatedSlides,
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

      handleImageModalClose();
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
      <button className='btn p-4 border-bottom' onClick={handleImageModalShow}>
      <FaRegImages className='mb-2'/><br/>
        Add Image
      </button>

      {/* Modal for Image */}
      <Modal show={showImage} onHide={handleImageModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Image Element</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FloatingLabel controlId="floatingInput" label="Image Height (in %)" className="mb-3" >
            <Form.Control type="text" placeholder="Enter the image height in %" onChange={e => setImageHeight(e.target.value)} value={imageHeight} />
          </FloatingLabel>
          <FloatingLabel controlId="floatingInput" label="Image Width (in %)" className="mb-3" >
            <Form.Control type="text" placeholder="Enter the image width in %" onChange={e => setImageWidth(e.target.value)} value={imageWidth} />
          </FloatingLabel>
          <Form.Control type="file" accept="image/*" onChange={handleImageChange} className="mb-3" />
          <FloatingLabel controlId="floatingInput" label="Image Description" className="mb-3" >
            <Form.Control type="text" placeholder="Image description" onChange={e => setImageDescription(e.target.value)} value={imageDescription} />
          </FloatingLabel>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSaveImage} className="bg-success">
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {error && <PopupError errorMsg={error} dismissError={dismissError} />}
    </div>
  );
}

export default ImageElements;
