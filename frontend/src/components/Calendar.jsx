import React, { useState } from "react";
import styles from "./Calendar.module.css";
import CalendarRow from "./CalendarRow";

const Calendar = () => {
  const [date, setDate] = useState(new Date());
  const [year, setYear] = useState(date.getFullYear());
  const [monthIndex, setMonthIndex] = useState(date.getMonth());
  const [week, setWeek] = useState(
    Math.ceil((date - new Date(year, 0, 1) + 1) / 86400000 / 7)
  );
  let thisMonth = date.toLocaleString("en-GB", {
    month: "long",
    year: "numeric",
  });

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

  // const firstDayOfMonth = new Date(year, monthIndex, 1);
  // const firstDayOfMonthIndex = firstDayOfMonth.getDay();
  //underflows
  const lastDayOfMonth = new Date(year, monthIndex + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();

  //basically trying to get all the dates of the 'selected' month & put them in an array.
  let monthArr = [];
  for (let date = 1; date < daysInMonth; date++) {
    //assigning the dates to their respective days.
    const day = new Date(year, monthIndex, date).getDay();
    const weekOfDate = Math.ceil(
      (new Date(year, monthIndex, date) - new Date(year, 0, 1) + 1) /
        86400000 /
        7
    );
    monthArr.push({ day, date, weekOfDate, monthIndex, year });
  }

  // console.log(Math.ceil((date - new Date(year, 0, 1) + 1) / 86400000 / 7));

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
        {monthArr.map((item) => {
          if (item.weekOfDate === week) {
            return <div className="col">{item.date}</div>;
          }
        })}
      </div>
    </div>
  );
};

export default Calendar;
