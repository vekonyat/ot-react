import React, { createContext, useState } from "react";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [selectedRadio, setSelectedRadio] = useState("firm");
  const [selectedAm, setSelectedAm] = useState(null);
  const [selectedUgyfel, setSelectedUgyfel] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  return (
    <AppContext.Provider
      value={{
        selectedRadio,
        setSelectedRadio,
        selectedAm,
        setSelectedAm,
        selectedUgyfel,
        setSelectedUgyfel,
        selectedFile,
        setSelectedFile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
