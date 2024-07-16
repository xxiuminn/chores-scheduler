import React, { useState } from "react";
import styles from "./Calendar.module.css";
import CalendarRow from "./CalendarRow";

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [year, setYear] = useState(selectedDate.getFullYear());
  const [monthIndex, setMonthIndex] = useState(selectedDate.getMonth());
  const yearStart = () => {
    const firstDateOfYear = new Date(year, 0, 1);
    let dayOfFirstDateOfYear = firstDateOfYear.getDay();
    const dateOfFirstWeekOfYear = new Date(year, 0, 1 - dayOfFirstDateOfYear);
    return dateOfFirstWeekOfYear;
  };
  const [week, setWeek] = useState(
    Math.ceil((selectedDate - yearStart() + 1) / 86400000 / 7)
  );
  let thisMonth = selectedDate.toLocaleString("en-GB", {
    month: "long",
    year: "numeric",
  });

  console.log(yearStart());
  const monthsInYear = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const daysInWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const firstDateOfMonth = new Date(year, monthIndex, 1);
  console.log("firstDateOfMonth", firstDateOfMonth);
  console.log("firstDateOfMonth", firstDateOfMonth.getDate());
  // const dayOfFirstDateOfMonth = firstDateOfMonth.getDay();
  // console.log("dayOfFirstDateOfMonth", dayOfFirstDateOfMonth);
  console.log(new Date(year, monthIndex, -1));

  const firstWeekOfMonth = Math.ceil(
    (new Date(year, monthIndex, 1) - yearStart() + 1) / 86400000 / 7
  );
  console.log("firstWeekOfMonth", firstWeekOfMonth);

  const lastDateOfMonth = new Date(year, monthIndex + 1, 0);
  console.log("lastDateOfMonth", lastDateOfMonth);

  const dayOfLastDateOfMonth = lastDateOfMonth.getDay();
  const daysInMonth = lastDateOfMonth.getDate();
  console.log("daysInMonth", daysInMonth);

  const lastWeekOfMonth = Math.ceil(
    (new Date(year, monthIndex, daysInMonth) - yearStart() + 1) / 86400000 / 7
  );
  console.log("lastWeekOfMonth", lastWeekOfMonth);

  const getMonthArr = () => {
    let monthArr = [];
    let dayOfFirstDateOfMonth = firstDateOfMonth.getDay();
    while (dayOfFirstDateOfMonth > 0) {
      // monthArr.push(new Date(year, monthIndex, 1 - dayOfFirstDateOfMonth));
      // dayOfFirstDateOfMonth -= 1;
      const fullDate = new Date(year, monthIndex, 1 - dayOfFirstDateOfMonth);
      const date = fullDate.getDate();
      const weekOfDate = Math.ceil((fullDate - yearStart() + 1) / 86400000 / 7);
      monthArr.push({ weekOfDate, date });
      dayOfFirstDateOfMonth -= 1;
    }
    for (let date = 1; date < daysInMonth + 1; date++) {
      const day = new Date(year, monthIndex, date).getDay();
      const weekOfDate = Math.ceil(
        (new Date(year, monthIndex, date) - yearStart() + 1) / 86400000 / 7
      );
      // monthArr.push(new Date(year, monthIndex, date));
      monthArr.push({ weekOfDate, date });
    }
    return monthArr;
  };

  console.log(getMonthArr());

  return (
    <div className="container">
      <div className="row text-center">
        <div onClick={() => setWeek(week - 1)}>
          <i className="bi bi-arrow-left-circle"></i>
        </div>
        <div className="col">{thisMonth}</div>
        <div onClick={() => setWeek(week + 1)}>
          <i className="bi bi-arrow-right-circle"></i>
        </div>
      </div>
      <div className="row text-center">
        {daysInWeek.map((date) => (
          <div className="col">{date}</div>
        ))}
      </div>
      {/* calendar weekly view - only showing the 'selected' week */}
      <div className="row text-center">
        {getMonthArr().map((item) => {
          if (item.weekOfDate === week) {
            return <div className="col">{item.date}</div>;
          }
        })}
      </div>
    </div>
  );
};

export default Calendar;
