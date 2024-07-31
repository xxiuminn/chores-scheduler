import React from "react";
import styles from "../components/Calendar.module.css";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <>
      <button
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvas"
        aria-controls="offcanvas"
        className={styles.opennavbar}
      >
        <i className="bi bi-arrow-right"></i>
      </button>

      <div
        className="offcanvas offcanvas-start"
        tabindex="-1"
        id="offcanvas"
        aria-labelledby="offcanvas"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvas"></h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <ul className="options">
            <li>
              <Link to="/board">
                <i className="bi bi-calendar-heart m-3"></i>Your Family Board
              </Link>
            </li>
            <br />
            <li>
              <Link to="/members">
                <i className="bi bi-people m-3"></i>Members
              </Link>
            </li>
            <br />
            <li>
              <Link to="/subscribe">
                <i className="bi bi-hand-thumbs-up m-3"></i>Upgrade Plan
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default NavBar;
