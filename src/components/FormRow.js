//////// SETS STRUCTURE OF FORM ROWS ////////

import React from 'react';

const FormRow = ({
  type,                                                       // Sets key pair values?
  name,
  value,
  accept,
  status,
  handleChange,
  horizontal,
  placeholder,
}) => {
  return (
    <div className='form-row'>
      {!horizontal && (
        <label htmlFor={name} className='form-label'>         {/* Makes sure the label is keyed to the name value. */}
          <strong>{name}</strong>                                              {/* Displays that name value dynamically. */}
        </label>
      )}
      <input
        type={type}                                           // Keys input value to dynalically generated value
        value={value}
        name={name}
        accept={accept}
        onChange={handleChange}
        className='form-input'
//        readOnly={status != "Open"}
        placeholder={placeholder}
      />
    </div>
  );
  
};

export default FormRow;
