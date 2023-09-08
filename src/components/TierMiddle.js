//

import React from 'react';

const TierMiddle = ({
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
            Middle-Tier Rejection
          </strong>
        </h2>
        <p>Dear {name},</p>
          <p>
            Thank you for the submission of your {type} "{title}" to Haven Spec Magazine. Unfortunately, we've decided to 
            pass on this one, but we wish you the best of luck on your writing and publishing endeavors. We would be happy to consider anything 
            else you might write!
          </p> 
          <p>
            Sincerely,
          </p>
          <p>
            {currentReader}
          </p>
        </div>
    );
  };

export default TierMiddle;