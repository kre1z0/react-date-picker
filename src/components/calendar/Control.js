import React from 'react';

import { PrevIcon, NextIcon } from '../icons';

export const Control = ({ date, onPrev, onNext }) => {
    return (
        <div className="control">
            <div className="control-btn-wrapper" onClick={onPrev}>
                <div className="prev" />
            </div>
            <span className="currentDate">
                {date.format('MMMM YYYY')}
            </span>
            <div className="control-btn-wrapper" onClick={onNext}>
                <div className="next" />
            </div>
        </div>
    );
};
