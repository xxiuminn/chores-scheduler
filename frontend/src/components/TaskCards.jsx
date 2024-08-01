import React, { useState } from "react";
import styles from "./Calendar.module.css";
import DelTaskModal from "./DelTaskModal";
import useFetch from "../hooks/useFetch";
import { useQuery } from "@tanstack/react-query";

const TaskCards = (props) => {
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const accessToken = localStorage.getItem("token");
  const fetchData = useFetch();

  const {
    data: taskInfo,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ["task", props.task.id],
    queryFn: async () => {
      return await fetchData(
        "/tasks/" + props.task.id,
        undefined,
        undefined,
        accessToken
      );
    },
    enabled: openTaskModal,
  });

  const handleOpenModal = () => {
    setOpenTaskModal(!openTaskModal);
  };

  return (
    <>
      <div
        className={
          props.task.status === "IN PROGRESS"
            ? styles.taskCard
            : styles.taskCardCompleted
        }
        onClick={handleOpenModal}
      >
        <div className="h5">
          <b>{props.task.title}</b>
        </div>
        <div>
          <p>{props.task.status}</p>
        </div>
        <div className="border-top">{props.task.name}</div>
      </div>

      {isError && <div>oops error getting individual task data</div>}
      {isSuccess && openTaskModal && (
        <DelTaskModal
          key={`del-task-modal-${props.task.id}`}
          userData={props.userData}
          taskInfo={taskInfo}
          // task={props.task}
          handleOpenModal={handleOpenModal}
          members={props.members}
        />
      )}
    </>
  );
};

export default TaskCards;
