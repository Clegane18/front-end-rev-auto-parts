import React, { createContext, useContext, useState } from "react";

const FormDataContext = createContext();

export const useFormData = () => {
  return useContext(FormDataContext);
};

export const FormDataProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const clearFormData = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
    });
  };

  return (
    <FormDataContext.Provider value={{ formData, setFormData, clearFormData }}>
      {children}
    </FormDataContext.Provider>
  );
};
