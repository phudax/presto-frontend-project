import React, { useState } from 'react';
import axios from 'axios';

import PopupError from '../components/PopupError'

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

function EditTitle ({ presentation, token, updateTitle }) {
  const [presentationTitle, setTitle] = React.useState('');
  const [error, setError] = React.useState(null);
  const [show, setShow] = useState(false);
  const handleModalClose = () => setShow(false);
  const handleModalShow = () => setShow(true);
  // find the presentation title
  React.useEffect(() => {
    if (presentation && presentation.presentationTitle) {
      setTitle(presentation.presentationTitle);
    }
  }, [presentation])

  // update title
  const handleEditTitle = async (event) => {
    event.preventDefault();
    // fetch existing data
    if (presentationTitle.length === 0) {
      setError('Please Enter Title!');
      return;
    }

    try {
      const existingDataResponse = await axios.get('http://localhost:5005/store', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const existingData = existingDataResponse.data;

      // find the presentation in the store
      const presentationIndex = existingData.store.findIndex(item => item.presentationId === presentation.presentationId);

      // update title
      const updatedPresentation = {
        ...existingData.store[presentationIndex],
        presentationTitle,
      }

      // place updated presentation into store
      const updatedStore = [
        ...existingData.store.slice(0, presentationIndex),
        updatedPresentation,
        ...existingData.store.slice(presentationIndex + 1),
      ];

      const response = await axios.put('http://localhost:5005/store', {
        store: updatedStore,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      // update title
      updateTitle(presentationTitle);
      handleModalClose();
    } catch (err) {
      setError(err.response.data.error);
    }
  }
  // dismiss error
  const dismissError = () => {
    setError(null);
  }
  return (
    <>
      {presentation && <h1 onClick={handleModalShow} style={{ cursor: 'pointer' }}>{presentation.presentationTitle}</h1>}
      <Modal show={show} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FloatingLabel controlId="floatingInput" label="PresentationTitle" className="mb-3" >
            <Form.Control type="text" placeholder="This is the title of my presentation." onChange={e => setTitle(e.target.value)} value={presentationTitle} />
          </FloatingLabel>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleEditTitle} className="bg-success">
            Save
          </Button>
        </Modal.Footer>
        {error && <PopupError errorMsg={error} dismissError={dismissError} />}
      </Modal>
    </>
  );
}

export default EditTitle;
