import React from "react";

const TaskCards = (props) => {
  return (
    <>
      <div>{JSON.stringify(props.task)}</div>
      <div>{props.task.title}</div>
    </>
  );
};

export default TaskCards;
