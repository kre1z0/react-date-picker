import React from 'react';
import cn from 'classnames';
import moment from 'moment';

export const MontshList = ({
    onChange,
    date,
    monthListIsOpen,
    onRefMonthsList,
}) => {
    return (
        <ul
            ref={onRefMonthsList}
            className={cn('datapicker-dropdown-list months-list', {
                ['dropdown-list-is-open']: monthListIsOpen,
            })}
        >
            {moment.months().map((month, index) =>
                <li
                    className={cn({
                        'active-item': moment(date).month() === index,
                    })}
                    key={month}
                    onClick={() => onChange(index)}
                >
                    {month}
                </li>,
            )}
        </ul>
    );
};
