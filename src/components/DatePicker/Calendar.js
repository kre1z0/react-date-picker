import React, { Component } from 'react';
import moment from 'moment';

import { Header } from './Header';
import { Monthday } from './Monthday';
import { createDateObjects } from './createDateObjects';

export class Calendar extends Component {
    initCalendarHeader = () => moment.weekdaysShort(true);

    render() {
        const {
            weekOffset,
            date,
            onlyCurrentMonthDay,
            onChange,
            value,
        } = this.props;

        return (
            <div className="calendar">
                <Header items={this.initCalendarHeader()} />
                <div
                    className={`grid ${onlyCurrentMonthDay
                        ? 'onlyCurrentMonthDay'
                        : ''}`}
                >
                    {createDateObjects(
                        date,
                        weekOffset,
                    ).map((item, i) => {
                        return (
                            <Monthday
                                value={value}
                                headerItemsLength={
                                    this.initCalendarHeader().length
                                }
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
