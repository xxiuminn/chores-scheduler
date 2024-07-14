import React, { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const [showLogin, setShowLogin] = useState(true);

  const handleShowLogin = () => {
    setShowLogin(!showLogin);
  };

  return (
    <>
      {showLogin && <Login handleShowLogin={handleShowLogin} />}
      {!showLogin && <Register handleShowLogin={handleShowLogin} />}
    </>
  );
}

export default App;
