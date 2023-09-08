//

import React from 'react';

const TierRec = ({
  type,                                                       // Sets key pair values?
  name,
  title, 
  currentReader,
  readerNote,
}) => {
  return (
      <div style={{width : '100%', height : '440px'}}>
       <h2 className = 'action-div-top'>
        <strong>
          Recommendation
        </strong>
      </h2>
      <p>
        <strong>Title:</strong>
          {title}
      </p>
      <p>
        <strong>Name:</strong>
          {name}
      </p>
      <p>
        <strong>Type:</strong>
          {type}
      </p>
      <p>
        <strong>Recommended by:</strong>
          {currentReader}
      </p>
      <strong>Reader notes:</strong>
      <p>
        {readerNote}
      </p>
      </div>
    );
  };

export default TierRec;