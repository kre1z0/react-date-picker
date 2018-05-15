import React, { Component } from 'react';
import MaskedInput from 'react-text-mask';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment/locale/ru';

import { CalendarPortal } from '../../components/calendar/CalendarPortal';
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
        // only top and bottom
        position: 'top',
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
        offsetTop: 0,
        offsetLeft: 0,
        error: false,
    };

    componentDidMount() {
        const { value } = this.props;
        const { time } = this.state;
        moment.locale('ru');
        window.addEventListener('resize', this._onResize);
        this._onResize();
        this.setState({
            time: this._convertTimeToFilter(
                moment(value) - moment(value).startOf('day'),
                time,
            ),
            inputValue: this._getFormattedDate(value),
        });
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._onResize);
    }

    componentWillReceiveProps(nextProps) {
        const { value } = this.props;
        if (value !== nextProps.value) {
            this.setState({
                inputValue: this._getFormattedDate(nextProps.value),
            });
        }
    }

    _onResize = () => {
        const { offsetTop, offsetLeft } = this.state;
        const container = this.container;
        const top = container.offsetTop;
        const left = container.offsetLeft;
        if (offsetTop !== top || offsetLeft !== left) {
            this.setState({
                offsetTop: top,
                offsetLeft: left,
            });
        }
    };

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

    _dateIsValid = date => moment(date).isValid();

    onPickDate = date => {
        const { onChange, withTime } = this.props;
        const { time } = this.state;

        if (this._dateIsValid(date)) {
            this.setState({
                error: false,
            });
            if (withTime) {
                onChange &&
                    onChange(moment(date) + this._convertFiltersToTime(time));
            } else onChange && onChange(moment(date));
        } else {
            this.setState({
                error: true,
            });
        }
    };

    _onKeyDown = e => {
        const esc = e.which === 27;
        const enter = e.which === 13;

        if (esc || enter) {
            this.input.inputElement.blur();
            console.info('--> _onKeyDown');
        }
    };

    _onBlur = () => {
        console.info('--> _onBlur');
    };

    onRefInput = input => {
        const { focus } = this.props;

        if (input) this.input = input;

        if (focus && input) {
            input.inputElement.focus();
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

    _maskingValue = value => {
        const { withTime } = this.props;
        const length = value.length;
        const maxLength = withTime ? 19 : 10;
        const lastIndex = value.length - 1;
        const lastChar = value.charAt(lastIndex);

        if (
            (length === 2 && value.charAt(3) !== '.') ||
            (length === 5 && value.charAt(6) !== '.')
        ) {
            value += '.';
        } else if (
            (length === 3 && value.charAt(3) === '') ||
            (length === 6 && value.charAt(6) === '')
        ) {
            value = value.substring(0, lastIndex) + '.' + lastChar;
        }

        if (withTime) {
            if (length === 10) {
                value += ' ';
            } else if (length === 11 && value.charAt(11) === '') {
                value = value.substring(0, lastIndex) + ' ' + lastChar;
            } else if (
                (length === 13 && value.charAt(13) !== ':') ||
                (length === 16 && value.charAt(16) !== ':')
            ) {
                value += ':';
            } else if (
                (length === 14 && value.charAt(14) === '') ||
                (length === 17 && value.charAt(17) === '')
            ) {
                value = value.substring(0, lastIndex) + ':' + lastChar;
            }
        }

        return value;
    };

    _getDifference = (a, b) => {
        var i = 0;
        var j = 0;
        var result = '';

        while (j < b.length) {
            if (a[i] !== b[j] || i === a.length) result += b[j];
            else i++;
            j++;
        }
        return result;
    };

    onChangeInput = e => {
        const { inputValue } = this.state;
        const { onChange, withTime, value } = this.props;

        let val = e.target.value;
        console.info('--> val', val);
        const selectionStart = e.target.selectionStart;
        const maxLength = withTime ? 19 : 10;
        // const removalValue = this._getDifference(val, inputValue);
        // const regExp = /([:. ])/g;
        // const isMark = regExp.test(removalValue);
        // const valueWithoutMarks = val.replace(regExp, '');

        // if (
        //     !this._isNumeric(valueWithoutMarks) &&
        //     Number(valueWithoutMarks) !== 0
        // )
        //     return;
        // const removal = val.length < inputValue.length;

        // if (val.length > maxLength && !removal) return;
        //
        // if (!removal) val = this._maskingValue(val);

        // if (val.length >= maxLength && !removal)
        //     val = val.slice(0, val.length - 1);

        this.setState({
            inputValue: val,
        });
    };

    getMask = () => {
        const { withTime } = this.props;
        if (withTime) {
            return [
                /[0-9]/,
                /[0-9]/,
                '.',
                /[0-9]/,
                /[0-9]/,
                '.',
                /[0-9]/,
                /[0-9]/,
                /[0-9]/,
                /[0-9]/,
                ' ',
                /[0-9]/,
                /[0-9]/,
                ':',
                /[0-9]/,
                /[0-9]/,
                ':',
                /[0-9]/,
                /[0-9]/,
            ];
        } else {
            return [
                /[0-9]/,
                /[0-9]/,
                '.',
                /[0-9]/,
                /[0-9]/,
                '.',
                /[0-9]/,
                /[0-9]/,
                /[0-9]/,
                /[0-9]/,
            ];
        }
    };

    getPlaceHolder = () => {
        const { withTime } = this.props;
        if (withTime) return '27.12.1988 22:22:22';
        else return '27.12.1988';
    };

    onRefContainer = elem => {
        if (elem) this.container = elem;
    };

    onRefDatePicker = elem => {
        if (elem) this.datePicker = elem;
    };

    render() {
        const { onlyCurrentMonthDay, weekOffset, value, withTime } = this.props;
        const {
            date,
            inputValue,
            time,
            error,
            offsetTop,
            offsetLeft,
        } = this.state;

        return (
            <div
                className="datePicker-container"
                ref={input => this.onRefContainer(input)}
            >
                <CalendarPortal>
                    <div
                        ref={input => this.onRefDatePicker(input)}
                        className="datePicker"
                        style={{
                            top: offsetTop,
                            left: offsetLeft,
                        }}
                    >
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
                </CalendarPortal>
                <MaskedInput
                    ref={input => this.onRefInput(input)}
                    value={inputValue}
                    mask={this.getMask()}
                    className={`${withTime
                        ? 'date-picker-control withTime'
                        : 'date-picker-control'} ${error ? 'error' : ''}`}
                    keepCharPositions={true}
                    placeholder={this.getPlaceHolder()}
                    onKeyDown={this._onKeyDown}
                    onBlur={this._onBlur}
                    onChange={this.onChangeInput}
                />
                {error &&
                    <div className="datePicker-error">
                        неверный формат даты
                    </div>}
            </div>
        );
    }
}

export default DatePicker;
