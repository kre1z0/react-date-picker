import React from 'react';
import moment from 'moment';

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
            onClick={() => onChange(date)}
            style={{
                width: `calc(100% / ${headerItemsLength})`,
            }}
        >
            <span>
                {date.format('D')}
            </span>
        </div>
    );
};
