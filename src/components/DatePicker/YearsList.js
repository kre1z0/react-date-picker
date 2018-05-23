import React from 'react';
import cn from 'classnames';
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
            ref={onRefYearsList}
            className={cn('datapicker-dropdown-list years-list', {
                'dropdown-list-is-open': yearsListIsOpen,
            })}
        >
            {years &&
                years.map(year =>
                    <li
                        className={cn({
                            'active-item': moment(date).year() === year,
                        })}
                        key={year}
                        onClick={() => onChange(year)}
                    >
                        {year}
                    </li>,
                )}
        </ul>
    );
};
