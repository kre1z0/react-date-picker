import React, { Component } from "react";
import cn from "classnames";
import moment from "moment";

import { Header } from "./Header";
import { Monthday } from "./Monthday";
import { createDateObjects } from "./createDateObjects";

export class Calendar extends Component {
  state = {
    enterDate: null,
  };

  onMouseEnter = date => {
    const { selectsStart, selectsEnd } = this.props;

    if (!selectsStart && !selectsEnd) return;

    this.setState({
      enterDate: date,
    });
  };

  onMouseLeave = () => {
    this.setState({
      enterDate: null,
    });
  };

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
      dateIsValid,
    } = this.props;

    const { enterDate } = this.state;

    const weekdays = moment.weekdaysShort(true);

    return (
      <div className="calendar">
        <Header weekdays={weekdays} />
        <div
          onMouseLeave={this.onMouseLeave}
          className={cn("grid", {
            ["withoutOffsetDate"]: !withOffsetDate,
            ["disabledOffsetDate"]: disabledOffsetDate,
          })}
        >
          {createDateObjects(date, weekOffset).map((item, i) => {
            return (
              <Monthday
                value={value}
                enterDate={enterDate}
                weekdays={weekdays}
                onChange={onChange}
                selectsStart={selectsStart}
                selectsEnd={selectsEnd}
                startDate={startDate}
                endDate={endDate}
                dateIsValid={dateIsValid}
                onMouseEnter={this.onMouseEnter}
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
