import React, { useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useFetch from "../hooks/useFetch";
import { jwtDecode } from "jwt-decode";
import TopNav from "../components/TopNav";
import styles from "../components/Subscribe.module.css";

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

  // useEffect(() => {
  //   if (getUserData) {
  //     console.log(getUserData);
  //     setUserData(getUserData);
  //   }
  // }, [getUserData]);

  // fetch members of user group
  const { data: membersData, isSuccess: membersSuccess } = useQuery({
    queryKey: ["members", getUserData?.group_id],
    queryFn: async () => {
      console.log("start fetch members");
      return await fetchData(
        "/usergroups/members",
        "POST",
        {
          usergroup_id: getUserData.group_id,
          // membership: "ACTIVE",
        },
        accessToken
      );
    },
    enabled: !!getUserData?.group_id,
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
          group_id: getUserData.group_id,
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

  const handleInvite = (e) => {
    e.preventDefault();
    inviteMember();
  };

  return (
    <>
      <TopNav />
      <div className={styles.background}>
        <form
          className="form-check container text-center needs-validation mt-5 mb-5 col-6"
          novalidate
          onSubmit={handleInvite}
        >
          <div className="h3 row justify-content-center">
            Invite Your Family
          </div>
          <div className="row justify-content-center mb-3">
            Invite members to collaborate and force them to do housechores with
            you.
          </div>
          <div className="row justify-content-center">
            <div className="col-3"></div>
            <input
              type="email"
              id="email"
              required
              onChange={(e) => setEmailInvited(e.target.value)}
              value={emailInvited}
              className="form-control col-6 rounded mb-3 p-2"
              placeholder="Enter email here"
            ></input>
            <div className="col-3"></div>
          </div>
          <div className="row justify-content-center">
            <button onClick={refetch} className="">
              Invite
            </button>
          </div>
        </form>

        <div className={styles.memberImg}></div>

        <div className="container col-6 mt-5">
          <div className="h3 row justify-content-center">Team Members</div>
          <div className="row justify-content-center mb-3">
            Fellow comrades who have accepted the challenge.
          </div>
          {membersSuccess && (
            <>
              {membersData.map((member) => {
                if (member.membership === "ACTIVE")
                  return (
                    <div className="row mb-3 border-top p-2">
                      <div className="col-4">{member.name}</div>
                      <div className="col-4">{member.email}</div>

                      {member.email === claims.email ? (
                        <button
                          className="col-4"
                          onClick={() => removeMember(member.uuid)}
                        >
                          Leave
                        </button>
                      ) : (
                        <button
                          className="col-4"
                          onClick={() => removeMember(member.uuid)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  );
              })}
            </>
          )}
        </div>

        <div className="container col-6 mt-5">
          <div className="h3 row justify-content-center">
            Pending Invitation
          </div>
          <div className="row justify-content-center mb-3">
            Waiting for more comrades to accept the challenge.
          </div>
          {membersSuccess && (
            <>
              {membersData.map((member) => {
                if (member.membership === "INVITED")
                  return (
                    <div className="row mb-3 border-top p-2">
                      <div className="col-4">{member.name}</div>
                      <div className="col-4">{member.email}</div>

                      <button
                        className="col-4"
                        onClick={() => removeMember(member.uuid)}
                      >
                        Cancel Invite
                      </button>
                    </div>
                  );
              })}
            </>
          )}
        </div>

        {/* <div className="container text-center m-3">
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
        </div> */}
      </div>
    </>
  );
};

export default Members;
