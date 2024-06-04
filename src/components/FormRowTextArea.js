//////// COMPONENT
//////// FORM ROW FOR USER-PROVIDED COVER LETTER ////////

import React from 'react';

const FormRowTextArea = ({
  name,
  value,
  accept,
  handleChange,
  horizontal,
  placeholder,
  label,
}) => {
  return (
    <div className='form-row'>
      {!horizontal && (
        <label htmlFor={name} className='form-label'>
          <strong>{label}</strong>
        </label>
      )}
      <textarea
        rows={5}                                // SETS NUMBER OF LINES IN COVER LETTER INPUT BOX
        value={value}
        name={name}
        accept={accept}
        onChange={handleChange}
        className='form-input'
        placeholder={placeholder}
      />
    </div>
  );
};

export default FormRowTextArea;
