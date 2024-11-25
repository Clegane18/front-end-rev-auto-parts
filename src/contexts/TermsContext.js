import { createContext, useState, useContext } from "react";

const TermsContext = createContext();

export const useTerms = () => {
  return useContext(TermsContext);
};

export const TermsProvider = ({ children }) => {
  const [isTermsAgreed, setIsTermsAgreed] = useState(false);

  const resetTermsAgreement = () => {
    setIsTermsAgreed(false);
  };

  return (
    <TermsContext.Provider
      value={{
        isTermsAgreed,
        setIsTermsAgreed,
        resetTermsAgreement,
      }}
    >
      {children}
    </TermsContext.Provider>
  );
};
