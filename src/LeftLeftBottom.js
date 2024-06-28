import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Select from "react-select";
import { AppContext } from "./AppContext";

function LeftLeftBottom() {
  const [ams, setAms] = useState([]);
  const [selectedAm, setSelectedAm] = useState(null);
  const { selectedRadio } = useContext(AppContext);

  useEffect(() => {
    const fetchAms = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/getams");

        const formattedAms = response.data.map((am) => ({
          am_id: am.am_id,
          nev: am.nev,
          tel: am.tel,
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

  useEffect(() => {
    // Logic_selectedRadio
    const updatedAms = ams.map((service) => {
      let fajl_nev = "";
      if (selectedRadio === "firm") {
        fajl_nev = service.f_fajl_nev;
      } else if (selectedRadio === "budget") {
        fajl_nev = service.b_fajl_nev;
      } else if (selectedRadio === "tech") {
        fajl_nev = service.t_fajl_nev;
      }
      return { ...service, fajl_nev };
    });

    setAms(updatedAms);
  }, [selectedRadio]);

  const handleChange = (selectedOption) => {
    setSelectedAm(selectedOption);
  };

  const options = ams.map((am) => ({
    value: am.am_id,
    label: am.nev,
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
      <h2>Account Manager</h2>
      <Select
        value={selectedAm}
        onChange={handleChange}
        options={options}
        placeholder="Válassz AM-et!"
        isClearable
        styles={customStyles} // Apply custom styles
      />
    </div>
  );
}

export default LeftLeftBottom;
