const FormRow = ({
  type,
  name,
  value,
  accept,
  handleChange,
  horizontal,
  placeholder,
  label,
  options, // For radio buttons
}) => {
  return (
    <div className="form-row">
      {!horizontal && (
        <label htmlFor={name} className="form-label">
          <strong>{label}</strong>
        </label>
      )}

      {type === "radio" ? (
        <div className="radio-group">
          {options.map((option) => {
            const isChecked =
              typeof value === "boolean"
                ? value === (option.value === "yes") // Convert "yes"/"no" correctly
                : value === option.value;

            return (
              <label key={option.value} className="radio-label">
                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={isChecked}
                  onChange={handleChange}
                />
                <span className="radio-text">{option.label}</span> {/* Ensure label is styled */}
              </label>
            );
          })}
        </div>
      ) : (
        <input
          type={type}
          value={value}
          name={name}
          accept={accept}
          onChange={handleChange}
          className="form-input"
          placeholder={placeholder}
        />
      )}
    </div>
  );
};

export default FormRow;
