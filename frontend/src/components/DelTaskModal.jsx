import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useContext, useState } from "react";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";
import EditTaskModal from "./EditTaskModal";

const DelTaskModal = (props) => {
  const fetchData = useFetch();
  // const useCtx = useContext(UserContext);
  const [openDelAlert, setOpenDelAlert] = useState(false);
  const [openEditForm, setOpenEditForm] = useState(false);
  const [deleteType, setDeleteType] = useState("");
  const queryClient = useQueryClient();
  const accessToken = localStorage.getItem("token");

  const { mutate: delTask } = useMutation({
    mutationFn: async () => {
      await fetchData(
        "/tasks/" + deleteType,
        "DELETE",
        {
          task_id: props.data.id,
        },
        accessToken
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      // console.log("delete success");
      setDeleteType("");
    },
  });

  const handleDelete = (e) => {
    e.preventDefault();
    delTask();
  };

  const handleEditModal = () => {
    setOpenEditForm(false);
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

      {!openDelAlert && !openEditForm && (
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

                  <div className="d-flex flex-column justify-content-center align-items-between m-3">
                    <div className="h4">{props.data.title}</div>
                    <hr className="col-12"></hr>
                    <div className="h5">Details</div>
                    <div>
                      <div className="mt-3 row">
                        <div className="col-6">Assigned Member</div>
                        {props.members.map((member) => {
                          if (member.uuid === props.data.assigned_user) {
                            return <div className="col-6">{member.name}</div>;
                          }
                        })}
                      </div>
                      <div className="mt-3 row">
                        <div className="col-6">To Be Completed By</div>
                        {/* <div className="col-4"></div> */}
                        <div className="col-6">
                          {new Date(props.data.deadline).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="mt-3 row">
                        <div className="col-6">Author</div>
                        {props.members.map((member) => {
                          if (member.uuid === props.data.created_by) {
                            return <div className="col-6">{member.name}</div>;
                          }
                        })}
                      </div>
                      <div className="mt-3 row">
                        <div className="col-6">Schedule</div>
                        <div className="col-6">
                          {props.data.rule ? props.data.rule : "ONE TIME"}
                        </div>
                      </div>
                      <div className="mt-3 row">
                        <div className="col-6">Status</div>
                        <div className="col-6">{props.data.status}</div>
                      </div>
                      <div className="mt-3 row">
                        <div className="col-6">Last Modified</div>
                        {props.data.modified_at ? (
                          <div className="col-6">
                            {new Date(
                              props.data.modified_at
                            ).toLocaleDateString()}
                          </div>
                        ) : (
                          <div className="col-6">Not Modified Yet</div>
                        )}
                      </div>
                      <div className="mt-3 row">
                        <div className="col-6">Last Modified By</div>
                        {props.members.map((member) => {
                          if (member.uuid === props.data.last_modified_by) {
                            return <div className="col-6">{member.name}</div>;
                          }
                        })}
                      </div>
                    </div>
                    <div className="d-flex mt-3">
                      <div type="button">
                        <i
                          className="bi bi-trash3"
                          onClick={() => setOpenDelAlert(true)}
                        ></i>
                      </div>
                      <div type="button" className="mx-3">
                        <i
                          className="bi bi-pencil"
                          onClick={() => setOpenEditForm(true)}
                        ></i>
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

      {openDelAlert && (
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
                    onClick={() => setOpenDelAlert(false)}
                    // data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                  <h1 className="modal-title">Delete Chore</h1>

                  <form
                    className="d-flex flex-column justify-content-center align-items-center needs-validation"
                    novalidate
                    onSubmit={handleDelete}
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
                          onChange={() => setDeleteType("deleteone")}
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
                              onChange={() => setDeleteType("deletefollowing")}
                              disabled={
                                props.userData.account_type === "FREE"
                                  ? true
                                  : false
                              }
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
                              onChange={() => setDeleteType("deleteall")}
                              disabled={
                                props.userData.account_type === "FREE"
                                  ? true
                                  : false
                              }
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

      {openEditForm && (
        <EditTaskModal
          userData={props.userData}
          data={props.data}
          task={props.task}
          handleEditModal={handleEditModal}
          members={props.members}
        />
      )}
    </>
  );
};

export default DelTaskModal;
