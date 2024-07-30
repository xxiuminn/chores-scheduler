import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useContext, useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import { jwtDecode } from "jwt-decode";
import TopNav from "../components/TopNav";
import styles from "../components/Subscribe.module.css";

const UserProfile = () => {
  const fetchData = useFetch();
  // const useCtx = useContext(UserContext);
  const accessToken = localStorage.getItem("token");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const queryClient = useQueryClient();
  const uuid = jwtDecode(accessToken).uuid;
  const [changedAlert, setChangedAlert] = useState(false);

  const { data, isSuccess } = useQuery({
    queryKey: ["user"],
    queryFn: async () =>
      await fetchData("/users/" + uuid, undefined, undefined, accessToken),
  });

  const { mutate } = useMutation({
    mutationFn: async () => {
      return await fetchData(
        "/users/update",
        "PATCH",
        {
          name,
          email,
          uuid,
        },
        accessToken
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
      setChangedAlert(true);
      timeout();
    },
  });

  const timeout = setTimeout(() => {
    setChangedAlert(false);
  }, 600);

  useEffect(() => {
    if (data) {
      setName(data.name);
      setEmail(data.email);
    }
  }, [data]);

  const handleSave = (e) => {
    e.preventDefault();
    mutate();
  };

  return (
    <>
      <TopNav />
      {isSuccess && (
        <div className={styles.background}>
          <div className="d-flex flex-column justify-content-center align-items-center m-5">
            <div>
              <div className="mb-2">
                <h5>Manage Your Personal Information.</h5>
              </div>
              <div className="mb-4 text-center">
                You are using a {data.account_type} account.
              </div>
              <form
                className="d-flex flex-column justify-content-center align-items-center needs-validation"
                novalidate
                onSubmit={handleSave}
              >
                <div className="d-flex flex-column justify-content-start align-items-start mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    required
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                  ></input>
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="email"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  ></input>
                </div>
                <button type="submit" className="mb-3">
                  Save
                </button>
                {changedAlert && (
                  <div class="alert alert-success" role="alert">
                    Changed successful
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfile;
