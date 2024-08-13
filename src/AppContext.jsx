import React, { createContext, useState } from "react";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [selectedRadio, setSelectedRadio] = useState("firm");
  const [selectedAm, setSelectedAm] = useState(null);
  const [selectedUgyfel, setSelectedUgyfel] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [ams, setAms] = useState([]);
  const [ugyfelek, setUgyfelek] = useState([]);

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
        ams,
        setAms,
        ugyfelek,
        setUgyfelek
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
