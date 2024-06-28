import React, { createContext, useState } from 'react';

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [selectedRadio, setSelectedRadio] = useState("firm");

  return (
    <AppContext.Provider value={{ selectedRadio, setSelectedRadio }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };