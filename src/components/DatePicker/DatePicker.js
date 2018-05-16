import React, { Component } from 'react';
import MaskedInput from 'react-text-mask';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment/locale/ru';

import { CalendarPortal } from './CalendarPortal';
import { MontshList } from './MonthsList';
import { YearsList } from './YearsList';
import { Control } from './Control';
import { Calendar } from './Calendar';
import { Time } from './Time';

import './DatePicker.scss';

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
        withTime: PropTypes.bool,
        focus: PropTypes.bool,
        height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        // only top and bottom
        position: PropTypes.string,
        className: PropTypes.string,
        containerClassName: PropTypes.string,
        withOffsetDate: PropTypes.bool,
        disabledOffsetDate: PropTypes.bool,
    };

    static defaultProps = {
        value: moment(),
        onlyCurrentMonthDay: true,
        weekOffset: 0,
        onChange: null,
        withTime: true,
        position: 'top',
        height: 32,
        withOffsetDate: false,
        disabledOffsetDate: false,
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
        position: this.props.position,
        isOpen: false,
    };

    componentDidMount() {
        const { value } = this.props;
        const { time } = this.state;
        moment.locale('ru');
        window.addEventListener('resize', this._onResize);
        document.addEventListener('mousedown', this._handleClickOutside);
        document.addEventListener('keydown', this._onKeyDown);
        this._onResize();

        if (this._dateIsValid(value)) {
            this.setState({
                error: false,
                time: this._convertTimeToFilter(
                    moment(value) - moment(value).startOf('day'),
                    time,
                ),
                inputValue: this._getFormattedDate(value),
            });
        } else {
            this.setState({
                error: true,
            });
        }

        setTimeout(() => {
            this._onResize();
        }, 444);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._onResize);
        document.removeEventListener('mousedown', this._handleClickOutside);
        document.removeEventListener('keydown', this._onKeyDown);
    }

    componentWillReceiveProps(nextProps) {
        const { value, position, withTime } = this.props;
        const { time } = this.state;

        if (position !== nextProps.position) {
            this.setState({
                position: nextProps.position,
            });
        }

        if (value !== nextProps.value) {
            this.setState({
                date: moment(nextProps.value),
                inputValue: this._getFormattedDate(nextProps.value),
            });
            if (withTime) {
                this.setState({
                    time: this._convertTimeToFilter(
                        moment(nextProps.value) -
                            moment(nextProps.value).startOf('day'),
                        time,
                    ),
                });
            }
        }
    }

    _handleClickOutside = event => {
        const { isOpen } = this.state;
        const outside = !this.datePicker.contains(event.target);

        if (this.datePicker && outside && isOpen) {
            this.setState({
                isOpen: false,
            });
            this._sumbitDate();
        }
    };

    _onResize = () => {
        const { offsetTop, offsetLeft } = this.state;
        const container = this.container;
        const top = container.offsetTop;
        const left = container.offsetLeft;
        const datePickerHeight = this.datePicker.offsetHeight;

        if (offsetTop !== top || offsetLeft !== left) {
            this.setState({
                offsetTop: top,
                offsetLeft: left,
            });
        }

        if (datePickerHeight > top) {
            this.setState({
                position: 'bottom',
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
                const newDate = new Date(
                    moment(date) + this._convertFiltersToTime(time),
                );
                onChange && onChange(newDate);
            } else onChange && onChange(new Date(date));
        } else {
            this.setState({
                error: true,
            });
        }
        this.setState({
            isOpen: false,
        });
    };

    _onKeyDown = e => {
        const esc = e.which === 27;
        const enter = e.which === 13;

        if (esc || enter) {
            this.setState({
                isOpen: false,
            });
            this.input.inputElement.blur();
            this._sumbitDate();
        }
    };

    onRefInput = input => {
        const { focus } = this.props;

        if (input) this.input = input;

        if (focus && input) {
            input.inputElement.focus();
        }
    };

    _isNumeric = n => !isNaN(parseFloat(n)) && isFinite(n);

    onChangeInput = e => this.setState({ inputValue: e.target.value });

    getMask = () => {
        const { withTime } = this.props;
        const { inputValue } = this.state;

        const days = Number(inputValue.charAt(0)) === 3 ? /[0-1]/ : /[0-9]/;

        const month = Number(inputValue.charAt(3)) === 1 ? /[0-2]/ : /[0-9]/;

        if (withTime) {
            const hours =
                Number(inputValue.charAt(11)) === 2 ? /[0-3]/ : /[0-9]/;

            return [
                /[0-3]/,
                days,
                '.',
                /[0-1]/,
                month,
                '.',
                /[0-9]/,
                /[0-9]/,
                /[0-9]/,
                /[0-9]/,
                ' ',
                /[0-2]/,
                hours,
                ':',
                /[0-5]/,
                /[0-9]/,
                ':',
                /[0-5]/,
                /[0-9]/,
            ];
        } else {
            return [
                /[0-3]/,
                days,
                '.',
                /[0-1]/,
                month,
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
        if (withTime) return '27.12.1988 00:00:00';
        else return '27.12.1988';
    };

    onRefContainer = elem => {
        if (elem) this.container = elem;
    };

    onRefDatePicker = elem => {
        if (elem) this.datePicker = elem;
    };

    _openCalendar = () => this.setState({ isOpen: true });

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
            return moment(value).format('DD.MM.YYYY HH:mm:ss');
        else if (withTime === 'time') return moment(value).format('H:mm:ss');
        else return moment(value).format('DD.MM.YYYY');
    };

    onChangeNumberInput = (e, key) => {
        const targetValue = Number(e.target.value);
        if (!this._isNumeric(targetValue) || TIME_LIMIT[key] < targetValue)
            return;

        const { time, inputValue } = this.state;

        const { 0: inputDate, 1: inputTime } = inputValue.split(' ');
        const t = inputTime.split(':');

        const index = Object.keys(time).findIndex(k => k === key);
        t[index] = targetValue < 10 ? `0${targetValue}` : targetValue;

        const val = `${inputDate} ${t[0]}:${t[1]}:${t[2]}`;

        this.setState({
            inputValue: val,
            time: Object.assign({}, time, { [key]: targetValue }),
        });
    };

    _sumbitDate = () => {
        const { withTime, onChange } = this.props;
        const { inputValue } = this.state;

        if (inputValue === '') {
            this.setState({
                error: 'введите дату',
            });
            return;
        }

        const underscore = /[_]/g;
        const { 0: day, 1: month, 2: year } = inputValue
            .split(' ')[0]
            .split('.')
            .map((s, index) => {
                const withoutUnderscore = s.replace(underscore, '');
                const isEmpty =
                    withoutUnderscore === '' || Number(withoutUnderscore) === 0;

                if (isEmpty && (index === 0 || index === 1)) {
                    return 1;
                } else if (index === 2) {
                    if (Number(withoutUnderscore) < 1975) return 1975;
                    else return Number(withoutUnderscore);
                } else {
                    return Number(withoutUnderscore);
                }
            });

        const newMonth = Number(month - 1);

        if (withTime) {
            const { 0: hour, 1: minute, 2: second } = inputValue
                .split(' ')[1]
                .split(':')
                .map(s => s.replace(underscore, ''));

            const date = new Date(year, newMonth, day, hour, minute, second);

            if (this._dateIsValid(date)) {
                this.setState({
                    error: false,
                });
                onChange && onChange(date);
            } else {
                this.setState({
                    error: true,
                });
            }
        } else {
            const date = new Date(year, newMonth, day);
            if (this._dateIsValid(date)) {
                this.setState({
                    error: false,
                });
                onChange && onChange(date);
            } else {
                this.setState({
                    error: true,
                });
            }
        }
    };

    onYearChange = () => {};

    onMonthChange = monthIndex => {
        console.info('--> onMonthChange', monthIndex);
    };

    render() {
        const {
            weekOffset,
            value,
            withTime,
            height,
            className,
            containerClassName,
            withOffsetDate,
            disabledOffsetDate,
        } = this.props;

        const {
            date,
            inputValue,
            time,
            error,
            offsetTop,
            offsetLeft,
            position,
            isOpen,
        } = this.state;

        const months = moment.months();

        return (
            <div
                className={`datePicker-container ${containerClassName
                    ? containerClassName
                    : ''} ${withTime ? 'withTime' : ''} `}
                ref={input => this.onRefContainer(input)}
            >
                <CalendarPortal>
                    <div
                        ref={input => this.onRefDatePicker(input)}
                        className={`datePicker ${className ? className : ''}`}
                        style={{
                            height: withTime ? 306 : 248,
                            visibility: isOpen ? 'visible' : 'hidden',
                            top: offsetTop,
                            left: offsetLeft,
                            transform: `translateY(${position === 'top'
                                ? -100
                                : height}${position === 'top' ? '%' : 'px'})`,
                        }}
                    >
                        <MontshList
                            date={date}
                            months={months}
                            onChange={this.onMonthChange}
                        />
                        <YearsList />
                        <Control
                            date={date}
                            onPrev={this.handlePrevTime}
                            onNext={this.handleNextTime}
                        />
                        <Calendar
                            withOffsetDate={withOffsetDate}
                            disabledOffsetDate={disabledOffsetDate}
                            value={value}
                            weekOffset={weekOffset}
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
                    style={{ height }}
                    ref={input => this.onRefInput(input)}
                    value={inputValue}
                    mask={this.getMask()}
                    className={`date-picker-control ${error ? 'error' : ''}`}
                    keepCharPositions={true}
                    placeholder={this.getPlaceHolder()}
                    onBlur={this._sumbitDate}
                    onChange={this.onChangeInput}
                />
                <button
                    className={`toggle-button ${isOpen ? 'isOpen' : ''}`}
                    onClick={this._openCalendar}
                />
                {error &&
                    <div className="datePicker-error">
                        {typeof error === 'boolean'
                            ? 'неверный формат даты'
                            : 'введите дату'}
                    </div>}
            </div>
        );
    }
}

export default DatePicker;
