import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Routes, Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import UserContext from "./context/user";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Calendar from "./components/Calendar";
import UserProfile from "./pages/UserProfile";

const queryClient = new QueryClient();

function App() {
  const [showLogin, setShowLogin] = useState(true);
  const [accessToken, setAccessToken] = useState("");

  const handleShowLogin = () => {
    setAccessToken(Cookies.get("token"));
    setShowLogin(!showLogin);
  };

  useEffect(() => {
    setAccessToken(Cookies.get("token"));
  }, []);

  const logout = () => {
    Cookies.remove("token");
    setAccessToken("");
  };

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <UserContext.Provider value={{ accessToken, setAccessToken }}>
          {accessToken && <Calendar logout={logout} />}
          {!accessToken && (
            <>
              {showLogin && <Login handleShowLogin={handleShowLogin} />}
              {!showLogin && <Register handleShowLogin={handleShowLogin} />}
            </>
          )}
          {/* <Routes>
            <Route path="userprofile" element={<UserProfile />} />
          </Routes> */}
        </UserContext.Provider>
      </QueryClientProvider>
    </>
  );
}

export default App;
