import React, { useState } from 'react';
import PopupError from '../components/PopupError'
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
function EditThumbnail ({ presentation, token, updateThumbnail }) {
  const [presentationThumbnail, setThumbnail] = React.useState('');
  const [error, setError] = React.useState(null);
  const [show, setShow] = useState(false);
  const handleModalClose = () => setShow(false);
  const handleModalShow = () => setShow(true);
  // find the presentation title
  React.useEffect(() => {
    if (presentation && presentation.presentationThumbnail) {
      setThumbnail(presentation.presentationThumbnail);
    }
  }, [presentation])

  // update image type to save it to JSON
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader();
    reader.onloadend = () => {
      // convert image data to Base64 string
      const base64String = reader.result.split(',')[1];
      setThumbnail(base64String);
    }
    reader.readAsDataURL(file);
  };

  // update thumbnail
  const handleEditThumbnail = async (event) => {
    // fetch existing data
    try {
      const existingDataResponse = await axios.get('http://localhost:5005/store', {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      const existingData = existingDataResponse.data;

      // find the presentation in the store
      const presentationIndex = existingData.store.findIndex(item => item.presentationId === presentation.presentationId);

      // update title
      const updatedPresentation = {
        ...existingData.store[presentationIndex],
        presentationThumbnail,
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
      // update thumbnail
      updateThumbnail(presentationThumbnail);
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
      {presentation && <div className="presentationThumbnail" onClick={handleModalShow} style={{ cursor: 'pointer' }}>
        {presentation.presentationThumbnail === '/images/thumbnail.png' ? <img src={process.env.PUBLIC_URL + presentation.presentationThumbnail} className="img-fluid me-4" alt="presentationThumbnail" style={{ height: '60px' }}/> : <img src={`data:image/jpeg;base64,${presentation.presentationThumbnail}`} className="img-fluid me-4" alt="presentationThumbnail" style={{ height: '60px' }}/>}
      </div>}

      <Modal show={show} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Thumbnail</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Control type="file" accept="image/*" onChange={handleImageChange}/>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleEditThumbnail} className="bg-success">
            Save
          </Button>
        </Modal.Footer>
        {error && <PopupError errorMsg={error} dismissError={dismissError} />}
      </Modal>
    </>
  );
}

export default EditThumbnail;
