import React, { useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
// import components
import PopupError from '../components/PopupError'

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

function NewPresentationButton ({ token, rerenderPage }) {
  const [presentationTitle, setTitle] = React.useState('');
  const [error, setError] = React.useState(null);
  const [show, setShow] = useState(false);
  const handleModalClose = () => setShow(false);
  const handleModalShow = () => setShow(true);

  const handleCreatePresentation = async (event) => {
    event.preventDefault();
    try {
      if (presentationTitle.length === 0) {
        setError('Please Enter Title!');
        return;
      }
      // Create a unique presentation id using uuidv4 library
      const presentationId = uuidv4();
      const slideId = uuidv4();
      const presentationThumbnail = '/images/thumbnail.png';
      let updatedData = {
        store: [
          {
            presentationId,
            presentationTitle,
            presentationThumbnail,
            slides: [
              {
                slidesId: slideId
              }
            ]
          }
        ]
      }

      // Fetch existing data
      const existingDataResponse = await axios.get('http://localhost:5005/store', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (existingDataResponse.data && existingDataResponse.data.store) {
        const existingData = existingDataResponse.data;
        // If there is existing data, append the new data
        if (existingData.store.length > 0) {
          // Update the existing data by appending the new presentation
          updatedData = {
            ...existingData,
            store: [
              ...existingData.store,
              {
                presentationId,
                presentationTitle,
                presentationThumbnail,
                slides: [
                  {
                    slideId
                  }
                ]
              }
            ]
          };
        }
      }
      // Save the updated data back
      const response = await axios.put(
        'http://localhost:5005/store',
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      console.log(response);
      // Reset presentationTitle to empty string
      setTitle('');
      handleModalClose();
      rerenderPage();
    } catch (err) {
      setError(err.response.data.error)
    }
  };

  const dismissError = () => {
    setError(null);
  }

  return (
    <>
      <button onClick={handleModalShow} className='text-center btn bg-success text-light fw-bold my-3'>New Presentation</button>

      <Modal show={show} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Presentation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FloatingLabel controlId="floatingInput" label="PresentationTitle" className="mb-3" >
            <Form.Control type="text" placeholder="This is the title of my presentation." onChange={e => setTitle(e.target.value)} value={presentationTitle} />
          </FloatingLabel>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCreatePresentation} className="bg-success">
            Create
          </Button>
        </Modal.Footer>
        {error && <PopupError errorMsg={error} dismissError={dismissError} />}
      </Modal>
    </>
  );
}

export default NewPresentationButton;
