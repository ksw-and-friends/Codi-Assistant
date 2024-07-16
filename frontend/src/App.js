import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import SignupPage from "./pages/Signup/SignupPage";
import LoginPage from "./pages/Login/LoginPage";
import ChatRoom from "./pages/ChatRoom/Chat"
import './styles/global.css';
import { useState } from "react";

const App = () => {
  const [isLogin, setIsLogin] = useState(false)

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/chatroom" element={<ChatRoom isLogin={isLogin} setIsLogin={setIsLogin} />} />
      </Routes>
    </Router>
  )
};

export default App;