import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "../../services/online-store-front-customer-api";
import "../../styles/onlineStoreFrontCustomersComponent/CreateAccountPage.css";

const CreateAccountPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCreateAccount = async (event) => {
    event.preventDefault();
    try {
      const result = await signUp({ username, email, password });
      console.log(result.message);
      navigate("/online-store");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="create-account-container">
      <h2>Create Account</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleCreateAccount}>
        <div className="input-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="button-container">
          <button type="submit" className="create-account-button">
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAccountPage;
