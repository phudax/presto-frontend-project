import React, { useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import PopupError from '../components/PopupError'
import { FiType } from 'react-icons/fi';

function TextElements ({ token, presentation, slideId }) {
  // Text
  const [show, setShow] = useState(false);
  const handleTextModalClose = () => setShow(false);
  const handleTextModalShow = () => setShow(true);
  const [error, setError] = React.useState(null);
  const [textAreaSize, setTextAreaSize] = React.useState('');
  const [text, setText] = React.useState('');
  const [fontSize, setFontSize] = React.useState('');
  const [fontColor, setFontColor] = React.useState('');

  const handleSaveText = async (event) => {
    const type = 'text';
    event.preventDefault();
    if (textAreaSize.length === 0) {
      setError('Please enter text area size!');
      return;
    } else if (text.length === 0) {
      setError('Please enter text!');
      return;
    } else if (fontSize.length === 0) {
      setError('Please enter font size!');
      return;
    } else if (fontColor.length === 0) {
      setError('Please enter font color!');
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
                const textElementId = uuidv4();
                const newTextElement = {
                  type,
                  textElementId,
                  textAreaSize,
                  text,
                  fontSize,
                  fontColor,
                }
                // If slide already has elements, concatenate the new image element,
                // otherwise, initialize elements with the new image element.
                const updatedElements = slide.elements
                  ? [...slide.elements, newTextElement]
                  : [newTextElement];

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

      handleTextModalClose();
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
      <button className='btn p-4 border-bottom' onClick={handleTextModalShow}>
        <FiType className='mb-2'/><br/>
        Add Text
      </button>
      {/* Modal for Text */}
      <Modal show={show} onHide={handleTextModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Text Element</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FloatingLabel controlId="floatingInput" label="Text area size (in %)" className="mb-3" >
            <Form.Control type="text" placeholder="Enter the size of text are in %" onChange={e => setTextAreaSize(e.target.value)} value={textAreaSize} />
          </FloatingLabel>
          <FloatingLabel controlId="floatingTextArea" label="Enter your text" className="mb-3" >
            <Form.Control as="textarea" style={{ height: '150px' }} placeholder="Enter your text..." onChange={e => setText(e.target.value)} value={text} />
          </FloatingLabel>
          <FloatingLabel controlId="floatingInput" label="Font Size (in em)" className="mb-3" >
            <Form.Control type="text" placeholder="Enter the font-size" onChange={e => setFontSize(e.target.value)} value={fontSize} />
          </FloatingLabel>
          <FloatingLabel controlId="floatingInput" label="Font Color (in HEX)" className="mb-3" >
            <Form.Control type="text" placeholder="Enter the font color" onChange={e => setFontColor(e.target.value)} value={fontColor} />
          </FloatingLabel>
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

export default TextElements;
