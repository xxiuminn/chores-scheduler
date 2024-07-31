import React, { useEffect, useState } from "react";
import styles from "./Calendar.module.css";
import AddTaskModal from "./AddTaskModal";
import useFetch from "../hooks/useFetch";
import { useQuery } from "@tanstack/react-query";
import TaskCards from "./TaskCards";
import TopNav from "./TopNav";

const Calendar = () => {
  const fetchData = useFetch();
  const accessToken = localStorage.getItem("token");

  // states for creating weekly view calendar
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [year, setYear] = useState(selectedDate.getFullYear());
  const [monthIndex, setMonthIndex] = useState(selectedDate.getMonth());
  const daysInWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const [modalDate, setModalDate] = useState("");
  const [showModal, setShowModal] = useState(false);

  // codes to create calendar
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
    const lastDateOfMonth = new Date(year, monthIndex + 1, 0);
    const daysInMonth = lastDateOfMonth.getDate();
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

  const handleModalDate = (date) => {
    const fulldate = date.toLocaleDateString();
    setModalDate(
      fulldate.split("/")[2] +
        "-" +
        fulldate.split("/")[1] +
        "-" +
        fulldate.split("/")[0]
    );
    setShowModal(true);
  };

  // fetch user info

  const {
    data: userData,
    isSuccess: userDataSuccess,
    isError: userDataError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      console.log("start fetching user data");
      return await fetchData(
        "/users/userinfo",
        undefined,
        undefined,
        accessToken
      );
    },
  });

  // fetch tasks by user groups which depends on the user's group id.

  const {
    data: tasksData,
    isSuccess: TasksDataSuccess,
    isError: tasksDataError,
  } = useQuery({
    queryKey: ["tasks", userData?.group_id],
    queryFn: async () => {
      console.log("start fetch tasks");
      return await fetchData(
        "/tasks/usergroup",
        "POST",
        {
          usergroup_id: userData.group_id,
        },
        accessToken
      );
    },
    enabled: !!userData?.group_id,
  });

  // fetch members of user group which also depends on the user's group id.

  const { data: membersData } = useQuery({
    queryKey: ["members", userData?.group_id],
    queryFn: async () => {
      return await fetchData(
        "/usergroups/members/",
        "POST",
        {
          usergroup_id: userData.group_id,
          membership: "ACTIVE",
        },
        accessToken
      );
    },
    enabled: !!userData?.group_id,
  });

  const closemodal = () => {
    setShowModal(!showModal);
  };

  return (
    <>
      {userDataError && tasksDataError && (
        <div>oops, error getting user & tasks data!</div>
      )}

      {userDataSuccess && TasksDataSuccess && (
        <>
          <TopNav />
          <div className={styles.board}>
            <div className={styles.topnav}>
              <div className={styles.topleftnav}>
                <div>
                  <h3>{thisMonth}</h3>
                </div>
              </div>

              <div className={styles.toprightnav}>
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
                {daysInWeek.map((date, index) =>
                  getMonthArr().map((item) => {
                    if (item.weekOfDate === week && item.day === index) {
                      return (
                        <div className={styles.day}>
                          <div className={styles.date}>{date}</div>
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
                          <button
                            type="button"
                            className={styles.addtask}
                            onClick={() => handleModalDate(item.fullDate)}
                          >
                            <i className="bi bi-plus"></i> Add Task
                          </button>
                          {showModal && (
                            <AddTaskModal
                              key={item.fullDate + "addtaskmodal"}
                              modalDate={modalDate}
                              closemodal={closemodal}
                              members={membersData}
                              userData={userData}
                            />
                          )}
                          {tasksData.map((task) => {
                            if (
                              new Date(task.deadline).toLocaleDateString() ===
                              item.fullDate.toLocaleDateString().split("T")[0]
                            ) {
                              return (
                                <TaskCards
                                  key={task.id}
                                  task={task}
                                  members={membersData}
                                  userData={userData}
                                />
                              );
                            }
                          })}
                        </div>
                      );
                    }
                  })
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Calendar;
