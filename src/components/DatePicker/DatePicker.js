import React, { Component } from 'react';
import { IMaskInput } from 'react-imask';
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

const dateFormat = 'DD.MM.YYYY';

const dateFormatWithTime = 'DD.MM.YYYY HH:mm:ss';

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
        selectsStart: PropTypes.bool,
        selectsEnd: PropTypes.bool,
        startDate: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
            PropTypes.object,
        ]),
        endDate: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
            PropTypes.object,
        ]),
        onPickClose: PropTypes.bool,
    };

    static defaultProps = {
        value: moment(),
        weekOffset: 0,
        onChange: null,
        withTime: true,
        position: 'top',
        height: 32,
        withOffsetDate: false,
        disabledOffsetDate: false,
        onPickClose: false,
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
        monthListIsOpen: false,
        yearsListIsOpen: false,
    };

    componentDidMount() {
        const { value } = this.props;
        const { time } = this.state;

        moment.locale('ru');
        window.addEventListener('resize', this._onResize);
        document.addEventListener('mousedown', this._handleClickOutside);
        document.addEventListener('keydown', this._onKeyDown);
        this._onResize();

        if (this.dateIsValid(value)) {
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

    shouldComponentUpdate(nextProps, nextState) {
        const { value, position, withTime, weekOffset } = this.props;

        const {
            inputValue,
            isOpen,
            monthListIsOpen,
            yearsListIsOpen,
            offsetTop,
            offsetLeft,
            date,
        } = this.state;

        return (
            weekOffset !== nextProps.weekOffset ||
            withTime !== nextProps.withTime ||
            moment(value).valueOf() !== moment(nextProps.value).valueOf() ||
            position !== nextProps.position ||
            inputValue !== nextState.inputValue ||
            isOpen !== nextState.isOpen ||
            monthListIsOpen !== nextState.monthListIsOpen ||
            yearsListIsOpen !== nextState.yearsListIsOpen ||
            offsetTop !== nextState.offsetTop ||
            offsetLeft !== nextState.offsetLeft ||
            moment(date).valueOf() !== moment(nextState.date).valueOf() ||
            this.state.position !== nextState.position
        );
    }

    componentWillReceiveProps(nextProps) {
        const { value, position, withTime, selectsEnd } = this.props;

        if (position !== nextProps.position) {
            this.setState({
                position: nextProps.position,
            });
        }

        if (moment(value).valueOf() !== moment(nextProps.value).valueOf()) {
            const { date, inputValue, time } = this._getValues(nextProps.value);

            if (withTime) {
                this.setState({
                    date,
                    inputValue,
                    time,
                });
            } else {
                this.setState({
                    date,
                    inputValue,
                });
            }
        } else if (selectsEnd && moment(nextProps.startDate) > moment(value)) {
            const { date, inputValue, time } = this._getValues(
                nextProps.startDate,
            );

            if (withTime) {
                this.setState({
                    date,
                    inputValue,
                    time,
                });
            } else {
                this.setState({
                    date,
                    inputValue,
                });
            }
        }
    }

    _getValues = value => {
        const date = moment(value);
        const inputValue = this._getFormattedDate(value);
        const time = this._convertTimeToFilter(
            moment(value) - moment(value).startOf('day'),
        );

        return {
            date,
            inputValue,
            time,
        };
    };

    _onResize = () => {
        const { offsetTop, offsetLeft } = this.state;
        const container = this.container;
        const { top, left } = container.getBoundingClientRect();
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

    onRefContainer = elem => {
        if (elem) this.container = elem;
    };

    onRefDatePicker = elem => {
        if (elem) this.datePicker = elem;
    };

    onRefMonthsList = list => {
        if (list) this.monthsList = list;
    };

    onRefInput = input => {
        const { focus } = this.props;

        if (input) this.input = input;

        if (focus && input) {
            input.element.focus();
        }
    };

    onRefYearsList = list => {
        if (list) this.yearsList = list;
    };

    _openCalendar = () => {
        this._onResize();
        this.setState({ isOpen: true })
    };

    openMonthsList = () => {
        const { date } = this.state;
        const month = moment(date).month();
        this.monthsList.scrollTop = 0;

        if (month > 3) {
            this.monthsList.scrollTop = (month - 3) * 34;
        }

        this.setState({ monthListIsOpen: true });
    };

    openYearsList = () => {
        this.yearsList.scrollTop = 210;
        this.setState({ yearsListIsOpen: true });
    };

    _convertTimeToFilter = val => {
        const { time } = this.state;
        const filters = time;

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

    dateIsValid = date => moment(date).isValid();

    _onKeyDown = e => {
        const esc = e.which === 27;
        const enter = e.which === 13;

        if (esc || enter) {
            this.setState({
                isOpen: false,
            });
            this.input.element.blur();
            this._sumbitDate();
        }
    };

    _isNumeric = n => !isNaN(parseFloat(n)) && isFinite(n);

    onChangeInput = inputValue => this.setState({ inputValue });

    getPlaceHolder = () => {
        const { withTime } = this.props;
        if (withTime) return '27.12.1988 00:00:00';
        else return '27.12.1988';
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
            return moment(value).format(dateFormatWithTime);
        else return moment(value).format(dateFormat);
    };

    onChangeNumberInput = (e, key) => {
        const targetValue = Number(e.target.value);
        if (!this._isNumeric(targetValue) || TIME_LIMIT[key] < targetValue)
            return;

        const { time, inputValue } = this.state;

        const [inputDate, inputTime] = inputValue.split(' ');
        const t = inputTime.split(':');

        const index = Object.keys(time).findIndex(k => k === key);
        t[index] = targetValue < 10 ? `0${targetValue}` : targetValue;

        const val = `${inputDate} ${t[0]}:${t[1]}:${t[2]}`;

        this.setState({
            inputValue: val,
            time: Object.assign({}, time, { [key]: targetValue }),
        });
    };

    _handleClickOutside = event => {
        const { isOpen, monthListIsOpen, yearsListIsOpen } = this.state;
        const outsideDatePicker = !this.datePicker.contains(event.target);
        const outsideMonthsList = !this.monthsList.contains(event.target);
        const outsideYearsList = !this.yearsList.contains(event.target);

        if (this.datePicker && outsideDatePicker && isOpen) {
            this.setState({
                isOpen: false,
            });
            this._sumbitDate();
        }

        if (this.monthsList && outsideMonthsList && monthListIsOpen) {
            this.setState({
                monthListIsOpen: false,
            });
        }

        if (this.yearsList && outsideYearsList && yearsListIsOpen) {
            this.setState({
                yearsListIsOpen: false,
            });
        }
    };

    onMonthChange = monthIndex => {
        const { date } = this.state;
        const selectedMonth = moment(date)
            .startOf('years')
            .add(monthIndex, 'month');

        this.setState({
            monthListIsOpen: false,
            date: selectedMonth,
        });
    };

    onYearsChange = year => {
        const { date } = this.state;

        const month = moment(date).month();
        const day = moment(date).day();

        const selectedYear = moment(new Date(year, month, day));

        this.setState({
            date: selectedYear,
            yearsListIsOpen: false,
        });
    };

    onPickDate = val => {
        const { onChange, withTime, onPickClose } = this.props;

        if (this.dateIsValid(val)) {
            this.setState({
                error: false,
            });

            let value = val;

            if (withTime) {
                value = new Date(
                    moment(val).startOf('day') +
                    this._convertFiltersToTime(this.state.time),
                );
            }

            const { date } = this._getValues(value);
            onChange && onChange(new Date(date));
        } else {
            this.setState({
                error: true,
            });
        }

        if (onPickClose) {
            this.setState({
                isOpen: false,
            });
        }
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
        const [day, month, year] = inputValue
            .split(' ')[0]
            .split('.')
            .map(s => s.replace(underscore, ''));

        const newMonth = Number(month - 1);

        if (withTime) {
            const [hour, minute, second] = inputValue
                .split(' ')[1]
                .split(':')
                .map(s => s.replace(underscore, ''));

            const date = new Date(year, newMonth, day, hour, minute, second);

            if (this.dateIsValid(date)) {
                onChange && onChange(date);

                this.setState({
                    error: false,
                });
            } else {
                this.setState({
                    error: true,
                });
            }
        } else {
            const date = new Date(year, newMonth, day);
            if (this.dateIsValid(date)) {
                onChange && onChange(date);
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
            selectsStart,
            selectsEnd,
            startDate,
            endDate,
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
            monthListIsOpen,
            yearsListIsOpen,
        } = this.state;

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
                            height: withTime ? 324 : 266,
                            visibility: isOpen ? 'visible' : 'hidden',
                            top: offsetTop,
                            left: offsetLeft,
                            transform: `translateY(${position === 'top'
                                ? -100
                                : height}${position === 'top' ? '%' : 'px'})`,
                        }}
                    >
                        <MontshList
                            onRefMonthsList={this.onRefMonthsList}
                            monthListIsOpen={monthListIsOpen}
                            date={date}
                            onChange={this.onMonthChange}
                        />
                        <YearsList
                            onRefYearsList={this.onRefYearsList}
                            yearsListIsOpen={yearsListIsOpen}
                            date={date}
                            onChange={this.onYearsChange}
                        />
                        <Control
                            openMonthsList={this.openMonthsList}
                            openYearsList={this.openYearsList}
                            date={date}
                            onPrev={this.handlePrevTime}
                            onNext={this.handleNextTime}
                        />
                        <Calendar
                            selectsStart={selectsStart}
                            selectsEnd={selectsEnd}
                            startDate={startDate}
                            endDate={endDate}
                            withOffsetDate={withOffsetDate}
                            disabledOffsetDate={disabledOffsetDate}
                            value={value}
                            weekOffset={weekOffset}
                            dateIsValid={this.dateIsValid}
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
                <IMaskInput
                    mask={withTime ? dateFormatWithTime : dateFormat}
                    lazy={false}
                    groups={{
                        DD: new IMask.MaskedPattern.Group.Range([0, 31]),
                        MM: new IMask.MaskedPattern.Group.Range([0, 12]),
                        YYYY: new IMask.MaskedPattern.Group.Range([0, 9999]),
                        HH: new IMask.MaskedPattern.Group.Range([0, 23]),
                        mm: new IMask.MaskedPattern.Group.Range([0, 59]),
                        ss: new IMask.MaskedPattern.Group.Range([0, 59]),
                    }}
                    style={{ height }}
                    ref={input => this.onRefInput(input)}
                    value={inputValue}
                    className={`date-picker-control ${error ? 'error' : ''}`}
                    placeholder={this.getPlaceHolder()}
                    onBlur={this._sumbitDate}
                    onAccept={this.onChangeInput}
                />
                <button
                    className={`toggle-button ${isOpen ? 'isOpen' : ''}`}
                    onClick={this._openCalendar}
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
