// src/contexts/SecretContext.js
import React, { createContext, useState } from "react";

export const SecretContext = createContext();

export const SecretProvider = ({ children }) => {
  const [secretUnlocked, setSecretUnlocked] = useState(false);

  return (
    <SecretContext.Provider value={{ secretUnlocked, setSecretUnlocked }}>
      {children}
    </SecretContext.Provider>
  );
};
