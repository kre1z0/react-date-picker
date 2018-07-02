import React from "react";

export const Control = ({ date, onPrev, onNext, openMonthsList, openYearsList }) => {
  return (
    <div className="control">
      <div className="control-btn-wrapper" onClick={onPrev}>
        <div className="prev" />
      </div>
      <div className="currentDate">
        <div className="current-month">
          <span onClick={openMonthsList}>{date.format("MMMM")}</span>
        </div>
        <div className="current-year">
          <span onClick={openYearsList}>{date.format("YYYY")}</span>
        </div>
      </div>
      <div className="control-btn-wrapper" onClick={onNext}>
        <div className="next" />
      </div>
    </div>
  );
};
