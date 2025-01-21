const FormRow = ({
  type,
  name,
  value,
  accept,
  handleChange,
  horizontal,
  placeholder,
  label,
  options,  // Add options for radio buttons
}) => {
  return (
    <div className='form-row'>
      {!horizontal && (
        <label htmlFor={name} className='form-label'>
          <strong>{label}</strong>
        </label>
      )}
      {type === "radio" ? (
        // Dynamically render radio buttons if the type is "radio"
<div className="radio-group">
  {options.map((option) => (
    <label key={option.value} className="radio-label">
      <input
        type="radio"
        name={name}
        value={option.value}
        checked={value === option.value}
        onChange={handleChange}
      />
      <span style={{'padding':'10px'}}>{option.label}</span> {/* Span gets styled when input is checked */}
    </label>
  ))}
</div>
      ) : (
        // Default for other types (text, email, etc.)
        <input
          type={type}
          value={value}
          name={name}
          accept={accept}
          onChange={handleChange}
          className='form-input'
          placeholder={placeholder}
        />
      )}
    </div>
  );
};

export default FormRow;