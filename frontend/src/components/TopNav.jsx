import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import styles from "./Calendar.module.css";
import NavBar from "./NavBar";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const TopNav = () => {
  const fetchData = useFetch();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("token");

  const logout = () => {
    queryClient.removeQueries();
    localStorage.removeItem("token");
    navigate("/login");
  };

  const {
    data: userData,
    isSuccess: userDataSuccess,
    isError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      console.log("start fetching user data");
      return await fetchData(
        "/users/userinfo",
        undefined,
        undefined,
        accessToken
      );
    },
  });

  console.log(userData);

  return (
    <>
      {isError && <div>Error in nav bar</div>}
      {userDataSuccess && (
        <div className="row mx-4 my-3">
          <div className={styles.topnav}>
            <NavBar />
            <div>
              Welcome <b>{userData.name}</b>
            </div>
            <div className="dropdown">
              <button
                className={`dropdown-toggle ${styles.profile}`}
                type="button"
                data-bs-toggle="dropdown"
              >
                <i className="bi bi-person"></i>
              </button>
              <ul className="dropdown-menu">
                <li>
                  <Link to="/userprofile" className="dropdown-item">
                    Edit profile info
                  </Link>
                </li>
                <li>
                  <div className="dropdown-item" onClick={logout}>
                    Logout
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TopNav;
