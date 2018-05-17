import React, { Component } from 'react';
import moment from 'moment';

import { Header } from './Header';
import { Monthday } from './Monthday';
import { createDateObjects } from './createDateObjects';

export class Calendar extends Component {
    render() {
        const {
            weekOffset,
            date,
            withOffsetDate,
            onChange,
            value,
            disabledOffsetDate,
            selectsStart,
            selectsEnd,
            startDate,
            endDate,
        } = this.props;

        const weekdays = moment.weekdaysShort();

        return (
            <div className="calendar">
                <Header items={weekdays} />
                <div
                    className={`grid ${withOffsetDate
                        ? ''
                        : 'withoutOffsetDate'} ${disabledOffsetDate
                        ? 'disabledOffsetDate'
                        : ''}`}
                >
                    {createDateObjects(date, weekOffset).map((item, i) => {
                        return (
                            <Monthday
                                value={value}
                                weekdays={weekdays}
                                onChange={onChange}
                                {...item}
                                key={`${item.date.format()}-${i}`}
                            />
                        );
                    })}
                </div>
            </div>
        );
    }
}
