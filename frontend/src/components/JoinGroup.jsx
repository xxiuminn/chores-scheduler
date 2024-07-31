import React, { useState } from "react";
import useFetch from "../hooks/useFetch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import TopNav from "./TopNav";
import styles from "./Subscribe.module.css";

const JoinGroup = () => {
  const queryClient = useQueryClient();
  const fetchData = useFetch();
  const accessToken = localStorage.getItem("token");
  const [groupName, setGroupName] = useState("");
  const navigate = useNavigate();

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      return await fetchData("/users/user", undefined, undefined, accessToken);
    },
  });

  // fetch user info

  const { data: userData, isSuccess } = useQuery({
    queryKey: ["user", user?.group_id],
    queryFn: async () => {
      return await fetchData(
        "/users/userinfo",
        undefined,
        undefined,
        accessToken
      );
    },
    enabled: !!user?.group_id,
  });

  //create group
  const { mutate: createGroup } = useMutation({
    mutationFn: async () => {
      return await fetchData(
        "/usergroups/usergroup",
        "PUT",
        {
          usergroup_name: groupName,
          account_type: "FREE",
        },
        accessToken
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["usergroup"]);
      navigate("/board");
    },
  });

  const { mutate: acceptGroup } = useMutation({
    mutationFn: async () => {
      return await fetchData(
        "/users/update",
        "PATCH",
        {
          group_id: userData.group_id,
          membership: "ACTIVE",
        },
        accessToken
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
      navigate("/board");
    },
  });

  const { mutate: rejectGroup } = useMutation({
    mutationFn: async () => {
      return await fetchData(
        "/users/update",
        "PATCH",
        {
          group_id: null,
          membership: null,
        },
        accessToken
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
    },
  });

  const handleCreateGroup = (e) => {
    e.preventDefault();
    createGroup();
  };

  return (
    <>
      <TopNav />
      <div className={styles.background}>
        <form
          className="form-check container text-center needs-validation mt-5 mb-5 col-6"
          noValidate
          onSubmit={handleCreateGroup}
        >
          <div className="h3 row justify-content-center mb-3">Join A Group</div>
          <div className="row justify-content-center mb-3">
            Start by creating a group name.
          </div>
          <div className="row justify-content-center">
            <div className="col-3"></div>
            <input
              type="text"
              className="form-control col-6 rounded mb-3 p-2"
              required
              onChange={(e) => setGroupName(e.target.value)}
              value={groupName}
              placeholder="Group Name"
            ></input>
            <div className="col-3"></div>
          </div>
          <div className="row justify-content-center">
            <button type="submit">Create</button>
          </div>
        </form>

        {isSuccess && userData.membership === "INVITED" && (
          <div className="container col-6 mt-5">
            <div className="h3 row justify-content-center">You Are Invited</div>
            <div className="row justify-content-center mb-3">
              Note that once you have accepted the invite, you will lose all
              access to your existing group, if any.
            </div>
            <div className="row mb-3 border-top p-2 justify-content-between">
              <div className="col-3">{userData.group_name}</div>
              <div className="col-3"></div>
              <button className="col-2 me-1" onClick={acceptGroup}>
                Join
              </button>
              <button className="col-2 me-1" onClick={rejectGroup}>
                Reject
              </button>
            </div>
          </div>
        )}

        {/* <div className="d-flex flex-column justify-content-center align-items-start m-3">
          <form className="d-flex flex-column justify-content-center align-items-start needs-validation m-2">
            <div>
              You currently don't have a group yet. Create a group to gain
              access to the free account features.
            </div>
            <div className="mt-3">
              <label htmlFor="groupname" className="form-label">
                Group Name
              </label>
              <input
                type="text"
                className="form-control"
                id="groupname"
                required
                onChange={(e) => setGroupName(e.target.value)}
                value={groupName}
              ></input>
              <button type="button" className="mt-3" onClick={createGroup}>
                Create
              </button>
            </div>
          </form>

          {isSuccess && userData.membership === "INVITED" && (
            <form className="d-flex flex-column justify-content-center align-items-start needs-validation m-2">
              <label htmlFor="invite" className="form-label">
                You are invited to join a group.
              </label>
              <button type="button" className="mt-3" onClick={updateUser}>
                Join now
              </button>
            </form>
          )}
        </div> */}
      </div>
    </>
  );
};

export default JoinGroup;
