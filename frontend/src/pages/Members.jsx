import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useFetch from "../hooks/useFetch";
import TopNav from "../components/TopNav";
import styles from "../components/Subscribe.module.css";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Members = () => {
  const fetchData = useFetch();
  const accessToken = localStorage.getItem("token");
  const queryClient = useQueryClient();
  const [emailInvited, setEmailInvited] = useState("");
  const navigate = useNavigate();

  // fetch user info
  const { data: getUserData, isSuccess: userDataSuccess } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      console.log("get user data please");
      return await fetchData(
        "/users/userinfo",
        undefined,
        undefined,
        accessToken
      );
    },
  });

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
        },
        accessToken
      );
    },
    enabled: !!getUserData?.group_id,
  });

  // convert email to uuid
  const { data: getuuid, refetch } = useQuery({
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
    if (getuuid) {
      console.log(getuuid);
      inviteMember();
    }
  }, [getuuid]);

  // Invite to user group
  const { mutate: inviteMember } = useMutation({
    mutationFn: async () => {
      console.log("run");
      return await fetchData(
        "/users/invite",
        "PATCH",
        {
          group_id: getUserData.group_id,
          membership: "INVITED",
          uuid: getuuid,
        },
        accessToken
      );
    },
    onSuccess: () => {
      console.log("user invited");
      queryClient.invalidateQueries(["members"]);
      setEmailInvited("");
    },
  });

  const handleInvite = (e) => {
    e.preventDefault();
    refetch();
  };

  // quit, remove or cancel invite from user group
  const { mutate: removeMember } = useMutation({
    mutationFn: async (memberuuid) => {
      return await fetchData(
        "/users/remove",
        "PATCH",
        {
          uuid: memberuuid,
        },
        accessToken
      );
    },
    onSuccess: () => {
      console.log("user invited");
      queryClient.invalidateQueries(["members"]);
      setEmailInvited("");
      if (getuuid === jwtDecode(localStorage.getItem("token").uuid))
        navigate("/joingroup");
    },
  });

  return (
    <>
      {userDataSuccess && membersSuccess && (
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
                Invite members to collaborate and force them to do housechores
                with you.
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
                <button type="submit">Invite</button>
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
                          <div className="col-3">{member.name}</div>
                          <div className="col-5">{member.email}</div>

                          {member.email === getUserData.email ? (
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
                          <div className="col-3">{member.name}</div>
                          <div className="col-5">{member.email}</div>

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
          </div>
        </>
      )}
    </>
  );
};

export default Members;
