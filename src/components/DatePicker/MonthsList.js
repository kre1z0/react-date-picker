import React from 'react';
import moment from 'moment';

export const MontshList = ({ months, onChange, date }) => {
    console.info('--> ggwp', moment(date).month());
    return (
        <ul className="datapicker-dropdown-list months-list">
            {months &&
                months.map((month, index) =>
                    <li
                        className={`${moment(date).month() === index
                            ? 'active-item'
                            : ''}`}
                        key={month}
                        onClick={() => onChange(index)}
                    >
                        {month}
                    </li>,
                )}
        </ul>
    );
};
