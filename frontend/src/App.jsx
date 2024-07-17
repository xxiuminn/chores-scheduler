import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Calendar from "./components/Calendar";

function App() {
  const [showLogin, setShowLogin] = useState(true);
  const queryClient = new QueryClient();

  const handleShowLogin = () => {
    setShowLogin(!showLogin);
  };

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Calendar />
        {/* {showLogin && <Login handleShowLogin={handleShowLogin} />}
      {!showLogin && <Register handleShowLogin={handleShowLogin} />} */}
      </QueryClientProvider>
    </>
  );
}

export default App;
