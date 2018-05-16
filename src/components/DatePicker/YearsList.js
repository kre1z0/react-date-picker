import React from 'react';

export const YearsList = ({ years }) => {
    return (
        <ul className="datapicker-dropdown-list years-list">
            {years && years.map(year =>
                <li key={year}>
                    {year}
                </li>,
            )}
        </ul>
    );
};
