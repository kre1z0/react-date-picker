import React from 'react';

export const Monthday = ({
    date,
    classNames,
    onChange,
    headerItemsLength,
    item,
    value,
}) => {
    return (
        <div
            className={`monthday ${date.isSame(value, 'day')
                ? 'currentDay'
                : ''} ${classNames ? classNames : ''}`}
            style={{
                width: `calc(100% / ${headerItemsLength})`,
            }}
        >
            <span onClick={() => onChange(date)}>
                {date.format('D')}
            </span>
        </div>
    );
};
