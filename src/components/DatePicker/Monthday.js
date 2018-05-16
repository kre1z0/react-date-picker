import React from 'react';

export const Monthday = ({
    date,
    classNames,
    onChange,
    weekdays,
    item,
    value,
}) => {
    return (
        <div
            className={`monthday ${date.isSame(value, 'day')
                ? 'currentDay'
                : ''} ${classNames ? classNames : ''}`}
            style={{
                width: `calc(100% / ${weekdays.length})`,
            }}
        >
            <span onClick={() => onChange(date)}>
                {date.format('D')}
            </span>
        </div>
    );
};
