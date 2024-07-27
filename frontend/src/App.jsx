import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Routes, Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import UserContext from "./context/user";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserProfile from "./pages/UserProfile";
import Board from "./pages/Board";
import Members from "./pages/Members";

const queryClient = new QueryClient();

function App() {
  const [accessToken, setAccessToken] = useState(Cookies.get("token"));

  const logout = () => {
    Cookies.remove("token");
    setAccessToken("");
  };

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <UserContext.Provider value={{ accessToken, setAccessToken }}>
          <Routes>
            <Route path="/" element={<Navigate replace to="/login" />} />
            <Route path="/board" element={<Board />} />
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
