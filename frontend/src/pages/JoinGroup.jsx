import React, { useState } from "react";
import useFetch from "../hooks/useFetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const JoinGroup = () => {
  const queryClient = useQueryClient();
  const fetchData = useFetch();
  const accessToken = localStorage.getItem("token");
  console.log(accessToken);
  const claims = jwtDecode(accessToken);
  console.log(claims);
  const [groupName, setGroupName] = useState("");
  const navigate = useNavigate();

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
      navigate("/board");
    },
  });

  console.log(claims);

  const { mutate: updateUser } = useMutation({
    mutationFn: async () => {
      return await fetchData(
        "/users/update",
        "PATCH",
        {
          group_id: claims.group_id,
          uuid: claims.uuid,
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

  return (
    <div>
      <div>
        <div>
          You currently don't have a group yet. Would you like to create a group
          to gain access to the free account features?
        </div>
        <label htmlFor="groupname">Group Name</label>
        <input
          type="text"
          id="groupname"
          onChange={(e) => setGroupName(e.target.value)}
          value={groupName}
        ></input>
        <button onClick={createGroup}>Create</button>
        <div></div>
        {claims.membership === "INVITED" && <div>Invitation to join group</div>}
      </div>
      <button onClick={updateUser}>Join</button>
    </div>
  );
};

export default JoinGroup;
