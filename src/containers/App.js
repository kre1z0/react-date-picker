import React, { Component } from 'react';

import DatePicker from './date-picker';
import moment from 'moment/moment';

class App extends Component {
    state = {
        startDate: '2018-05-30T14:04:04+03:00',
        endDate: '2018-08-04T04:04:04+03:00',
    };

    onPickDateStartDate = date => {
        console.info('--> DATE  ggwp nore <--', moment(date).format());
        this.setState({
            startDate: date,
        });
    };

    onPickDateEndDate = date => {
        console.info('--> DATE  ggwp nore <--', moment(date).format());
        this.setState({
            endDate: date,
        });
    };

    _randomDate = (start, end) => {
        return new Date(
            start.getTime() + Math.random() * (end.getTime() - start.getTime()),
        );
    };

    _onPickRandomDate = () => {
        this.setState({
            startDate: this._randomDate(new Date(1988, 0, 1), new Date()),
            endDate: this._randomDate(new Date(2000, 0, 1), new Date()),
        });
    };

    render() {
        const { startDate, endDate } = this.state;

        return (
            <div className="app-container">
                <div className="test-container">
                    <DatePicker
                        withTime={false}
                        value={startDate}
                        onChange={this.onPickDateStartDate}
                    />
                    -
                    <DatePicker
                        value={endDate}
                        onChange={this.onPickDateEndDate}
                    />
                </div>
                <button className="random-date" onClick={this._onPickRandomDate}>
                    generate random date
                </button>
            </div>
        );
    }
}

export default App;
