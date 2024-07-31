import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useContext, useState } from "react";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";
import { jwtDecode } from "jwt-decode";

const EditTaskModal = (props) => {
  const fetchData = useFetch();
  const accessToken = localStorage.getItem("token");
  // const useCtx = useContext(UserContext);
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(props.data.title);
  const [status, setStatus] = useState(props.data.status);
  const [updateType, setUpdateType] = useState("");
  const formattedDeadline = new Date(props.data.deadline).toLocaleDateString();
  const [deadline, setDeadline] = useState(
    formattedDeadline.split("/")[2] +
      "-" +
      formattedDeadline.split("/")[1] +
      "-" +
      formattedDeadline.split("/")[0]
  );

  const [assignedUser, setAssignedUser] = useState(props.data.assigned_user);
  // console.log(props.task.id);

  const { mutate } = useMutation({
    mutationFn: async () => {
      await fetchData(
        "/tasks/" + updateType,
        "PATCH",
        {
          title,
          deadline,
          assigned_user: assignedUser,
          status,
          task_id: props.data.id,
          last_modified_by: jwtDecode(accessToken).uuid,
        },
        accessToken
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      // console.log("update successful");
      props.handleEditModal();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate();
  };

  return (
    // edit chore modal
    <>
      <div className="modal fade show d-block" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="d-flex flex-column justify-content-between align-items-center">
              <button
                type="button"
                className="btn-close align-self-end me-3 mt-3"
                // data-bs-dismiss="modal"
                onClick={props.handleEditModal}
                aria-label="Close"
              ></button>
              <h1 className="modal-title">Edit chore</h1>
            </div>

            <form
              className="d-flex justify-content-center align-items-center needs-validation"
              novalidate
              onSubmit={handleSubmit}
            >
              <div className="d-flex flex-column justify-content-center align-items-start">
                <div className="mt-2">
                  <label htmlFor="chore-name" className="form-label">
                    Chore Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="chore-name"
                    required
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    maxLength="50"
                  ></input>
                  <div id="instruction1" className="form-text">
                    Include a title below 50 characters.
                  </div>
                </div>

                <div className="mt-2">
                  <label htmlFor="date" className="form-label">
                    Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="date"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                  ></input>
                  <div id="instruction2" className="form-text">
                    When the chore should be completed by.
                  </div>
                </div>

                <label className="form-label mt-2">Assign Member</label>
                <select
                  className="form-select"
                  aria-label=".form-select members"
                  required
                  onChange={(e) => setAssignedUser(e.target.value)}
                  value={assignedUser}
                >
                  {props.members.map((member) => {
                    return <option value={member.uuid}>{member.name}</option>;
                  })}
                </select>

                <label className="form-label mt-2">Status</label>
                <select
                  className="form-select"
                  aria-label=".form-select status"
                  required
                  onChange={(e) => setStatus(e.target.value)}
                  value={status}
                >
                  {["IN PROGRESS", "COMPLETED"].map((state) => {
                    return <option value={state}>{state}</option>;
                  })}
                </select>

                <label className="form-label mt-2">
                  How would you like to edit your chore?
                </label>
                <div>
                  <div className="form-check form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="updatechore"
                      id="updateone"
                      value="updateone"
                      required
                      checked={updateType === "updateone"}
                      onChange={() => setUpdateType("updateone")}
                    />
                    <label className="form-check-label" htmlFor="updateone">
                      This chore only
                    </label>
                  </div>

                  {props.data.is_recurring && (
                    <>
                      <div className="form-check form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="updatechore"
                          id="updatefollowing"
                          value="updatefollowing"
                          required
                          checked={updateType === "updatefollowing"}
                          onChange={() => setUpdateType("updatefollowing")}
                          disabled={
                            props.userData.account_type === "FREE"
                              ? true
                              : false
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor="updatefollowing"
                        >
                          This and following chores
                        </label>
                      </div>

                      <div className="form-check form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="updatechore"
                          id="updateall"
                          value="updateall"
                          required
                          checked={updateType === "updateall"}
                          onChange={() => setUpdateType("updateall")}
                          disabled={
                            props.userData.account_type === "FREE"
                              ? true
                              : false
                          }
                        />
                        <label className="form-check-label" htmlFor="updateall">
                          All chores
                        </label>
                      </div>
                    </>
                  )}
                </div>
                <button className="mt-4 mb-5 align-self-center" type="submit">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default EditTaskModal;
