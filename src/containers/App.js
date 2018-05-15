import React, { Component } from 'react';

import DatePicker from './date-picker';
import moment from 'moment/moment';

class App extends Component {
    state = {
        date: '2018-05-04T14:04:44+03:00',
    };

    onPickDate = date => {
        // console.info(
        //     '--> date.isValid()',
        //     moment('2018-05-04T14:04:44+03:00').isValid(),
        // );
        console.info('--> date', moment(date).format());
        this.setState({
            date,
        });
    };

    render() {
        const { date } = this.state;

        return (
            <div className="app-container">
                <DatePicker value={date} onChange={this.onPickDate} />
            </div>
        );
    }
}

export default App;
