import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useFetch from "../hooks/useFetch";
import { jwtDecode } from "jwt-decode";

const AddTaskModal = (props) => {
  const queryClient = useQueryClient();
  const [deadline, setDeadline] = useState("");
  const [title, setTitle] = useState("");
  const [isRecurring, setIsRecurring] = useState("");
  const [isRotate, setIsRotate] = useState("");
  const [assignedUser, setAssignedUser] = useState("");
  const [rule, setRule] = useState("");
  const [schedule, setSchedule] = useState("");
  const fetchData = useFetch();

  const accessToken = localStorage.getItem("token");
  const claims = jwtDecode(accessToken);

  useEffect(() => {
    if (props.modalDate) {
      setDeadline(props.modalDate);
      setTitle("");
      setIsRecurring("");
      setRule("");
      setIsRotate("");
      setAssignedUser("");
      setSchedule("");
    }
  }, [props.modalDate]);

  const handleRecurringRule = (value) => {
    setSchedule(value);
    if (value === "ONCE") {
      setIsRecurring(0);
      setRule("");
      setIsRotate("");
    } else {
      setIsRecurring(1);
      setRule(value);
    }
  };

  const { mutate } = useMutation({
    mutationFn: async () =>
      await fetchData(
        "/tasks/create",
        "PUT",
        {
          is_recurring: isRecurring,
          title,
          deadline,
          assigned_user: assignedUser,
          is_rotate: isRotate,
          rule,
        },
        accessToken
      ),
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate();
    props.closemodal();
  };

  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="d-flex flex-column justify-content-between align-items-center">
              <button
                type="button"
                className="btn-close align-self-end me-3 mt-3"
                onClick={() => props.closemodal()}
                aria-label="Close"
              ></button>
              <h1 className="modal-title">Argh another chore</h1>
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

                <label className="form-label mt-2">Schedule Chore</label>
                <div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="frequency"
                      id="once"
                      value="once"
                      required
                      checked={schedule === "ONCE"}
                      onChange={() => handleRecurringRule("ONCE")}
                    />
                    <label className="form-check-label" htmlFor="once">
                      Once
                    </label>
                  </div>

                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="frequency"
                      id="daily"
                      value="daily"
                      required
                      checked={schedule === "DAILY"}
                      onChange={() => handleRecurringRule("DAILY")}
                      disabled={
                        props.userData.account_type === "FREE" ? true : false
                      }
                    />
                    <label className="form-check-label" htmlFor="daily">
                      Daily
                    </label>
                  </div>

                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="frequency"
                      id="weekly"
                      value="weekly"
                      required
                      checked={schedule === "WEEKLY"}
                      onChange={() => handleRecurringRule("WEEKLY")}
                      disabled={
                        props.userData.account_type === "FREE" ? true : false
                      }
                    />
                    <label className="form-check-label" htmlFor="weekly">
                      Weekly
                    </label>
                  </div>
                  <div id="instruction3" className="form-text">
                    Repeat your chore if needed.
                  </div>
                </div>

                {isRecurring === 1 && (
                  <>
                    <label className="form-label mt-2">Rotate</label>
                    <div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="rotate"
                          id="no"
                          value={0}
                          onChange={(e) =>
                            setIsRotate(parseInt(e.target.value))
                          }
                          required
                        />
                        <label className="form-check-label" htmlFor="no">
                          No
                        </label>
                      </div>

                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="rotate"
                          id="yes"
                          value={1}
                          onChange={(e) =>
                            setIsRotate(parseInt(e.target.value))
                          }
                          required
                        />
                        <label className="form-check-label" htmlFor="yes">
                          Yes
                        </label>
                      </div>
                      <div id="instruction4" className="form-text">
                        Rotate chore among your members.
                      </div>
                    </div>
                  </>
                )}

                <label className="form-label mt-2">Assign Member</label>
                <select
                  className="form-select"
                  aria-label=".form-select members"
                  required
                  onChange={(e) => setAssignedUser(e.target.value)}
                  value={assignedUser}
                  key={assignedUser}
                >
                  <option value="" disabled selected>
                    Pick a member
                  </option>
                  {props.members.map((member) => {
                    return (
                      <option value={member.uuid} key={member.uuid}>
                        {member.name}
                      </option>
                    );
                  })}
                </select>

                <button className="mt-4 mb-5 align-self-center" type="submit">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div
        className="modal-backdrop fade show"
        style={{ background: "rgba(0,0,0,0.2" }}
      ></div>
    </>
  );
};

export default AddTaskModal;
