import React from 'react';

export const Control = ({
    date,
    onPrev,
    onNext,
    openMonthsList,
    openYearsList,
}) => {
    return (
        <div className="control">
            <div className="control-btn-wrapper" onClick={onPrev}>
                <div className="prev" />
            </div>
            <div className="currentDate">
                <div className="current-month" onClick={openMonthsList}>
                    {date.format('MMMM')}
                </div>
                <div className="current-year" onClick={openYearsList}>
                    {date.format('YYYY')}
                </div>
            </div>
            <div className="control-btn-wrapper" onClick={onNext}>
                <div className="next" />
            </div>
        </div>
    );
};
