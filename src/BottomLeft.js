import React from "react";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Select from "react-select";
import { NumericFormat } from "react-number-format";
import { AppContext } from "./AppContext";
import customStyles from "./customStyles";

function BottomLeft() {
  
  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Hónapok 0-tól 11-ig vannak
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [selectedServiceType, setSelectedServiceType] = useState(null);
  const [mf, setMf] = useState("");
  const [otf, setOtf] = useState("");
  const [term, setTerm] = useState("");
  const [offerParams, setOfferParams] = useState([]);
  const [selectedRadio, setSelectedRadio] = useState("firm");
  const [selectedDate, setSelectedDate] = useState(
    getCurrentDate()
  );
  const [selectedValidity, setSelectedValidity] = useState("30");
  const { selectedAm, selectedUgyfel, serviceTypes, setServiceTypes } = useContext(AppContext);

  useEffect(() => {
    const fetchServiceTypes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/getservicetypes"
        );

        const formattedServiceTypes = response.data.map((type) => ({
          tipus_id: type.tipus_id,
          tipus_nev: type.tipus_nev,
        }));

        setServiceTypes(formattedServiceTypes);
      } catch (error) {
        console.error("There was an error fetching AMs!", error);
      }
    };

    fetchServiceTypes();
  }, []);

useEffect(() => {
  if (message) {
    const timer = setTimeout(() => {
      setMessage(""); // Az üzenet eltávolítása 3 másodperc után
    }, 3000);

    return () => clearTimeout(timer); // Törli a timer-t, ha a komponens unmountol
  }
}, [message]);

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
    formData.append("radio", selectedRadio);
    formData.append("date", selectedDate);
    formData.append("valid", selectedValidity);
    formData.append("am", selectedAm.value);
    formData.append("ugyfel", selectedUgyfel.value);
    formData.append("params", JSON.stringify(offerParams));

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
      setMessage("Sikeres feltöltés.");
    } catch (err) {
      console.error(err);
      setMessage("File upload failed.");
    }
  };

  const handleTypeChange = (selectedOption) => {
    setSelectedServiceType(selectedOption);
  };

  const handleMfChange = (values) => {
    const { value } = values;
    setMf(value);
  };

  const handleOtfChange = (values) => {
    const { value } = values;
    setOtf(value);
  };

  const handleTermChange = (values) => {
    const { value } = values;
    setTerm(value);
  };

  const options = serviceTypes.map((type) => ({
    value: type.tipus_id,
    label: type.tipus_nev,
  }));

  const adSor = () => {
    const ujParam = {
      szolgTipus: selectedServiceType.label,
      tipus_id: selectedServiceType.value,
      havidij: mf,
      egyszeridij: otf,
      futamido: term,
    };
    setOfferParams([...offerParams, ujParam]);
    console.log(offerParams);
  };

  const kiSor = (e) => {
    offerParams.splice(e.target.id, 1);
    setOfferParams([...offerParams]);
  };

  const onOptionChange = (e) => {
    setSelectedRadio(e.target.value);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleValidityChange = (e) => {
    setSelectedValidity(e.target.value);
  };

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
          <div style={{ display: "flex" }}>
            <h2 className="h2">Feltöltési Modul</h2>
            {message && (
              <div
                className="message"
                style={{
                  marginBottom: "20px",
                  marginTop: "17px",
                  marginLeft: "40px",
                  color: message.includes("Sikeres") ? "green" : "red",
                }}
              >
                {message}
              </div>
            )}
          </div>
          <div>
            <button
              className="button"
              id="nodeb1"
              onClick={onFileUpload}
              disabled={
                !file ||
                !selectedDate ||
                !selectedValidity ||
                !offerParams[0] ||
                !selectedAm ||
                !selectedUgyfel
              }
            >
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
                  checked={selectedRadio === "firm"}
                  onChange={onOptionChange}
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
                  checked={selectedRadio === "budget"}
                  onChange={onOptionChange}
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
                  value={selectedDate}
                  id="kiadvadate"
                  onChange={handleDateChange}
                />
                <label
                  title="Az ajánlat kiadásának dátuma"
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
                  value={selectedValidity}
                  onChange={handleValidityChange}
                />
                <label
                  title="Az ajánlat érvényességi ideje napban"
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
                onClick={adSor}
                disabled={!selectedServiceType || !mf || !otf || !term}
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
              <NumericFormat
                thousandSeparator=" "
                value={mf}
                onValueChange={handleMfChange}
                placeholder="Havidíj"
                className="number-input"
              />
            </div>
            <div style={{ width: "100px" }}>
              <NumericFormat
                thousandSeparator=" "
                value={otf}
                onValueChange={handleOtfChange}
                placeholder="Egyszeri díj"
                className="number-input"
              />
            </div>
            <div style={{ width: "100px" }}>
              <NumericFormat
                thousandSeparator=" "
                value={term}
                onValueChange={handleTermChange}
                placeholder="Futamidő"
                className="number-input"
              />
            </div>
          </div>
          <div className="scrollable-container">
            {offerParams.map((param, index) => (
              <div key={index} className="list-item">
                <div style={{ width: "40px" }}>
                  <button
                    className="button"
                    style={{
                      marginRight: "0px",
                      height: "15px",
                      lineHeight: "1px",
                      fontSize: "12px",
                    }}
                    id={index}
                    onClick={kiSor}
                  >
                    -
                  </button>
                </div>
                <div className="item-field szolgtipus">{param.szolgTipus}</div>
                <div className="item-field havidij">
                  {param.havidij.replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
                </div>
                <div className="item-field egyszeridij">
                  {param.egyszeridij.replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
                </div>
                <div className="item-field futamido">
                  {param.futamido.replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BottomLeft;
