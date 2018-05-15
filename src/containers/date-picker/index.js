import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment/locale/ru';

import { Control } from '../../components/calendar/Control';
import { Calendar } from '../../components/calendar/Calendar';
import { Time } from '../../components/calendar/Time';

import './date-picker.scss';

export const TIME_LABEL = {
    h: 'ч.',
    m: 'м.',
    s: 'с.',
};

const TIME_LIMIT = {
    h: 23,
    m: 59,
    s: 59,
};

class DatePicker extends Component {
    static propTypes = {
        onChange: PropTypes.func,
        value: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
            PropTypes.object,
        ]),
        weekOffset: PropTypes.number,
        onlyCurrentMonthDay: PropTypes.bool,
        withTime: PropTypes.bool,
        focus: PropTypes.bool,
    };

    static defaultProps = {
        value: moment(),
        onlyCurrentMonthDay: true,
        weekOffset: 0,
        onChange: null,
        withTime: true,
    };

    state = {
        date: moment(this.props.value),
        inputValue: '',
        time: {
            h: 0,
            m: 0,
            s: 0,
        },
    };

    componentDidMount() {
        const { value } = this.props;
        const { time } = this.state;
        moment.locale('ru');

        this.setState({
            time: this._convertTimeToFilter(
                moment(value) - moment(value).startOf('day'),
                time,
            ),
            inputValue: this._getFormattedDate(value),
        });
    }

    componentWillReceiveProps(nextProps) {
        const { value } = this.props;
        if (value !== nextProps.value) {
            this.setState({
                inputValue: this._getFormattedDate(nextProps.value),
            });
        }
    }

    _convertTimeToFilter = (val, filters) => {
        const newFilters = {};
        let value = val;

        Object.keys(filters).forEach(key => {
            const newValue = Math.floor(value / +moment.duration(1, key));

            if (Number.isInteger(newValue) && newValue > 0) {
                value -= +moment.duration(newValue, key);
                newFilters[key] = newValue;
            } else {
                newFilters[key] = 0;
            }
        });

        return newFilters;
    };

    _convertFiltersToTime = filters => {
        return Object.keys(filters).reduce(
            (prev, curr) => prev + moment.duration(filters[curr], curr),
            0,
        );
    };

    _getFormattedDate = value => {
        const { withTime } = this.props;

        let date = this._dateFormatting(value, 'fullDate');

        if (!withTime) {
            date = this._dateFormatting(value);
        }

        return date;
    };

    _dateFormatting = (value, withTime) => {
        if (withTime === 'fullDate')
            return moment(value).format('DD.MM.YYYY H:mm:ss');
        else if (withTime === 'time') return moment(value).format('H:mm:ss');
        else return moment(value).format('DD.MM.YYYY');
    };

    handlePrevTime = () => {
        const { date } = this.state;

        this.setState({
            date: date.clone().subtract(1, 'month'),
        });
    };

    handleNextTime = () => {
        const { date } = this.state;

        this.setState({
            date: date.clone().add(1, 'month'),
        });
    };

    onPickDate = date => {
        const { onChange, withTime } = this.props;
        const { time } = this.state;

        if (withTime) {
            onChange &&
                onChange(moment(date) + this._convertFiltersToTime(time));
        } else onChange && onChange(moment(date));
    };

    _onKeyDown = e => {
        const esc = e.which === 27;
        const enter = e.which === 13;

        if (esc || enter) {
            this.input.blur();
            console.info('--> _onKeyDown');
        }
    };

    _onBlur = () => {
        console.info('--> _onBlur');
    };

    _onRef = input => {
        const { focus } = this.props;

        if (input) this.input = input;

        if (focus && input) {
            input.focus();
        }
    };

    _isNumeric = n => !isNaN(parseFloat(n)) && isFinite(n);

    onChangeNumberInput = (e, key) => {
        const targetValue = Number(e.target.value);
        if (!this._isNumeric(targetValue) || TIME_LIMIT[key] < targetValue)
            return;
        const { value } = this.props;
        const { time, inputValue } = this.state;

        const { 0: inputDate, 1: inputTime } = this._dateFormatting(
            value,
            'fullDate',
        ).split(' ');
        const t = inputTime.split(':');
        const index = Object.keys(time).findIndex(k => k === key);
        t[index] = targetValue < 10 ? `0${targetValue}` : targetValue;
        const val = `${inputDate} ${t[0]}:${t[1]}:${t[2]}`;

        this.setState({
            inputValue: val,
            time: Object.assign({}, time, { [key]: targetValue }),
        });
    };

    onChangeInput = e => {
        let val = e.target.value;

        const { inputValue } = this.state;
        const { onChange, withTime, value } = this.props;

        const formattedDate = this._getFormattedDate(value);

        const { 0: day, 1: month, 2: year } = this._dateFormatting(
            value,
            false,
        ).split('.');

        if (withTime) {
            const { 0: hours, 1: minutes, 2: seconds } = this._dateFormatting(
                value,
                'time',
            ).split(':');
        }

        const length = val.length;

        if (
            (length === 2 && val.charAt(2) !== '.') ||
            (length === 5 && val.charAt(5) !== '.')
        ) {
            val += '.';
        }

        this.setState({
            inputValue: val,
        });
    };

    render() {
        const {
            onlyCurrentMonthDay,
            weekOffset,
            value,
            onChange,
            withTime,
        } = this.props;
        const { date, inputValue, time } = this.state;

        const maxLength = withTime ? 18 : 10;

        return (
            <div>
                <div className="datePicker">
                    <Control
                        date={date}
                        onPrev={this.handlePrevTime}
                        onNext={this.handleNextTime}
                    />
                    <Calendar
                        value={value}
                        weekOffset={weekOffset}
                        onlyCurrentMonthDay={onlyCurrentMonthDay}
                        onChange={this.onPickDate}
                        date={date}
                    />
                    {withTime &&
                        <Time
                            time={time}
                            onChange={this.onChangeNumberInput}
                        />}
                </div>
                <input
                    ref={input => this._onRef(input)}
                    onBlur={this._onBlur}
                    onKeyDown={this._onKeyDown}
                    maxLength={maxLength}
                    value={inputValue}
                    onChange={this.onChangeInput}
                    type="text"
                />
            </div>
        );
    }
}

export default DatePicker;
