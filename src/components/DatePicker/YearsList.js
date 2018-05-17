import React from 'react';
import moment from 'moment/moment';

const getYearsList = date => {
    const year = moment(date).year();
    let start = year - 10;
    const years = [];
    for (let i = 0; i < 21; i++) {
        years.push(start);
        start += 1;
    }
    return years;
};

export const YearsList = ({
    date,
    yearsListIsOpen,
    onChange,
    onRefYearsList,
}) => {
    const years = getYearsList(date);

    return (
        <ul
            ref={elem => onRefYearsList(elem)}
            className={`datapicker-dropdown-list years-list ${yearsListIsOpen
                ? 'dropdown-list-is-open'
                : ''}`}
        >
            {years &&
                years.map(year =>
                    <li
                        className={`${moment(date).year() === year
                            ? 'active-item'
                            : ''}`}
                        key={year}
                        onClick={() => onChange(year)}
                    >
                        {year}
                    </li>,
                )}
        </ul>
    );
};
