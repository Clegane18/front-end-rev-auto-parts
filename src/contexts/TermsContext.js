import React, { createContext, useContext, useState } from "react";

const TermsContext = createContext();

export const useTerms = () => useContext(TermsContext);

export const TermsProvider = ({ children }) => {
  const [isTermsAgreed, setIsTermsAgreed] = useState(false);
  const [isTermsModalVisible, setIsTermsModalVisible] = useState(false);

  return (
    <TermsContext.Provider
      value={{
        isTermsAgreed,
        setIsTermsAgreed,
        isTermsModalVisible,
        setIsTermsModalVisible,
      }}
    >
      {children}
    </TermsContext.Provider>
  );
};
