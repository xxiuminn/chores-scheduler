import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Routes, Navigate } from "react-router-dom";
import UserContext from "./context/user";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserProfile from "./pages/UserProfile";
import Members from "./pages/Members";
import Calendar from "./components/Calendar";

const queryClient = new QueryClient();

function App() {
  const [accessToken, setAccessToken] = useState(localStorage.getItem("token"));

  // console.log(localStorage.getItem("token"));

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <UserContext.Provider value={{ accessToken, setAccessToken }}>
          <Routes>
            <Route path="/" element={<Navigate replace to="/login" />} />
            <Route path="/board" element={<Calendar />} />
            {/* <Route path="/board" element={<Calendar members={membersData} />} /> */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/userprofile" element={<UserProfile />} />
            <Route path="/members" element={<Members />} />
          </Routes>
        </UserContext.Provider>
      </QueryClientProvider>
    </>
  );
}

export default App;
