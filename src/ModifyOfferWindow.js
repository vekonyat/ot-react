import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Select from "react-select";
import "./App.css";
import customStyles from "./customStyles"; // Importálás
import { NumericFormat } from "react-number-format";
import { AppContext } from "./AppContext";

function ModifyOfferWindow({ offerId, onClose }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [serviceTypes, setServiceTypes] = useState([]);
  const [selectedServiceType, setSelectedServiceType] = useState(null);
  const [mf, setMf] = useState("");
  const [otf, setOtf] = useState("");
  const [term, setTerm] = useState("");
  const [offerParams, setOfferParams] = useState([]);
  const [selectedRadio, setSelectedRadio] = useState("firm");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedValidity, setSelectedValidity] = useState("");
  const [resParams, setResParams] = useState([]);
  const {
    selectedAm,
    selectedUgyfel,
    selectedFile,
    setSelectedAm,
    setSelectedUgyfel,
    setSelectedFile,
    ams,
    setAms,
    ugyfelek,
    setUgyfelek,
  } = useContext(AppContext);

  useEffect(() => {
    const fetchOfferData = async () => {
      const data = {
        id: offerId,
      };

      try {
        const response = await axios.post(
          "http://localhost:3001/api/getofferdata",
          data,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        const resParams = response.data.map((params) => ({
          fajlNev: params.afajl_nev,
          ajanlatId: params.offerId,
          datum: params.datum.split("T")[0],
          valid: params.ervenyesseg,
          amNev: params.nev,
          ugyfelNev: params.cegnev,
          ugyfelId: params.ugyfel_id,
          szTipus: params.tipus_nev,
          haviDij: params.havidij,
          egyszeriDij: params.egyszeridij,
          futamIdo: params.futamido,
          reszId: params.resz_id,
          amId: params.am_id,
        }));
        console.log(resParams);
        setResParams(resParams);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOfferData();
  }, []);

  useEffect(() => {
    const fetchAms = () => {
      try {
        const formattedAms = ams.map((am) => ({
          value: am.am_id, // a value itt legyen az am_id
          label: am.nev, // a label itt legyen az am neve
        }));

        setAms(formattedAms);
      } catch (error) {
        console.error("There was an error fetching AMs!", error);
      }
    };

    fetchAms();
  }, []);

  useEffect(() => {
    if (ams.length > 0 && resParams.length > 0) {
      const selectedAm = ams.find((am) => am.value === resParams[0].amId);
      setSelectedAm(selectedAm);
    }
  }, [ams, resParams]);

  useEffect(() => {
    const fetchCust = async () => {
      try {
        const formattedUgyfelek = ugyfelek.map((cust) => ({
          value: cust.ugyfel_id, // a value itt legyen az am_id
          label: cust.cegnev, // a label itt legyen az am neve
        }));

        setUgyfelek(formattedUgyfelek);
      } catch (error) {
        console.error("There was an error fetching AMs!", error);
      }
    };

    fetchCust();
  }, []);

  useEffect(() => {
    if (ugyfelek.length > 0 && resParams.length > 0) {
      const selectedUgyfel = ugyfelek.find(
        (ugyfel) => ugyfel.value === resParams[0].ugyfelId
      );
      setSelectedUgyfel(selectedUgyfel);
    }
  }, [ugyfelek, resParams]);

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onWindowClose = () => {
    onClose();
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
    formData.append("am", selectedAm?.value);
    formData.append("ugyfel", selectedUgyfel?.value);
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
      setMessage(res.data);
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

  return (
    <div
      className="panel right-section"
      style={{
        display: "flex",
        flexDirection: "column",
        width: "90%",
        justifyContent: "flex-start",
      }}
    >
      <h2 className="h2" style={{ marginLeft: "40px" }}>
        Módosítás{" "}
      </h2>
      <div
        style={{
          display: "flex",
          width: "90%",
          marginLeft: "40px",
          marginTop: "10px",
          marginBottom: "20px",
        }}
      >
        <button
          className="button"
          id="nodeb1"
          //onClick={handleMutasdButtonClick}
        >
          Ajánlat törlése
        </button>
        <button
          className="button"
          id="nodeb1"
          //onClick={handleMutasdButtonClick}
        >
          Mentés
        </button>
        <button className="button" id="nodeb1" onClick={onWindowClose}>
          Bezárás
        </button>
      </div>
      <StatsTable
        resParams={resParams}
        ams={ams}
        customStyles={customStyles}
        selectedAm={selectedAm}
        setSelectedAm={setSelectedAm}
        ugyfelek={ugyfelek}
        selectedUgyfel={selectedUgyfel}
        setSelectedUgyfel={setSelectedUgyfel}
      />
    </div>
  );
}

const StatsTable = ({
  resParams,
  ams,
  customStyles,
  selectedAm,
  setSelectedAm,
  ugyfelek,
  selectedUgyfel,
  setSelectedUgyfel,
}) => (
  <div className="stat-field">
    <CommonData
      ams={ams}
      customStyles={customStyles}
      selectedAm={selectedAm}
      setSelectedAm={setSelectedAm}
      ugyfelek={ugyfelek}
      selectedUgyfel={selectedUgyfel}
      setSelectedUgyfel={setSelectedUgyfel}
    />
    <div className="ajanlat-reszek2">
      <div className="ajanlat-reszek">
        <div style={{ width: "40px" }}></div>
        <div style={{ width: "140px" }}>Szolgáltatás</div>
        <div style={{ width: "100px" }}>Havidíj Ft</div>
        <div style={{ width: "100px" }}>Egyszeri díj Ft</div>
        <div style={{ width: "110px" }}>Futamidő hónap</div>
      </div>
      <div
        style={{
          display: "flex",
          // alignItems: "center",
          width: "100%",
          marginLeft: "40px",
        }}
      >
        <div>
          <button
            className="button"
            style={{ marginRight: "0px" }}
            id="nodeb1"
            //       onClick={adSor}
            //       disabled={!selectedServiceType || !mf || !otf || !term}
          >
            +
          </button>
        </div>
        <div>
          <Select
            //     value={selectedServiceType}
            //     onChange={handleTypeChange}
            //     options={options}
            placeholder="Szolgáltatás"
            // isClearable
            styles={{
              ...customStyles,
              container: (provided) => ({
                ...provided,
                width: "150px",
              }),
            }} // Apply custom styles
            classNamePrefix="custom-select"
          />
        </div>
        <div style={{ width: "100px" }}>
          <NumericFormat
            thousandSeparator=" "
            //     value={mf}
            //   onValueChange={handleMfChange}
            placeholder="Havidíj"
            className="number-input"
          />
        </div>
        <div style={{ width: "100px" }}>
          <NumericFormat
            thousandSeparator=" "
            //       value={otf}
            //       onValueChange={handleOtfChange}
            placeholder="Egyszeri díj"
            className="number-input"
          />
        </div>
        <div style={{ width: "100px" }}>
          <NumericFormat
            thousandSeparator=" "
            //      value={term}
            //      onValueChange={handleTermChange}
            placeholder="Futamidő"
            className="number-input"
          />
        </div>
      </div>
      <div className="scrollable-container">
        {resParams.map((param, index) => (
          <div key={index} className="list3-item">
            <div style={{ width: "30px" }}>
              <button
                className="button"
                style={{
                  marginRight: "0px",
                  height: "15px",
                  lineHeight: "1px",
                  fontSize: "12px",
                }}
                id={index}
                //         onClick={kiSor}
              >
                -
              </button>
            </div>
            <div className="item-field szolgtipus">{param.szTipus}</div>
            <div className="item-field havidij">
              {(param.haviDij || "")
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
            </div>
            <div className="item-field egyszeridij">
              {(param.egyszeriDij || "")
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
            </div>
            <div className="item-field futamido">
              {(param.futamIdo || "")
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const CommonData = ({
  ams,
  customStyles,
  selectedAm,
  setSelectedAm,
  selectedUgyfel,
  setSelectedUgyfel,
  ugyfelek,
}) => (
  <div className="common-data-full">
    <div className="common-data">
      <div style={{ width: "155px", paddingLeft: "40px" }}>AM</div>
      <div style={{ width: "110px" }}>Ügyfél</div>
      <div style={{ width: "100px" }}>Fájlnév</div>
      <div style={{ width: "130px" }}>Firm/Budg.</div>
      <div style={{ width: "120px" }}>Dátum</div>
      <div style={{ width: "40px" }}>Valid</div>
    </div>
    <div
      style={{
        display: "flex",
        marginLeft: "40px",
        justifyContent: "flex-start",
      }}
    >
      <div>
        <Select
          value={selectedAm}
          onChange={setSelectedAm}
          options={ams}
          placeholder="Válassz AM-et!"
          isClearable
          styles={{
            ...customStyles,
            container: (provided) => ({
              ...provided,
              width: "150px",
            }),
          }}
        />
      </div>
      <div>
        <Select
          value={selectedUgyfel}
          onChange={setSelectedUgyfel}
          options={ugyfelek}
          placeholder="Válassz ügyfelet!"
          isClearable
          styles={{
            ...customStyles,
            container: (provided) => ({
              ...provided,
              width: "150px",
            }),
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <input
          id="fileInput"
          type="file"
          style={{ display: "none" }}
          onChange={(e) => {
            const fileName = e.target.files.length
              ? e.target.files[0].name
              : "Nincs fájl kiválasztva";
            document.getElementById("fileName").textContent = fileName;
          }}
        />
        <button
          type="button"
          onClick={() => document.getElementById("fileInput").click()}
          style={{ marginBottom: "5px" }}
        >
          Válassz fájlt
        </button>
        <span id="fileName">Választott fájl</span>
      </div>
      <div>
        <Select
          value={selectedAm}
          onChange={setSelectedAm}
          options={ams}
          placeholder="Firm/Budget"
          isClearable
          styles={{
            ...customStyles,
            container: (provided) => ({
              ...provided,
              width: "120px",
            }),
          }}
        />
      </div>
      <div>
        <input
          type="date"
          //   value={selectedDate}
          id="kiadvadate"
          //  onChange={handleDateChange}
        />
      </div>
      <div>
        <input
          type="number"
          name="ervenyes"
          id="ervenyesnap"
          placeholder="1-60"
          min="1"
          max="60"
          //     value={selectedValidity}
          //     onChange={handleValidityChange}
        />
      </div>
    </div>
  </div>
);

export default ModifyOfferWindow;
