import React, { useState, useEffect } from "react";
import axios from "axios";

function LeftRightTop() {
  const [services, setServices] = useState([]);
  const [selectedFileName, setSelectedFileName] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/getservices"
        );
        console.log(response.data);
        const formattedServices = response.data.map((service) => ({
          tipus_id: service.tipus_id,
          tipus_nev: service.tipus_nev,
          fajl_nev: service.sfajl_nev,
        }));
        setServices(formattedServices);
      } catch (error) {
        console.error("There was an error fetching the services!", error);
      }
    };

    fetchServices();
  }, []);

  const handleChange = (event) => {
    setSelectedFileName(event.target.value);
  };

  const openFile = async (filePath) => {
    try {
      const response = await axios.post("http://localhost:3001/api/openfile", {
        filePath,
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error opening file:", error);
    }
  };

  return (
    <div className="left-right-top">
      <p>
        <h2>{"\t"}Szolgáltatás típus</h2>
        <select value={selectedFileName} onChange={handleChange}>
          <option value="">Válassz egy szolgáltatást!</option>
          {services.map((service) => (
            <option key={service.id} value={service.fajl_nev}>
              {service.tipus_nev}
            </option>
          ))}
        </select>
      </p>
      <p>
        <button onClick={() => openFile(selectedFileName)}>Megnyitás</button>
      </p>
    </div>
  );
}

export default LeftRightTop;
