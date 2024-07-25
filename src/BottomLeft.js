import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

function BottomLeft() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [serviceTypes, setServiceTypes] = useState([]);
  const [selectedServiceType, setSelectedServiceType] = useState(null);
  const [mf, setMf] = useState("");
  const [otf, setOtf] = useState("");
  const [term, setTerm] = useState("");

  useEffect(() => {
    const fetchServiceTypes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/getservicetypes"
        );

        const formattedServiceTypes = response.data.map((type) => ({
          tipus_d: type.tipus_id,
          tipus_nev: type.tipus_nev,
        }));

        setServiceTypes(formattedServiceTypes);
      } catch (error) {
        console.error("There was an error fetching AMs!", error);
      }
    };

    fetchServiceTypes();
  }, []);

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onFileUpload = async () => {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://localhost:3001/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage(res.data);
    } catch (err) {
      console.error(err);
      setMessage("File upload failed.");
    }
  };

  const handleTypeChange = (selectedOption) => {
    setSelectedServiceType(selectedOption);
  };

  const handleMfChange = (e) => {
    const value = e.target.value;
    // Csak pozitív számokat engedélyezünk és 2 tizedesjegy pontosságot
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setMf(value);
    }
  };

  const handleOtfChange = (e) => {
    const value = e.target.value;
    // Csak pozitív számokat engedélyezünk és 2 tizedesjegy pontosságot
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setOtf(value);
    }
  };

  const handleTermChange = (e) => {
    const value = e.target.value;
    // Csak pozitív számokat engedélyezünk és 2 tizedesjegy pontosságot
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setTerm(value);
    }
  };

  const options = serviceTypes.map((type) => ({
    value: type.tipus_id,
    label: type.tipus_nev,
  }));

  const customStyles = {
    container: (provided) => ({
      ...provided,
      width: "100px",
    }),
    control: (provided) => ({
      ...provided,
      minHeight: "20px",
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: "20px",
      padding: "0 0px",
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
    <div className="panel bottom-left">
      <div className="left-left-top" style={{ display: "flex", width: "100%" }}>
        <div>
          <h2 className="h2">Feltöltési Modul</h2>
          <div>
            <button className="button" id="nodeb1" onClick={onFileUpload}>
              Ajánlat feltöltése
            </button>
            <input
              id="fname"
              type="file"
              placeholder="Fájlnév"
              onChange={onFileChange}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
            <div style={{ flex: 1, maxWidth: "200px" }}>
              <p>
                <input
                  type="radio"
                  name="uploading"
                  value="firm"
                  id="firmajanlatbottom"
                  // checked={selectedRadio === "firm"}
                  // onChange={onOptionChange}
                />
                <label
                  title="Firm ajánlat feltöltése"
                  htmlFor="firmajanlatbottom"
                >
                  Firm ajánlat
                </label>
              </p>

              <p>
                <input
                  type="radio"
                  name="uploading"
                  value="budget"
                  id="tajakoztatoajanlatbottom"
                  // checked={selectedRadio === "budget"}
                  // onChange={onOptionChange}
                />
                <label
                  title="Tájékoztató ajánlat feltöltése"
                  htmlFor="tajakoztatoajanlatbottom"
                >
                  Tájékoztató ajánlat
                </label>
              </p>
            </div>
            <div>
              <p>
                <input
                  type="date"
                  // value={selectedDate}
                  id="kiadvadate"
                />
                <label
                  title="Firm ajánlat feltöltése"
                  htmlFor="firmajanlatbottom"
                >
                  Kiadva
                </label>
              </p>

              <p>
                <input
                  type="number"
                  name="ervenyes"
                  id="ervenyesnap"
                  placeholder="1-60"
                  min="1"
                  max="60"
                />
                <label
                  title="Tájékoztató ajánlat feltöltése"
                  htmlFor="tajakoztatoajanlatbottom"
                >
                  Érvényesség napban
                </label>
              </p>
            </div>
          </div>
        </div>
        <div style={{ paddingTop: "5px" }}>
          <div
            style={{
              display: "flex",
              // alignItems: "center",
              width: "100%",
              marginLeft: "2%",
            }}
          >
            <div style={{ width: "40px" }}></div>
            <div style={{ width: "100px" }}>Szolgáltatás</div>
            <div style={{ width: "90px" }}>Havidíj Ft</div>
            <div style={{ width: "100px" }}>Egyszeri díj Ft</div>
            <div style={{ width: "80px" }}>Futamidő hónap</div>
          </div>
          <div
            style={{
              display: "flex",
              // alignItems: "center",
              width: "100%",
              marginLeft: "2%",
            }}
          >
            <div>
              <button
                className="button"
                style={{ marginRight: "0px" }}
                id="nodeb1"
                onClick={onFileUpload}
              >
                +
              </button>
            </div>
            <div style={{ width: "100px" }}>
              <Select
                value={selectedServiceType}
                onChange={handleTypeChange}
                options={options}
                placeholder="Szolgáltatás"
                // isClearable
                styles={customStyles} // Apply custom styles
                classNamePrefix="custom-select"
              />
            </div>
            <div style={{ width: "100px" }}>
              <input
                type="number"
                id="mfInput"
                min="0"
                step="1"
                value={mf}
                onChange={handleMfChange}
                placeholder="Havidíj"
              />
            </div>
            <div style={{ width: "100px" }}>
              <input
                type="number"
                id="otfInput"
                min="0"
                step="1"
                value={otf}
                onChange={handleOtfChange}
                placeholder="Egyszeri díj"
              />
            </div>
            <div style={{ width: "100px" }}>
              <input
                style={{ width: "100px" }}
                type="number"
                id="termInput"
                min="0"
                step="1"
                value={term}
                onChange={handleTermChange}
                placeholder="Futamidő"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BottomLeft;
