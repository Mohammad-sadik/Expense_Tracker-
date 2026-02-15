import React from 'react';

export const Input = ({ label, className, ...props }) => (
    <div className={`input-group ${className || ''}`}>
        {label && <label className="input-label">{label}</label>}
        <input
            className="input-field"
            {...props}
        />
    </div>
);

export const Button = ({ children, className, ...props }) => (
    <button
        className={`btn ${className || ''}`}
        {...props}
    >
        {children}
    </button>
);

export const Card = ({ children, className }) => (
    <div className={`card ${className || ''}`}>
        {children}
    </div>
);
