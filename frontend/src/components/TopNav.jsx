import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Calendar.module.css";

const TopNav = () => {
  const navigate = useNavigate();
  const logout = () => {
    // useCtx.setAccessToken("");
    console.log("clearing token from local storage");
    localStorage.removeItem("token");
    // console.log("clearing token from context");
    // useCtx.setAccessToken("");
    console.log("navigating to login page");
    navigate("/login");
    console.log("logged out");
  };

  return (
    <>
      <div className={styles.toprightnav}>
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
    </>
  );
};

export default TopNav;
