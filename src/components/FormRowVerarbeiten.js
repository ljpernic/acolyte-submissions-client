//////// COMPONENT
//////// FORM ROW FOR DASHBOARD TO EDIT SUBMISSION DETAILS IN DB ////////

import React from 'react';

const FormRowVerarbeiten = ({
  type,
  name,
  value,
  accept,
  status,
  handleChange,
  horizontal,
  placeholder,
  isEIC,
}) => {
  return (
    <div className='form-row'>
      {!horizontal && (
        <label htmlFor={name} className='form-label'>
          <strong>{name}</strong>
        </label>
      )}
      <input
        type={type}
        value={value}
        name={name}
        accept={accept}
        onChange={handleChange}
        className='form-input'
        readOnly={!isEIC}
        placeholder={placeholder}
      />
    </div>
  );
  
};

export default FormRowVerarbeiten;
