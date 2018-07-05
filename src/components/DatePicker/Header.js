import React from "react";

export const Header = ({ weekdays }) => {
  return (
    <div className="header">
      {weekdays.map((item, i) => {
        return (
          <div
            key={`${item}-${i}`}
            className="weekday"
            style={{
              width: `calc(100% / ${weekdays.length}`,
            }}
          >
            <span>{item}</span>
          </div>
        );
      })}
    </div>
  );
};
