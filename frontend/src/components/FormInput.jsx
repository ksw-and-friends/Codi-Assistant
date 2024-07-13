import React from "react";

const FormInput = ({ label, type, value, onChange }) => (
  <div>
    <label htmlFor={`input-${label}`}>{label}</label>
    <input
      id={`input-${label}`}
      type={type}
      value={value}
      onChange={onChange}
    />
  </div>
);

export default FormInput;
