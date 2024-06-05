import React from 'react';

const EmailTierTemplate = ({
  name,
  showName,
  title, 
  showTitle,
  magazine,
  showMagazine,
  currentReader, 
  showReaderName,
  unfortunately,
  showUnfortunately,
  displayName,
  readerNote,
  showReaderNote,
  invite,
  showInvite,
  subjective,
  showSubjective,
  recommend,
  showRecommend,
  coverLetterDisplay,
  showCoverLetter,
  thankYou,
  showThankYou,
}) => {
  return (
      <div style={{width : '100%', height : '440px'}}>
        <h2 className = 'action-div-top'>
          <strong>
<span>{displayName}</span>
          </strong>
        </h2>
        <p>
          {showName ? (
              <span>Dear {name},</span>
            ) : (
              <span><strong>Name: </strong>{name}</span>
            )} 
        </p>
        <p>
          {showThankYou && (<span>{thankYou}</span>)} 
          {showTitle ? (
              <span>"{title}" </span>
            ) : (
              <span><strong>Title: </strong>"{title}" </span>
            )} 
          {showMagazine && (<span>{magazine}</span>)}
          {showUnfortunately && (<span>{unfortunately}</span>)} 
          {showInvite && (<span>{invite}</span>)}
          {showRecommend && (<span>{recommend}</span>)}
        </p> 
        <p>
        {showCoverLetter && (
        <span> 
          <strong>Cover Letter: </strong>{coverLetterDisplay} 
        </span>
        )}
        {showReaderNote && (
        <span> 
          {readerNote} 
        </span>
        )}
        {showSubjective && (
          <span> 
            {subjective} 
          </span>
        )}
        </p>
      {showReaderName ? ( 
        <p>
        Sincerely, <br /><br />
          {currentReader} <br /> Haven Spec Magazine
        </p>
      ) : (
        <p>The Haven Spec Team</p>
      )}

      </div>
    );
  };

export default EmailTierTemplate;