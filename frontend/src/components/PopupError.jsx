import React, { useState } from 'react';
// import bootstrap components
import Modal from 'react-bootstrap/Modal';

function PopupError ({ errorMsg, dismissError }) {
  const [show, setShowError] = useState(true);
  const handleErrorClose = () => setShowError(false);

  return <>
    <Modal show={show} onHide={handleErrorClose} backdrop="static">
            <Modal.Header closeButton onClick={dismissError}>
            <Modal.Title>Oops, an error has occured</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {errorMsg}
            </Modal.Body>
        </Modal>
  </>
}
export default PopupError;
