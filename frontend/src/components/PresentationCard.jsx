import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const PresentationCard = (props) => {
  return (
    <div className="col-md-4 mb-4 px-1">
      <Link to={`/presentation?presentationId=${props.presentationId}`} className="text-decoration-none">
        <div className="card">
          <div className="thumbnail">
            {props.thumbnail !== '/images/thumbnail.png' ? <img src={`data:image/jpeg;base64,${props.thumbnail}`} className="img-fluid" alt="Thumbnail" /> : <img src={process.env.PUBLIC_URL + props.thumbnail} className="img-fluid" alt="Thumbnail" />}
          </div>
          <div className="card-body">
            <h5 className="card-title">{props.title}</h5>
            {props.description && <p className="card-text">{props.description}</p>}
            <p className="card-text">Slides: {props.slidesCount}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PresentationCard;
