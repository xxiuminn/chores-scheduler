import React, { useContext, useState } from "react";
import styles from "./Calendar.module.css";
import DelTaskModal from "./DelTaskModal";
import useFetch from "../hooks/useFetch";
import { useQuery } from "@tanstack/react-query";
import UserContext from "../context/user";

const TaskCards = (props) => {
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const useCtx = useContext(UserContext);
  const fetchData = useFetch();

  const { data, isSuccess, isFetching } = useQuery({
    queryKey: ["task"],
    queryFn: async () => {
      console.log("start query");
      return await fetchData(
        "/tasks/" + props.task.id,
        undefined,
        undefined,
        useCtx.accessToken
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
        className={styles.taskCard}
        onClick={handleOpenModal}
        // type="button"
        // data-bs-toggle="modal"
        // data-bs-target="#viewtaskmodal"
      >
        <div>
          <b>{props.task.title}</b>
        </div>
        <div>{props.task.name}</div>
        <div>{props.task.status}</div>
      </div>

      {isSuccess && openTaskModal && (
        <DelTaskModal data={data} handleOpenModal={handleOpenModal} />
      )}
    </>
  );
};

export default TaskCards;
