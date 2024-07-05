import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Select from "react-select";
import { AppContext } from "./AppContext";

function LeftLeftBottom() {
  const [ams, setAms] = useState([]);
  const { selectedAm, setSelectedAm } = useContext(AppContext);

  useEffect(() => {
    const fetchAms = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/getams");

        const formattedAms = response.data.map((am) => ({
          am_id: am.am_id,
          nev: am.nev,
          mobil: am.mobil,
          email: am.email,
          csoport: am.csoport,
        }));

        setAms(formattedAms);
      } catch (error) {
        console.error("There was an error fetching AMs!", error);
      }
    };

    fetchAms();
  }, []);

    const handleChange = (selectedOption) => {
    setSelectedAm(selectedOption);
     console.log(selectedAm);
  };

  const options = ams.map((am) => ({
    value: am.am_id,
    label: am.nev,
    mobil: am.mobil,
    email: am.email,
  }));

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

  return (
    <div className="left-left-bottom">
      <h2 className="h2">Account Manager</h2>
      <Select
        value={selectedAm}
        onChange={handleChange}
        options={options}
        placeholder="Válassz AM-et!"
        isClearable
        styles={customStyles} // Apply custom styles
      />
      <p className="data-text">A kiválasztott szolgáltatás adatai</p>
    </div>
  );
}

export default LeftLeftBottom;
