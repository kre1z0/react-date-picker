import React, { Component } from "react";
import cn from "classnames";
import moment from "moment";

export class Monthday extends Component {
  getSelectedDay = () => {
    const { value, date, selectsStart, selectsEnd, startDate, endDate, enterDate } = this.props;

    const enter = moment(enterDate).startOf("day");
    const isDay = date.isSame(value, "day");

    if (selectsStart && startDate && endDate) {
      const start = moment(startDate).startOf("day");
      const end = moment(endDate).startOf("day");

      if (date >= enter && date < start) {
        return "selecting-range";
      } else if (date < enter && date >= start && date < end) {
        return "in-range";
      } else if ((date >= start && date <= end) || isDay) {
        return "selectedDay";
      }
    } else if (selectsEnd && startDate && endDate) {
      const start = moment(startDate).startOf("day");
      const end = moment(endDate).startOf("day");

      if (date <= enter && date > end) {
        return "selecting-range";
      } else if (date <= end && date >= start && enter < end && enter < date) {
        return "in-range";
      } else if ((date >= start && date <= end) || isDay) {
        return "selectedDay";
      }
    } else {
      if (!selectsStart && !selectsEnd && isDay) {
        return "selectedDay";
      } else {
        return "";
      }
    }
  };
  render() {
    const { date, classNames, onChange, weekdays, onMouseEnter } = this.props;

    return (
      <div
        className={cn("monthday", this.getSelectedDay(), classNames)}
        style={{
          width: `calc(100% / ${weekdays.length})`,
        }}
      >
        <span onClick={() => onChange(date)} onMouseEnter={() => onMouseEnter(date)}>
          {date.format("D")}
        </span>
      </div>
    );
  }
}
