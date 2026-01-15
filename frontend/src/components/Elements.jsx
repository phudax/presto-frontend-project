import React from 'react';

import PopupError from '../components/PopupError'
import TextElements from '../components/TextElements';
import ImageElements from './ImageElements';
import VideoElements from './VideoElements';
import CodeElements from './CodeElements';

function Elements ({ token, presentation, slideId }) {
  const [error, setError] = React.useState(null);
  // dismiss error
  const dismissError = () => {
    setError(null);
  }
  return (
    <div className='d-flex flex-column text-center'>
      <TextElements token={token} presentation={presentation} slideId={slideId} />
      <ImageElements token={token} presentation={presentation} slideId={slideId} />
      <VideoElements token={token} presentation={presentation} slideId={slideId} />
      <CodeElements token={token} presentation={presentation} slideId={slideId} />
      {error && <PopupError errorMsg={error} dismissError={dismissError} />}
    </div>
  );
}

export default Elements;
