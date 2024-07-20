import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Cookies from "js-cookie";
import UserContext from "./context/user";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Calendar from "./components/Calendar";

const queryClient = new QueryClient();

function App() {
  const [showLogin, setShowLogin] = useState(true);
  const [accessToken, setAccessToken] = useState("");

  const handleShowLogin = () => {
    setShowLogin(!showLogin);
  };

  useEffect(() => {
    setAccessToken(Cookies.get("token"));
  }, []);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <UserContext.Provider value={{ accessToken, setAccessToken }}>
          {accessToken && <Calendar />}
          {!accessToken && (
            <>
              {showLogin && <Login handleShowLogin={handleShowLogin} />}
              {!showLogin && <Register handleShowLogin={handleShowLogin} />}
            </>
          )}
        </UserContext.Provider>
      </QueryClientProvider>
    </>
  );
}

export default App;
