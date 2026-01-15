import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PopupError from '../components/PopupError'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function PresentationPageButtons ({ token, presentation }) {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const handleDeleteModalClose = () => setShow(false);
  const handleDeleteModalShow = () => setShow(true);
  const [error, setError] = React.useState(null);
  const back = async () => {
    navigate('/dashboard');
  };

  const deletePresentation = async () => {
    try {
      // fetch store
      const response = await axios.get('http://localhost:5005/store', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const store = response.data.store;
      // filter out the current presentation
      const newStore = {
        store: store.filter(p => p.presentationId !== presentation.presentationId)
      };
      // update the store
      const res = await axios.put('http://localhost:5005/store', newStore, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('response:', res.data);
      // set presentation to null
      // removePresentation();

      // close modal and navigate back to the dashboard
      handleDeleteModalClose();
      navigate('/dashboard');
    } catch (err) {
      setError(err.response.data.error)
    }
  }
  const dismissError = () => {
    setError(null);
  }
  return (
    <div className='d-flex flex-wrap justify-content-between'>
      <button onClick={back} className="text-center btn bg-success text-light fw-bold me-2">Back</button>
      <button onClick={handleDeleteModalShow} className="text-center btn bg-success text-light fw-bold">Delete Presentation</button>
      <Modal show={show} onHide={handleDeleteModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button onClick={deletePresentation} className="bg-success">
            Yes
          </Button>
          <Button onClick={handleDeleteModalClose} className="bg-success">
            No
          </Button>
        </Modal.Footer>
        {error && <PopupError errorMsg={error} dismissError={dismissError} />}
      </Modal>
    </div>
  );
}

export default PresentationPageButtons;
