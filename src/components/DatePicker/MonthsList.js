import React from 'react';
import moment from 'moment';

export const MontshList = ({
    months,
    onChange,
    date,
    monthListIsOpen,
    onRefMonthsList,
}) => {
    return (
        <ul
            ref={elem => onRefMonthsList(elem)}
            className={`datapicker-dropdown-list months-list ${monthListIsOpen
                ? 'dropdown-list-is-open'
                : ''}`}
        >
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
