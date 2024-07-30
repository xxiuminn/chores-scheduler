import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Calendar.module.css";
import { jwtDecode } from "jwt-decode";
import NavBar from "./NavBar";
import { useQueryClient } from "@tanstack/react-query";

const TopNav = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const logout = () => {
    console.log("clearing token from local storage");
    queryClient.removeQueries();
    localStorage.removeItem("token");
    console.log("navigating to login page");
    navigate("/login");
    console.log("logged out");
  };

  return (
    <div className="row mx-4 my-3">
      <div className={styles.topnav}>
        <NavBar />
        <div>
          Welcome <b>{jwtDecode(localStorage.getItem("token")).name}</b>
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
  );
};

export default TopNav;
