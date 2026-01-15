import React, { useState } from 'react';

import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { FaCode } from 'react-icons/fa6';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

import PopupError from '../components/PopupError'
// function for code elements
function CodeElements ({ token, presentation, slideId }) {
  const [show, setShow] = useState(false);
  const handleCodeModalClose = () => setShow(false);
  const handleCodeModalShow = () => setShow(true);
  const [error, setError] = React.useState(null);
  const [codeHeight, setCodeHeight] = React.useState('');
  const [codeWidth, setCodeWidth] = React.useState('');
  const [code, setCode] = React.useState('');
  const [codeFontSize, setCodeFontSize] = React.useState('');

  const handleSaveCode = async (event) => {
    const type = 'code';
    event.preventDefault();
    if (codeHeight.length === 0) {
      setError('Please enter the height for code area!');
      return;
    } else if (codeWidth.length === 0) {
      setError('Please enter the width for code area!');
      return;
    } else if (code.length === 0) {
      setError('Please enter the code!');
      return;
    } else if (codeFontSize.length === 0) {
      setError('Please enter the code font-size!');
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
                // create the text box object
                const codeElementId = uuidv4();
                const newCodeElement = {
                  type,
                  codeElementId,
                  codeHeight,
                  codeWidth,
                  code: encodeURIComponent(code),
                  codeFontSize,
                }
                // If slide already has elements, concatenate the new image element,
                // otherwise, initialize elements with the new image element.
                const updatedElements = slide.elements
                  ? [...slide.elements, newCodeElement]
                  : [newCodeElement];

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

      handleCodeModalClose();
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
      <button className='btn p-4 border-bottom' onClick={handleCodeModalShow}>
        <FaCode className='mb-2' /><br />Add Code
      </button>
      {/* Modal for Text */}
      <Modal show={show} onHide={handleCodeModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Code Element</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FloatingLabel controlId="floatingInput" label="Code area height (in %)" className="mb-3" >
            <Form.Control type="text" placeholder="Enter the height of code area in %" onChange={e => setCodeHeight(e.target.value)} value={codeHeight} />
          </FloatingLabel>
          <FloatingLabel controlId="floatingInput" label="Code area width (in %)" className="mb-3" >
            <Form.Control type="text" placeholder="Enter the width of code area in %" onChange={e => setCodeWidth(e.target.value)} value={codeWidth} />
          </FloatingLabel>
          <FloatingLabel controlId="floatingTextArea" label="Enter your code" className="mb-3" >
            <Form.Control as="textarea" style={{ height: '150px' }} placeholder="Enter your code..." onChange={e => setCode(e.target.value)} value={code} />
          </FloatingLabel>
          <FloatingLabel controlId="floatingInput" label="Font size (in em)" className="mb-3" >
            <Form.Control type="text" placeholder="Enter the font size" onChange={e => setCodeFontSize(e.target.value)} value={codeFontSize} />
          </FloatingLabel>
          {error && <span className="text-danger">{error}</span>}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSaveCode} className="bg-success">
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {error && <PopupError errorMsg={error} dismissError={dismissError} />}
    </div>
  );
}

export default CodeElements;
