import React from 'react';
import moment from "moment/moment";

export const Header = () => {
    const weekdays = moment.weekdaysShort();
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
                        <span>
                            {item}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};
