import React, { useEffect, useState } from "react";
import styles from "./Calendar.module.css";

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [year, setYear] = useState(selectedDate.getFullYear());
  const [monthIndex, setMonthIndex] = useState(selectedDate.getMonth());

  const daysInWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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

  const getMonthArr = () => {
    let monthArr = [];
    const firstDateOfMonth = new Date(year, monthIndex, 1);
    // const firstWeekOfMonth = Math.ceil(
    //   (new Date(year, monthIndex, 1) - yearStart() + 1) / 86400000 / 7
    // );
    const lastDateOfMonth = new Date(year, monthIndex + 1, 0);
    const daysInMonth = lastDateOfMonth.getDate();
    // const lastWeekOfMonth = Math.ceil(
    //   (new Date(year, monthIndex, daysInMonth) - yearStart() + 1) / 86400000 / 7
    // );
    let dayOfFirstDateOfMonth = firstDateOfMonth.getDay();
    let dayOfLastDateOfMonth = lastDateOfMonth.getDay();

    //fill in dates for the first week of the month
    while (dayOfFirstDateOfMonth > 0) {
      const fullDate = new Date(year, monthIndex, 1 - dayOfFirstDateOfMonth);
      const day = fullDate.getDay();
      const date = fullDate.getDate();
      const weekOfDate = Math.ceil((fullDate - yearStart() + 1) / 86400000 / 7);
      monthArr.push({ weekOfDate, date, fullDate, day });
      dayOfFirstDateOfMonth -= 1;
    }

    //fill in dates for the rest of the month
    for (let date = 1; date < daysInMonth + 1; date++) {
      const fullDate = new Date(year, monthIndex, date);
      const day = fullDate.getDay();
      const weekOfDate = Math.ceil(
        (new Date(year, monthIndex, date) - yearStart() + 1) / 86400000 / 7
      );
      monthArr.push({ weekOfDate, date, fullDate, day });
    }

    // fill in dates for the last week of the month
    for (let addDays = 1; addDays < 6 - dayOfLastDateOfMonth + 1; addDays++) {
      const fullDate = new Date(year, monthIndex, daysInMonth + addDays);
      const day = fullDate.getDay();
      const date = fullDate.getDate();
      const weekOfDate = Math.ceil((fullDate - yearStart() + 1) / 86400000 / 7);
      monthArr.push({ weekOfDate, date, fullDate, day });
    }
    return monthArr;
  };

  useEffect(() => {
    setYear(selectedDate.getFullYear());
    setMonthIndex(selectedDate.getMonth());
    setWeek(Math.ceil((selectedDate - yearStart() + 1) / 86400000 / 7));
  }, [selectedDate, year]);

  const handlePrev = () => {
    setSelectedDate(new Date(selectedDate.getTime() - 7 * 24 * 60 * 60 * 1000));
  };

  const handleNext = () => {
    setSelectedDate(new Date(selectedDate.getTime() + 7 * 24 * 60 * 60 * 1000));
  };

  return (
    <>
      <div className={styles.board}>
        <div className={styles.topnav}>
          <div className={styles.topleftnav}>
            <div className={styles.navbar}>
              <i class="bi bi-arrow-right"></i>
            </div>
            <div>
              <h3>{thisMonth}</h3>
            </div>
          </div>
          <div className={styles.toprightnav}>
            <div className="dropdown">
              <button className={styles.profile}>
                <i className="bi bi-person"></i>
              </button>
              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item" href="#">
                    test
                  </a>
                </li>
              </ul>
            </div>
            <button className={styles.prevnext} onClick={handlePrev}>
              <i className="bi bi-chevron-left"></i>
            </button>
            <button className={styles.prevnext} onClick={handleNext}>
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
        <div className={styles.calendar}>
          <div className={styles.day}>
            {daysInWeek.map((date) => (
              <div>{date}</div>
            ))}
          </div>
          <div className={styles.dates}>
            {getMonthArr().map((item) => {
              {
                if (item.weekOfDate === week) {
                  return (
                    <div
                      key={item.fullDate}
                      className={
                        item.fullDate.toDateString() ==
                        selectedDate.toDateString()
                          ? styles.selected
                          : styles.date
                      }
                      onClick={() => setSelectedDate(item.fullDate)}
                    >
                      {item.date}
                    </div>
                  );
                }
              }
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Calendar;
