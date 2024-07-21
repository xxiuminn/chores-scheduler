import React, { useState } from "react";
import styles from "./Calendar.module.css";

const AddTaskModal = () => {
  // const [openModal, setOpenModal] = useState(false);

  // const handleOpenModal = () => {
  //   setOpenModal(!openModal);
  // };

  return (
    <>
      <button
        type="button"
        data-bs-toggle="modal"
        data-bs-target="#addtaskmodal"
        className={styles.addtask}
      >
        <i class="bi bi-plus"></i> Add Task
      </button>

      <div
        className="modal fade"
        id="addtaskmodal"
        tabindex="-1"
        aria-labelledby="addtaskmodal"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content d-flex justify-content-center align-items-center">
            <h1 className="modal-title">Add Chores</h1>

            <label htmlFor="chore-name" className="form-label">
              Chore Name
            </label>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                id="chore-name"
              ></input>
            </div>

            <label htmlFor="date" className="form-label">
              Date
            </label>
            <div className="input-group">
              <input type="date" className="form-control" id="date"></input>
            </div>

            <div>
              <label>Schedule</label>
              <input type="radio" value="once" name="once" /> Once
              <input type="radio" value="daily" name="daily" /> Daily
              <input type="radio" value="weekly" name="weekly" /> Weekly
            </div>

            {/* <label>Assign Member</label>
            <select>
              <option>test1</option>
              <option>test 2</option>
              <option>test 3</option>
            </select> */}

            <div>
              <label>Rotate</label>
              <input type="radio" value="no" name="no" /> No
              <input type="radio" value="yes" name="yes" /> Yes
            </div>

            <button type="button" data-bs-dismiss="modal">
              Create
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddTaskModal;
