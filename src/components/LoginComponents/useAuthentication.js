import { useState } from "react";

const useAuthentication = () => {
  const [authToken, setAuthToken] = useState(null);

  const login = (token) => {
    setAuthToken(token);
  };

  return { authToken, login };
};

export default useAuthentication;
