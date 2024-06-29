import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Select from "react-select";
import { AppContext } from "./AppContext";

function LeftRightBottom() {
  const [ugyfelek, setUgyfelek] = useState([]);
  const {selectedUgyfel, setSelectedUgyfel} = useContext(AppContext);

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

  const customStyles = {
    container: (provided) => ({
      ...provided,
      width: 200,
    }),
    control: (provided) => ({
      ...provided,
      minHeight: "20px",
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: "20px",
      padding: "0 6px",
    }),
    input: (provided) => ({
      ...provided,
      margin: "0px",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: "20px",
    }),
  };

  const options = ugyfelek.map((ugyfel) => ({
    value: ugyfel.ugyfel_id,
    label: ugyfel.cegnev,
  }));

  return (
    <div className="left-right-bottom">
      <h2>Ügyfél</h2>
      <Select
        value={selectedUgyfel}
        onChange={handleChange}
        options={options}
        placeholder="Válassz ügyfelet!"
        isClearable
        styles={customStyles} // Apply custom styles
        classNamePrefix="custom-select"
      />
    </div>
  );
}

export default LeftRightBottom;
