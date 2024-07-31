import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserProfile from "./pages/UserProfile";
import Members from "./pages/Members";
import Calendar from "./components/Calendar";
import JoinGroup from "./components/JoinGroup";
import Subscription from "./pages/Subscription";

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<Navigate replace to="/login" />} />
          <Route path="/board" element={<Calendar />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/userprofile" element={<UserProfile />} />
          <Route path="/members" element={<Members />} />
          <Route path="/joingroup" element={<JoinGroup />} />
          <Route path="/subscribe" element={<Subscription />} />
        </Routes>
      </QueryClientProvider>
    </>
  );
}

export default App;
