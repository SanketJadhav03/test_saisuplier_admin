import React, { useEffect, useRef } from "react";

const CustomInput = ({ name, id, placeholder, onChange, type, checkNameStatus, handleUnit, value,className }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <input
      style={checkNameStatus}
      name={name}
      id={id}
      className={className}
      placeholder={placeholder}
      onChange={onChange}
      type={type}
      ref={inputRef}
      value={value}
    />
  );
};

export default CustomInput;
