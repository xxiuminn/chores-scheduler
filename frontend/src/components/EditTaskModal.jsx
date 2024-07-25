import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useContext, useState } from "react";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";

const EditTaskModal = (props) => {
  const fetchData = useFetch();
  const useCtx = useContext(UserContext);
  const [openAlert, setOpenAlert] = useState(false);
  const [deleteType, setDeleteType] = useState("");
  const queryClient = useQueryClient();

  const { mutate: delTask } = useMutation({
    mutationFn: async () => {
      await fetchData(
        "/tasks/" + deleteType,
        "DELETE",
        {
          task_id: props.data.id,
        },
        useCtx.accessToken
      );
    },
    onSuccess: () => queryClient.invalidateQueries(["task", deleteType]),
  });

  const handleDel = (value) => {
    // e.preventDefault();
    setDeleteType(value);
  };

  return (
    <>
      {/* <div
        className="modal fade"
        id="viewtaskmodal"
        tabindex="-1"
        aria-labelledby="viewtaskmodal"
        aria-hidden="true"
      > */}

      {!openAlert && (
        // modal to view task
        <>
          <div>
            <div
              className="modal fade show d-block"
              tabIndex="-1"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="d-flex flex-column justify-content-between align-items-center">
                    <button
                      type="button"
                      className="btn-close align-self-end me-3 mt-3"
                      onClick={props.handleOpenModal}
                      // data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>

                  <div className="d-flex flex-column justify-content-center align-items-start m-3">
                    <div>{props.data.title}</div>
                    <div className="mt-3">{props.data.assigned_user}</div>
                    <div>{props.data.deadline}</div>
                    <div>{props.data.status}</div>
                    <div>{props.data.created_by}</div>
                    <div>{props.data.rule}</div>
                    <div className="d-flex mt-3">
                      <div type="button">
                        <i
                          className="bi bi-trash3"
                          onClick={() => setOpenAlert(true)}
                        ></i>
                      </div>
                      <div type="button" className="mx-3">
                        <i className="bi bi-pencil"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {openAlert && (
        // modal to confirm delete
        <>
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="d-flex flex-column justify-content-between align-items-center">
                  <button
                    type="button"
                    className="btn-close align-self-end me-3 mt-3"
                    onClick={() => setOpenAlert(false)}
                    // data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                  <h1 className="modal-title">Delete Recurring Chore</h1>

                  <form
                    className="d-flex flex-column justify-content-center align-items-center needs-validation"
                    novalidate
                    onSubmit={delTask}
                  >
                    <label className="form-label mt-2">
                      How would you like to delete your chore?
                    </label>
                    <div>
                      <div className="form-check form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="delchore"
                          id="deleteone"
                          value="deleteone"
                          required
                          checked={deleteType === "deleteone"}
                          onChange={() => handleDel("deleteone")}
                        />
                        <label className="form-check-label" htmlFor="deleteone">
                          This chore only
                        </label>
                      </div>

                      {props.data.is_recurring && (
                        <>
                          <div className="form-check form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="delchore"
                              id="deletefollowing"
                              value="deletefollowing"
                              required
                              checked={deleteType === "deletefollowing"}
                              onChange={() => handleDel("deletefollowing")}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="deletefollowing"
                            >
                              This and following chores
                            </label>
                          </div>

                          <div className="form-check form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="delchore"
                              id="deleteall"
                              value="deleteall"
                              required
                              checked={deleteType === "deleteall"}
                              onChange={() => handleDel("deleteall")}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="deleteall"
                            >
                              All chores
                            </label>
                          </div>
                        </>
                      )}
                      <button
                        className="mt-4 mb-5 align-self-center"
                        type="submit"
                      >
                        Delete
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </>
  );
};

export default EditTaskModal;
