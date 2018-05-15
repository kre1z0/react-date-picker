import React from 'react';

export const NumberInputGroup = ({ onChange, name, value, label }) => {
    return (
        <div className="date-picker-number-input">
            <input
                type="text"
                value={value}
                onChange={e => onChange(e, name)}
            />
            <label>
                {label}
            </label>
        </div>
    );
};
