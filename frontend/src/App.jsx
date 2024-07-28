import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Routes, Navigate } from "react-router-dom";
import UserContext from "./context/user";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserProfile from "./pages/UserProfile";
import Members from "./pages/Members";
import Calendar from "./components/Calendar";
import JoinGroup from "./components/JoinGroup";
import Subscription from "./pages/Subscription";

const queryClient = new QueryClient();

function App() {
  // const [accessToken, setAccessToken] = useState(localStorage.getItem("token"));

  // console.log(localStorage.getItem("token"));

  // fetch user info

  return (
    <>
      <QueryClientProvider client={queryClient}>
        {/* <UserContext.Provider value={{}}> */}
        <Routes>
          <Route path="/" element={<Navigate replace to="/login" />} />
          <Route path="/board" element={<Calendar />} />
          {/* <Route path="/board" element={<Calendar members={membersData} />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/userprofile" element={<UserProfile />} />
          <Route path="/members" element={<Members />} />
          <Route path="/joingroup" element={<JoinGroup />} />
          <Route path="/subscribe" element={<Subscription />} />
        </Routes>
        {/* </UserContext.Provider> */}
      </QueryClientProvider>
    </>
  );
}

export default App;
