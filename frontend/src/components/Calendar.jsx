import React, { useState } from "react";
import styles from "./Calendar.module.css";
import CalendarRow from "./CalendarRow";

const Calendar = () => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [monthIndex, setMonthIndex] = useState(today.getMonth());
  const [week, setWeek] = useState(
    Math.ceil((today - new Date(year, 0, 1) + 1) / 86400000 / 7)
  );
  let thisMonth = today.toLocaleString("en-GB", {
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

  const firstDayOfMonth = new Date(year, monthIndex, 1);
  const firstDayOfMonthIndex = firstDayOfMonth.getDay();
  //underflows
  const lastDayOfMonth = new Date(year, monthIndex + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();

  let monthArr = [];
  for (let date = 1; date < daysInMonth; date++) {
    const dateIndex = new Date(year, monthIndex, date).getDay();
    const weekOfDate = Math.ceil(
      (new Date(year, monthIndex, date) - new Date(year, 0, 1) + 1) /
        86400000 /
        7
    );
    monthArr.push({ index: dateIndex, date, weekOfDate, monthIndex, year });
  }

  console.log(Math.ceil((today - new Date(year, 0, 1) + 1) / 86400000 / 7));

  return (
    <>
      {daysInWeek.map((day) => (
        <div>{day}</div>
      ))}

      {monthArr.map((item) => {
        if (item.weekOfDate === week) {
          return <div>{item.date}</div>;
        }
      })}
    </>
  );
};

export default Calendar;
