import React from 'react';

import { PrevIcon, NextIcon } from '../icons';

export const Control = ({ date, onPrev, onNext }) => {
    return (
        <div className="control">
            <div className="prev" onClick={onPrev} />
            <span className="currentDate">
                {date.format('MMMM YYYY')}
            </span>
            <div className="next" onClick={onNext} />
        </div>
    );
};
