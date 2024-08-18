import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Select from "react-select";
import "./App.css";
import customStyles from "./customStyles";
import { NumericFormat } from "react-number-format";
import { AppContext } from "./AppContext";
import PropTypes from "prop-types";

function ModifyOfferWindow({ offerId, onClose }) {
  // Add prop validation
  ModifyOfferWindow.propTypes = {
    offerId: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
  };
  const [file, setFile] = useState(null);
  const [oldFileName, setOldFileName] = useState("");
  const [message, setMessage] = useState("");
  const [selectedServiceType, setSelectedServiceType] = useState(null);
  const [mf, setMf] = useState("");
  const [otf, setOtf] = useState("");
  const [term, setTerm] = useState("");
  const [offerParams, setOfferParams] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedValidity, setSelectedValidity] = useState("");
  const [resParams, setResParams] = useState([]);
  const [selectedAm, setSelectedAm] = useState(null);
  const [selectedUgyfel, setSelectedUgyfel] = useState(null);
  const [selectedTipus, setSelectedTipus] = useState(null);
  const [fileChanged, setFileChanged] = useState(false);
  const [dateChanged, setDateChanged] = useState(false);
  const [validityChanged, setValidityChanged] = useState(false);
  const [tipusChanged, setTipusChanged] = useState(false);
  const [paramsChanged, setParamsChanged] = useState(false);
  const [amChanged, setAmChanged] = useState(false);
  const [ugyfelChanged, setUgyfelChanged] = useState(false);
  const { ams, ugyfelek, serviceTypes, successSave, setSuccessSave } =
    useContext(AppContext);

  useEffect(() => {
    const fetchOfferData = async () => {
      const data = { id: offerId };

      try {
        const response = await axios.post(
          "http://localhost:3001/api/getofferdata",
          data,
          { headers: { "Content-Type": "application/json" } }
        );
        const resData = response.data.map((params) => ({
          tipus: params.tipus,
          fajlNev: params.afajl_nev.substring(20),
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
          tipusId: params.tipus_id,
        }));

        setResParams(resData);
        setOldFileName(response.data[0].afajl_nev);

        const offerData = response.data.map((params) => ({
          szTipus: params.tipus_nev,
          tipusId: params.tipus_id,
          haviDij: params.havidij,
          egyszeriDij: params.egyszeridij,
          futamIdo: params.futamido,
        }));

        setOfferParams(offerData);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOfferData();

    setAmChanged(false);
    setUgyfelChanged(false);
    setFileChanged(false);
    setTipusChanged(false);
    setDateChanged(false);
    setValidityChanged(false);
    setParamsChanged(false);
    setSuccessSave(false);
  }, [offerId, successSave]);

  useEffect(() => {
    if (message === "Az ajánlat sikeresen törölve lett.") {
      setTimeout(() => {
        onClose(); // Az üzenet megjelenése után 5 másodperccel zárja be az ablakot
      }, 5000);
    }
  }, [message]);
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(""); // Az üzenet eltávolítása 3 másodperc után
      }, 3000);

      return () => clearTimeout(timer); // Törli a timer-t, ha a komponens unmountol
    }
  }, [message]);

  const formattedAms = ams.map((am) => ({
    value: am.am_id,
    label: am.nev,
  }));

  useEffect(() => {
    if (formattedAms.length > 0 && resParams.length > 0) {
      const selected = formattedAms.find(
        (am) => am.value === resParams[0].amId
      );
      setSelectedAm(selected);
    }
  }, [resParams]);

  const formattedUgyfelek = ugyfelek.map((cust) => ({
    value: cust.ugyfel_id,
    label: cust.cegnev,
  }));

  useEffect(() => {
    if (formattedUgyfelek.length > 0 && resParams.length > 0) {
      const selected = formattedUgyfelek.find(
        (ugyfel) => ugyfel.value === resParams[0].ugyfelId
      );
      setSelectedUgyfel(selected);
    }
  }, [resParams]);

  useEffect(() => {
    if (resParams.length > 0) {
      const fileSetter = { name: resParams[0].fajlNev };
      setFile(fileSetter);
    }
  }, [resParams]);

  const tipus = [
    { value: "firm", label: "firm" },
    { value: "budget", label: "bud" },
  ];
  useEffect(() => {
    if (resParams.length > 0) {
      const selected = tipus.find(
        (tipus) => tipus.value === resParams[0].tipus
      );
      setSelectedTipus(selected);
    }
  }, [resParams]);

  useEffect(() => {
    if (resParams.length > 0) {
      setSelectedDate(resParams[0].datum);
    }
  }, [resParams]);

  useEffect(() => {
    if (resParams.length > 0) {
      setSelectedValidity(resParams[0].valid);
    }
  }, [resParams]);

  const serviceOptions = serviceTypes.map((type) => ({
    value: type.tipus_id,
    label: type.tipus_nev,
  }));

  const handleDeleteOffer = async () => {
    const confirmDelete = window.confirm(
      "Biztosan törölni szeretné az ajánlatot?"
    );

    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:3001/api/deleteoffer/${offerId}`);
        setMessage("Az ajánlat sikeresen törölve lett.");
      } catch (error) {
        console.error("Hiba történt a törlés során:", error);
        setMessage("Hiba történt a törlés során.");
      }
    } else {
      setMessage("A törlés megszakítva.");
    }
  };
  const handleOfferChange = async () => {
    try {
      const data = {
        file: fileChanged ? file : null,
        oldFileName: oldFileName,
        offerId: offerId,
        am: amChanged ? selectedAm.value : null,
        ugyfel: ugyfelChanged ? selectedUgyfel.value : null,
        tipus: tipusChanged ? selectedTipus : null,
        date: dateChanged ? selectedDate : null,
        validity: validityChanged ? selectedValidity : null,
        params: paramsChanged ? JSON.stringify(offerParams) : null,
      };

      await axios.post(
        "http://localhost:3001/api/offerchange",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setMessage("Az ajánlat sikeresen módosítva lett.");
      setSuccessSave(true);
    } catch (err) {
      console.error(err);
      setMessage("Hiba történt a módosítás során.");
    }
  };

  const onWindowClose = () => {
    onClose();
  };

  const handleAmChange = (selectedOption) => {
    setSelectedAm(selectedOption);
    setAmChanged(true);
  };

  const handleUgyfelChange = (selectedOption) => {
    setSelectedUgyfel(selectedOption);
    setUgyfelChanged(true);
  };

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
    setFileChanged(true);
  };

  const handleTypeChange = (selectedOption) => {
    setSelectedTipus(selectedOption);
    setTipusChanged(true);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setDateChanged(true);
  };
  const handleValidityChange = (e) => {
    setSelectedValidity(e.target.value);
    setValidityChanged(true);
  };

  const adSor = () => {
    const ujParam = {
      szTipus: selectedServiceType.label,
      tipusId: selectedServiceType.value,
      haviDij: mf,
      egyszeriDij: otf,
      futamIdo: term,
    };
    setOfferParams([...offerParams, ujParam]);
    setParamsChanged(true);
  };

  const kiSor = (e) => {
    offerParams.splice(e.target.id, 1);
    setOfferParams([...offerParams]);
    setParamsChanged(true);
  };

  const handleServiceTypeChange = (selectedOption) => {
    setSelectedServiceType(selectedOption);
  };

  const handleMfChange = (values) => {
    setMf(values.floatValue);
  };

  const handleOtfChange = (values) => {
    setOtf(values.floatValue);
  };

  const handleTermChange = (values) => {
    setTerm(values.floatValue);
  };

  return (
    // Itt kezdődik a megjelenítés, a reuturn adja vissza a felületet
    <div
      className="panel right-section"
      style={{
        display: "flex",
        flexDirection: "column",
        width: "90%",
        justifyContent: "flex-start",
      }}
    >
      <div style={{ display: "flex" }}>
        <h2 className="h2" style={{ marginLeft: "40px" }}>
          Módosítás{" "}
        </h2>

        {message && (
          <div
            className="message"
            style={{
              marginBottom: "20px",
              marginTop: "17px",
              marginLeft: "40px",
              color: message.includes("sikeresen") ? "green" : "red",
            }}
          >
            {message}
          </div>
        )}
      </div>
      <div
        style={{
          display: "flex",
          width: "90%",
          marginLeft: "40px",
          marginTop: "10px",
          marginBottom: "20px",
        }}
      >
        <button className="button" id="nodeb1" onClick={handleDeleteOffer}>
          Ajánlat törlése
        </button>
        <button
          className="button"
          id="nodeb1"
          onClick={handleOfferChange}
          disabled={
            (!fileChanged &&
              !dateChanged &&
              !validityChanged &&
              !tipusChanged &&
              !paramsChanged &&
              !amChanged &&
              !ugyfelChanged) ||
            !selectedAm ||
            !selectedUgyfel ||
            !file ||
            !selectedTipus ||
            !selectedDate ||
            !selectedValidity ||
            !offerParams.length
          }
        >
          Mentés
        </button>
        <button className="button" id="nodeb1" onClick={onWindowClose}>
          Bezárás
        </button>
      </div>

      <div className="stat-field">
        <div className="common-data-full">
          <div className="common-data">
            <div style={{ width: "165px", paddingLeft: "60px" }}>AM</div>
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
                onChange={handleAmChange}
                options={formattedAms}
                placeholder="Válassz AM-et!"
                isClearable
                styles={{
                  ...customStyles,
                  container: (provided) => ({
                    ...provided,
                    width: "180px",
                  }),
                }}
              />
            </div>
            <div>
              <Select
                value={selectedUgyfel}
                onChange={handleUgyfelChange}
                options={formattedUgyfelek}
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
            <div>
              <input
                id="fileInput"
                type="file"
                style={{ display: "none" }}
                onChange={onFileChange}
              />
              <button
                type="button"
                onClick={() => document.getElementById("fileInput").click()}
                style={{ marginBottom: "5px" }}
              >
                Válassz fájlt
              </button>
            </div>
            <div>
              <Select
                value={selectedTipus}
                onChange={handleTypeChange}
                placeholder="Firm/Budget"
                options={tipus}
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
                value={selectedDate}
                onChange={handleDateChange}
                id="kiadvadate"
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
                value={selectedValidity}
                onChange={handleValidityChange}
              />
            </div>
          </div>
          <span
            id="fileName"
            style={{
              fontWeight: "bold",
              fontSize: "16px",
              display: "inline-block",
              maxWidth: "200px", // Maximális szélesség, amelyen belül a szöveg elfér
              whiteSpace: "nowrap", // Megakadályozza a szöveg törését
              marginLeft: "240px",
            }}
          >
            Választott fájl:
            <span
              style={{
                fontFamily: `"Courier New", Courier, monospace`,
                marginLeft: "15px",
                backgroundColor: "#f0f0f0",
              }}
            >
              {file && typeof file.name === "string"
                ? file.name
                : "Nincs fájl kiválasztva"}
            </span>
          </span>
        </div>

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
              width: "100%",
              marginLeft: "40px",
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
            <div>
              <Select
                value={selectedServiceType}
                onChange={handleServiceTypeChange}
                options={serviceOptions}
                placeholder="Szolgáltatás"
                styles={{
                  ...customStyles,
                  container: (provided) => ({
                    ...provided,
                    width: "150px",
                  }),
                }}
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
                    onClick={kiSor}
                  >
                    -
                  </button>
                </div>
                <div className="item-field szolgtipus3">{param.szTipus}</div>
                <div className="item-field havidij3">
                  {(param.haviDij || "")
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
                </div>
                <div className="item-field egyszeridij3">
                  {(param.egyszeriDij || "")
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
                </div>
                <div className="item-field futamido3">
                  {(param.futamIdo || "")
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModifyOfferWindow;
