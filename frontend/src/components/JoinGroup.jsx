import React, { useState } from "react";
import useFetch from "../hooks/useFetch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import TopNav from "./TopNav";

const JoinGroup = () => {
  const queryClient = useQueryClient();
  const fetchData = useFetch();
  const accessToken = localStorage.getItem("token");
  // console.log(accessToken);
  const claims = jwtDecode(accessToken);
  // console.log(claims);
  const [groupName, setGroupName] = useState("");
  const navigate = useNavigate();

  // fetch user info

  const { data: userData, isSuccess } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      // console.log("get user data please");
      return await fetchData(
        "/users/user/" + claims.uuid,
        undefined,
        undefined,
        accessToken
      );
    },
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
          uuid: claims.uuid,
        },
        accessToken
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["usergroup"]);
      // console.log("successful in creating group");
      navigate("/board");
    },
  });

  // console.log(claims);

  const { mutate: updateUser } = useMutation({
    mutationFn: async () => {
      return await fetchData(
        "/users/update",
        "PATCH",
        {
          group_id: userData.group_id,
          uuid: claims.uuid,
          membership: "ACTIVE",
        },
        accessToken
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
      // console.log("successful in joining group invitation");
      navigate("/board");
    },
  });

  return (
    <>
      <TopNav />
      <div className="d-flex flex-column justify-content-center align-items-start m-3">
        <form className="d-flex flex-column justify-content-center align-items-start needs-validation m-2">
          <div>
            You currently don't have a group yet. Create a group to gain access
            to the free account features.
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
      </div>
    </>
  );
};

export default JoinGroup;
