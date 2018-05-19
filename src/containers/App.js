import React, { Component } from 'react';

import DatePicker from '../components/DatePicker/DatePicker';

class App extends Component {
    state = {
        withTime: '2018-05-30T14:04:04+03:00',
        withOutTime: '2018-08-04T04:04:04+03:00',
        withOffsetDate: '2018-08-04T12:55:12+03:00',
        withDisabledOffsetDate: '2018-08-04T18:44:04+03:00',
        startDate: '2018-08-04T14:44:04+03:00',
        endDate: '2018-08-24T18:44:08+03:00',
    };

    onPickDate = (date, name) => {
        console.info(`--> ${name} <--`, date);
        this.setState({
            [name]: date,
        });
    };

    _randomDate = (start, end) => {
        return new Date(
            start.getTime() + Math.random() * (end.getTime() - start.getTime()),
        );
    };

    _pickRandomDate = () => {
        this.setState({
            withTime: this._randomDate(new Date(1988, 0, 1), new Date()),
            withOutTime: this._randomDate(new Date(2000, 0, 1), new Date()),
            withOffsetDate: this._randomDate(new Date(2004, 0, 1), new Date()),
            withDisabledOffsetDate: this._randomDate(
                new Date(2007, 0, 1),
                new Date(),
            ),
            startDate: this._randomDate(
                new Date(2004, 0, 1),
                new Date(),
            ),
            endDate: this._randomDate(
                new Date(2008, 0, 1),
                new Date(),
            ),
        });
    };

    _pickCurrentDate = () => {
        this.setState({
            withTime: new Date(),
            withOutTime: new Date(),
            withOffsetDate: new Date(),
            withDisabledOffsetDate: new Date(),
            startDate: new Date(),
            endDate: new Date(),
        });
    };

    render() {
        const {
            withTime,
            withOutTime,
            withOffsetDate,
            withDisabledOffsetDate,
            startDate,
            endDate,
        } = this.state;

        return (
            <div className="app-container">
                <div className="test-container">
                    <div className="root-container">
                        <div className="group">
                            <div className="label">1 - without time</div>
                            <DatePicker
                                withTime={false}
                                value={withTime}
                                onChange={date =>
                                    this.onPickDate(date, 'withTime')}
                            />
                        </div>
                        <div className="group">
                            <div className="label">2 - with time</div>
                            <DatePicker
                                value={withOutTime}
                                onChange={date =>
                                    this.onPickDate(date, 'withOutTime')}
                            />
                        </div>
                        <div className="group">
                            <div className="label">
                                3 - datepicker with offset date
                            </div>
                            <DatePicker
                                withOffsetDate
                                value={withOffsetDate}
                                onChange={date =>
                                    this.onPickDate(date, 'withOffsetDate')}
                            />
                        </div>
                        <div className="group">
                            <div className="label">
                                with disabled offset date
                            </div>
                            <DatePicker
                                withOffsetDate
                                disabledOffsetDate
                                value={withDisabledOffsetDate}
                                onChange={date =>
                                    this.onPickDate(
                                        date,
                                        'withDisabledOffsetDate',
                                    )}
                            />
                        </div>
                        <div className="group">
                            <div
                                className="label"
                                style={{ textAlign: 'center' }}
                            >
                                5 - date range
                            </div>
                            <div className="range">
                                <DatePicker
                                    withOffsetDate
                                    selectsStart
                                    value={startDate}
                                    startDate={startDate}
                                    endDate={endDate}
                                    onChange={date =>
                                        this.onPickDate(date, 'startDate')}
                                />
                                <div className="hyphen">-</div>
                                <DatePicker
                                    withOffsetDate
                                    selectsEnd
                                    value={endDate}
                                    startDate={startDate}
                                    endDate={endDate}
                                    onChange={date =>
                                        this.onPickDate(date, 'endDate')}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="button-group">
                        <button
                            className="button"
                            onClick={this._pickCurrentDate}
                        >
                            current date
                        </button>
                        <button
                            className="button"
                            onClick={this._pickRandomDate}
                        >
                            generate random date
                        </button>
                    </div>
                </div>
                <div className="license">handmade by kreizo</div>
            </div>
        );
    }
}

export default App;
