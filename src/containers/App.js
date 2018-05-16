import React, { Component } from 'react';

import DatePicker from '../components/DatePicker/DatePicker';

class App extends Component {
    state = {
        startDate: '2018-05-30T14:04:04+03:00',
        endDate: '2018-08-04T04:04:04+03:00',
    };

    onPickDateStartDate = (date, name) => {
        console.info(`--> ${name} <--`, date);
        this.setState({
            startDate: date,
        });
    };

    onPickDateEndDate = (date, name) => {
        console.info(`--> ${name} <--`, date);
        this.setState({
            endDate: date,
        });
    };

    _randomDate = (start, end) => {
        return new Date(
            start.getTime() + Math.random() * (end.getTime() - start.getTime()),
        );
    };

    _pickRandomDate = () => {
        this.setState({
            startDate: this._randomDate(new Date(1988, 0, 1), new Date()),
            endDate: this._randomDate(new Date(2000, 0, 1), new Date()),
        });
    };

    _pickCurrentDate = () => {
        this.setState({
            startDate: new Date(),
            endDate: new Date(),
        });
    };

    render() {
        const { startDate, endDate } = this.state;

        return (
            <div className="app-container">
                <div className="test-container">
                    <div className="root-container">
                        <DatePicker
                            withTime={false}
                            value={startDate}
                            onChange={date =>
                                this.onPickDateStartDate(
                                    date,
                                    'datepicker without time',
                                )}
                        />
                        -
                        <DatePicker
                            value={endDate}
                            onChange={date =>
                                this.onPickDateEndDate(
                                    date,
                                    'datepicker with time',
                                )}
                        />
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
