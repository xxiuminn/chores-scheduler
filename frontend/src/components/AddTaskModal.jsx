import React, { useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";
import { jwtDecode } from "jwt-decode";

const AddTaskModal = (props) => {
  const useCtx = useContext(UserContext);
  const queryClient = useQueryClient();
  const [deadline, setDeadline] = useState("");
  const [title, setTitle] = useState("");
  const [isRecurring, setIsRecurring] = useState("");
  const [isRotate, setIsRotate] = useState("");
  const [userGroupId, setUserGroupId] = useState("");
  const [assignedUser, setAssignedUser] = useState("");
  const [rule, setRule] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [schedule, setSchedule] = useState("");
  const fetchData = useFetch();
  const [members, setMembers] = useState([]);

  const accessToken = useCtx.accessToken;
  const claims = jwtDecode(accessToken);
  // console.log(claims);

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

  const { data, isSuccess } = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      return await fetchData(
        "/usergroups/members",
        "POST",
        {
          usergroup_id: claims.group_id,
        },
        accessToken
      );
    },
  });

  useEffect(() => {
    if (data) {
      setMembers(data);
    }
    // console.log(data);
  }, [data]);

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
          created_by: claims.uuid,
          is_rotate: isRotate,
          rule,
          usergroup_id: claims.group_id,
        },
        accessToken
      ),
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      console.log("successful");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate();
    console.log("form submitted");
  };

  return (
    <>
      <div
        className="modal fade"
        id="addtaskmodal"
        tabindex="-1"
        aria-labelledby="addtaskmodal"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="d-flex flex-column justify-content-between align-items-center">
              <button
                type="button"
                className="btn-close align-self-end me-3 mt-3"
                data-bs-dismiss="modal"
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
                >
                  <option value="" disabled selected>
                    Pick a member
                  </option>
                  {isSuccess &&
                    data.map((member) => {
                      return <option value={member.uuid}>{member.name}</option>;
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
    </>
  );
};

export default AddTaskModal;
