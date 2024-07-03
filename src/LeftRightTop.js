import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import Select from "react-select";
import { AppContext } from "./AppContext";
import "./App.css"; // Import the CSS file

function LeftRightTop() {
  
  const [services, setServices] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [options, setOptions] = useState([]);
  const { selectedRadio, selectedAm, selectedUgyfel } = useContext(AppContext);
  const prevSelectedLabelRef = useRef();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/getservices"
        );
        const formattedServices = response.data.map((service) => ({
          tipus_id: service.tipus_id,
          tipus_nev: service.tipus_nev,
          f_fajl_nev: service.f_fajl_nev,
          b_fajl_nev: service.b_fajl_nev,
          t_fajl_nev: service.t_fajl_nev,
        }));
        
        setServices(formattedServices);
        updateOptions(formattedServices, selectedRadio);
      } catch (error) {
        console.error("There was an error fetching the services!", error);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    updateOptions(services, selectedRadio);
  }, [selectedRadio, services]);

  const updateOptions = (services, selectedRadio) => {
    const updatedOptions = services.map((service) => {
      let fajl_nev = "";
      if (selectedRadio === "firm") {
        fajl_nev = service.f_fajl_nev;
      } else if (selectedRadio === "budget") {
        fajl_nev = service.b_fajl_nev;
      } else if (selectedRadio === "tech") {
        fajl_nev = service.t_fajl_nev;
      }
      return { value: fajl_nev, label: service.tipus_nev };
    });

    setOptions(updatedOptions);

    // Check if the previous selected label is still valid and update the selectedFile
    const prevSelectedLabel = prevSelectedLabelRef.current;
    if (prevSelectedLabel) {
      const matchingOption = updatedOptions.find(
        (option) => option.label === prevSelectedLabel
      );
      if (matchingOption) {
        setSelectedFile(matchingOption);
      } else {
        setSelectedFile(null);
      }
    }
  };

  const handleChange = (selectedOption) => {
    setSelectedFile(selectedOption);
  };

  useEffect(() => {
    if (selectedFile) {
      prevSelectedLabelRef.current = selectedFile.label;
    } else {
      prevSelectedLabelRef.current = null;
    }
  }, [selectedFile]);

  const openFile = async () => {
   
    if (selectedFile) {
      // Check if selectedAm is also available
      try {
        const response = await axios.post(
          "http://localhost:3001/api/download",
          {
            filePath: selectedFile.value,
            amName: selectedAm ? selectedAm.label : null,
            mobil: selectedAm ? selectedAm.mobil : null,
            email: selectedAm ? selectedAm.email : null,
            ugyfel: selectedUgyfel ? selectedUgyfel.label : null,
          },
          {
            responseType: "blob", // A válasz típusának beállítása blob-ra
          }
        );

        // Kivonjuk a fájl nevét a filePath-ból
        const fileName = selectedFile.value.split("/").pop();

        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(new Blob([response.data]));
        link.setAttribute("download", fileName); // Beállítjuk a letöltendő fájl nevét
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (error) {
        console.error("There was an error downloading the file!", error);
      }
    }
  };

  const customStyles = {
    container: (provided) => ({
      ...provided,
      width: 200, // Explicit width
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
    menu: (provided) => ({
      ...provided,
      width: 200, // Ensure the dropdown menu also has the increased width
    }),
  };

  return (
    <div className="left-right-top">
      <h2 className="h2">Szolgáltatás típus</h2>
      <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
        <div style={{ flex: 1, maxWidth: "300px" }}>
          <Select
            value={selectedFile}
            onChange={handleChange}
            options={options}
            placeholder="Válassz szolgáltatást!"
            isClearable
            styles={customStyles} // Apply custom styles
            classNamePrefix="custom-select"
          />
        </div>
        <button
          onClick={openFile}
          disabled={!selectedFile}
          className="button margin-left" // Apply the CSS class for margin
        >
          Letöltés
        </button>
      </div>
    </div>
  );
}

export default LeftRightTop;
