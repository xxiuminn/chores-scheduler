import React, { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Calendar from "./components/Calendar";

function App() {
  const [showLogin, setShowLogin] = useState(true);

  const handleShowLogin = () => {
    setShowLogin(!showLogin);
  };

  return (
    <>
      <Calendar />
      {/* {showLogin && <Login handleShowLogin={handleShowLogin} />}
      {!showLogin && <Register handleShowLogin={handleShowLogin} />} */}
    </>
  );
}

export default App;
