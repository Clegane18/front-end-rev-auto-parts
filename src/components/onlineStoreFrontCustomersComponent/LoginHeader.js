import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/g&f-logo.png";
import "../../styles/onlineStoreFrontCustomersComponent/LoginHeader.css";

const LoginHeader = () => {
  const navigate = useNavigate();

  return (
    <div id="root-login-header">
      <div className="login-header">
        <img
          src={logo}
          alt="Your Logo"
          className="login-logo"
          onClick={() => navigate("/")}
        />
        <p className="login-tagline">
          Welcome back! Please log in to your account
        </p>
      </div>
    </div>
  );
};

export default LoginHeader;
