import React, { createContext, useState, useMemo } from "react";
import PropTypes from "prop-types";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  // Add prop type validation for 'children'
  AppProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };
  const [selectedRadio, setSelectedRadio] = useState("firm");
  const [selectedAm, setSelectedAm] = useState(null);
  const [selectedUgyfel, setSelectedUgyfel] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [ams, setAms] = useState([]);
  const [ugyfelek, setUgyfelek] = useState([]);
  const [offerId, setOfferId] = useState(null);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [successSave, setSuccessSave] = useState(false);

  const contextValue = useMemo(
    () => ({
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
      setUgyfelek,
      offerId,
      setOfferId,
      serviceTypes,
      setServiceTypes,
      successSave,
      setSuccessSave,
    }),
    [
      selectedRadio,
      selectedAm,
      selectedUgyfel,
      selectedFile,
      ams,
      ugyfelek,
      offerId,
      serviceTypes,
      successSave,
    ]
  );

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export { AppContext, AppProvider };
