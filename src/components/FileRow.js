//////// SETS STRUCTURE OF FILE ROW ////////

import React from 'react';

const FileRow = ({
  type,                                                       // Sets key pair values?
  name,
  value,
  accept,
  handleChange,
  horizontal,
  placeholder,
}) => {
  return (
    <div className='form-row'>
      {!horizontal && (
        <label htmlFor={name} className='form-label'>         {/* Makes sure the label is keyed to the name value. */}
          {name}                                              {/* Displays that name value dynamically. */}
        </label>
      )}
      <input
        type={type}                                           // Keys input value to dynalically generated value
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

export default FileRow;
