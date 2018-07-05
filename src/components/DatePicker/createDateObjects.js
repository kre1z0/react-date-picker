import moment from "moment";

export function createDateObjects(date, weekOffset) {
    const startOfMonth = date.startOf('month');

    let diff = startOfMonth.weekday() - weekOffset;
    if (diff < 0) diff += 14;

    const prevMonthDays = [];
    for (let i = 0; i < diff; i++) {
        prevMonthDays.push({
            date: startOfMonth.clone().subtract(diff - i, 'days'),
            classNames: 'prevMonthDay',
        });
    }

    const currentMonthDays = [];
    for (let i = 1; i < date.daysInMonth() + 1; i++) {
        currentMonthDays.push({
            date: moment([date.year(), date.month(), i]),
        });
    }

    const daysAdded = prevMonthDays.length + currentMonthDays.length - 1;

    const nextMonthDays = [];
    let i = 1;
    while ((daysAdded + i) % 14 !== 0) {
        nextMonthDays.push({
            date: currentMonthDays[currentMonthDays.length - 1].date
                .clone()
                .add(i, 'days'),
            classNames: 'nextMonthDay',
        });

        i += 1;
    }

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
}
