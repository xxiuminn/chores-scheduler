import React, { useContext, useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";
import { jwtDecode } from "jwt-decode";

const Members = () => {
  const fetchData = useFetch();
  // const useCtx = useContext(UserContext);
  const accessToken = localStorage.getItem("token");
  const [userData, setUserData] = useState("");
  const claims = jwtDecode(accessToken);
  const queryClient = useQueryClient();
  const [emailInvited, setEmailInvited] = useState("");

  // fetch user info

  const { data: getUserData } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      console.log("get user data please");
      return await fetchData(
        "/users/" + claims.uuid,
        undefined,
        undefined,
        accessToken
      );
    },
  });

  useEffect(() => {
    if (getUserData) {
      console.log(getUserData);
      setUserData(getUserData);
    }
  }, [getUserData]);

  // fetch active members of user group
  const { data: membersData, isSuccess: membersSuccess } = useQuery({
    queryKey: ["activemembers"],
    queryFn: async () => {
      console.log("start fetch members");
      return await fetchData(
        "/usergroups/members",
        "POST",
        {
          usergroup_id: userData.group_id,
          membership: "ACTIVE",
        },
        accessToken
      );
    },
  });

  // quit, remove or cancel invite from user group
  const { mutate: removeMember } = useMutation({
    mutationFn: async (uuid) => {
      console.log(uuid);
      return await fetchData(
        "/users/update",
        "PATCH",
        {
          group_id: null,
          uuid: uuid,
          membership: null,
        },
        accessToken
      );
    },
    onSuccess: () => {
      console.log("removed member");
      queryClient.invalidateQueries(["members"]);
    },
  });

  // convert email to uuid
  const { data, refetch } = useQuery({
    queryKey: ["emailtouuid"],
    queryFn: async () => {
      return await fetchData(
        "/users/invite/" + emailInvited,
        undefined,
        undefined,
        accessToken
      );
    },
    enabled: false,
  });

  useEffect(() => {
    if (data) {
      inviteMember();
    }
  }, [data]);

  // Invite to user group
  const { mutate: inviteMember } = useMutation({
    mutationFn: async () => {
      return await fetchData(
        "/users/update",
        "PATCH",
        {
          group_id: userData.group_id,
          uuid: data,
          membership: "INVITED",
        },
        accessToken
      );
    },
    onSuccess: () => {
      console.log("user invited");
      queryClient.invalidateQueries(["invitedmembers"]);
      setEmailInvited("");
    },
  });

  // get invited users
  const { data: invitedUsers, isSuccess: invitedUsersSuccess } = useQuery({
    queryKey: ["invitedmembers"],
    queryFn: async () => {
      console.log("start fetch members");
      return await fetchData(
        "/usergroups/members",
        "POST",
        {
          usergroup_id: userData.group_id,
          membership: "INVITED",
        },
        accessToken
      );
    },
  });

  return (
    <>
      <NavBar />
      <div className="container text-center m-3">
        <div className="row">
          <div className="col-3 p-3 bg-light text-black">
            <div>Invite Members to join You</div>
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="form-control"
              onChange={(e) => setEmailInvited(e.target.value)}
              value={emailInvited}
            ></input>
            <button onClick={refetch}>Invite</button>
            {invitedUsersSuccess &&
              invitedUsers.map((user) => {
                return (
                  <>
                    <div>{user.email}</div>
                    <button onClick={() => removeMember(user.uuid)}>
                      Cancel invite
                    </button>
                  </>
                );
              })}
          </div>

          <div className="col-1"></div>
          {membersSuccess && (
            <div className="col-8 p-3 bg-light text-black">
              <div className="mb-3">Members</div>
              {membersData.map((member) => {
                return (
                  <div className="mb-3">
                    <div>
                      <div>{member.name}</div>
                      <div>{member.email}</div>
                    </div>
                    {member.email === claims.email ? (
                      <button onClick={() => removeMember(member.uuid)}>
                        Leave
                      </button>
                    ) : (
                      <button onClick={() => removeMember(member.uuid)}>
                        Remove
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Members;
