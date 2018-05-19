import React, { Component } from 'react';
import moment from 'moment';

export class Monthday extends Component {
    getSelectedDay = () => {
        const {
            value,
            date,
            selectsStart,
            selectsEnd,
            startDate,
            endDate,
            enterDate,
            dateIsValid,
        } = this.props;

        const val = moment(value).startOf('day');
        const start = moment(startDate).startOf('day');
        const end = moment(endDate).startOf('day');
        const enter = moment(enterDate);

        const valid = dateIsValid(enter);
        const isSelectsStart = selectsStart && valid;
        const isSelectsEnd = selectsEnd && valid;

        if (isSelectsStart && date >= enter && date < start) {
            return 'selecting-range';
        } else if (
            isSelectsStart &&
            date < enter &&
            date >= start &&
            date < end
        ) {
            return 'in-range';
        } else if (selectsStart && date > start && date < end) {
            return 'selectedDay';
        }

        if (isSelectsEnd && date <= enter && date > end) {
            return 'selecting-range';
        } else if (
            isSelectsEnd &&
            date <= end &&
            date >= start &&
            enter < end &&
            enter < date
        ) {
            return 'in-range';
        } else if (
            (selectsEnd && date >= start && date <= end) ||
            date.isSame(val, 'day')
        ) {
            return 'selectedDay';
        }

        if (!selectsStart && !selectsEnd && date.isSame(val, 'day'))
            return 'selectedDay';
        else return '';
    };
    render() {
        const {
            date,
            classNames,
            onChange,
            weekdays,
            onMouseEnter,
        } = this.props;

        return (
            <div
                className={`monthday ${this.getSelectedDay()
                    ? this.getSelectedDay()
                    : ''} ${classNames ? classNames : ''}`}
                style={{
                    width: `calc(100% / ${weekdays.length})`,
                }}
            >
                <span
                    onClick={() => onChange(date)}
                    onMouseEnter={() => onMouseEnter(date)}
                >
                    {date.format('D')}
                </span>
            </div>
        );
    }
}
