//////// COMPONENT 
//////// DISPLAYS SUBMIT BUTTON ////////

const ButtonsDisplay = ({ className, type, disabled, onClick, children }) => {
  return (
    <button
      className={className}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default ButtonsDisplay;
