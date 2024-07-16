import React from 'react';
import styles from '../styles/FormInput.module.css';

const FormInput = ({ label, type, value, onChange }) => (
    <div>
        <label htmlFor={`input-${label}`}>{label}</label>
        <input className={styles.input} id={`input-${label}`} type={type} value={value} onChange={onChange} />
    </div>
);

export default FormInput;
