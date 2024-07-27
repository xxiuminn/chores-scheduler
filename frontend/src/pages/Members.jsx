import React from "react";
import NavBar from "../components/NavBar";

const Members = () => {
  return (
    <>
      <NavBar />
      <div>
        <div>
          <div>Invite Members to join You</div>
          <button>Invite With link</button>
        </div>

        <div>
          <div>Members</div>
          <button>Remove</button>
        </div>
      </div>
    </>
  );
};

export default Members;
