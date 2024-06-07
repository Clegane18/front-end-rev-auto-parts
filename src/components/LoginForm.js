import React, { useState } from "react";
import axios from "axios";
import "../styles/LoginForm.css";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3002/api/auth/logInAdmin",
        {
          email,
          password,
        }
      );
      console.log(response.data); // Assuming the response contains the token
      // Store the token securely (e.g., in local storage)
      localStorage.setItem("token", response.data.token);
      alert("Login successful!"); // Show success alert
    } catch (error) {
      console.error("Error logging in:", error);
      if (error.response && error.response.status === 401) {
        alert("Incorrect password. Please try again."); // Show error alert
      } else {
        alert("An error occurred while logging in."); // Show error alert
      }
    }
  };

  return (
    <div className="form-container">
      {" "}
      {/* Applying the CSS class here */}
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};

export default LoginForm;
