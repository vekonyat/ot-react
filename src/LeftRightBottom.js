import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Select from "react-select";
import { AppContext } from "./AppContext";
import customStyles from "./customStyles";

function LeftRightBottom() {
  
  const {selectedUgyfel, setSelectedUgyfel, ugyfelek, setUgyfelek} = useContext(AppContext);

  useEffect(() => {
    const fetchUgyfelek = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/getugyfelek"
        );
        const formattedUgyfelek = response.data.map((ugyfel) => ({
          ugyfel_id: ugyfel.ugyfel_id,
          cegnev: ugyfel.cegnev,
          kategoria: ugyfel.kategoria,
          cim: ugyfel.cim,
          adoszam: ugyfel.adoszam,
        }));
        setUgyfelek(formattedUgyfelek);
      } catch (error) {
        console.error("There was an error fetching the ugyfelek!", error);
      }
    };

    fetchUgyfelek();
  }, []);

    const handleChange = (selectedOption) => {
    setSelectedUgyfel(selectedOption);
  };

  const options = ugyfelek.map((ugyfel) => ({
    value: ugyfel.ugyfel_id,
    label: ugyfel.cegnev,
    cim: ugyfel.cim,
    adoszam: ugyfel.adoszam,
    kategoria: ugyfel.kategoria,
  }));

  return (
    <div className="left-right-bottom">
      <h2 className="h2">Ügyfél</h2>
      <Select
        value={selectedUgyfel}
        onChange={handleChange}
        options={options}
        placeholder="Válassz ügyfelet!"
        isClearable
        styles={customStyles} // Apply custom styles
        classNamePrefix="custom-select"
      />

      <p className="data-text">
        Cégnév: {selectedUgyfel ? selectedUgyfel.label : null}
      </p>
      <p className="data-text">
        Cím: {selectedUgyfel ? selectedUgyfel.cim : null}
      </p>
      <p className="data-text">
        Adószám: {selectedUgyfel ? selectedUgyfel.adoszam : null}
      </p>
      <p className="data-text">
        Kategória: {selectedUgyfel ? selectedUgyfel.kategoria : null}
      </p>
    </div>
  );
}

export default LeftRightBottom;
