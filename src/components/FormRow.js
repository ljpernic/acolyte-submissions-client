//////// COMPONENT
//////// FORM ROW, GENERIC ////////

import React from 'react';

const FormRow = ({
  type,
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
        <label htmlFor={name} className='form-label'>         {/* KEYS LAVEL TO NAME VALUE */}
          <strong>{label}</strong>                             {/* DYNAMICALLY DISPLAYS NAME */}
        </label>
      )}
      <input
        type={type}                                           // DYNAMICALLY GENERATED INPUT VALUES
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

export default FormRow;
