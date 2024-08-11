import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import "./App.css";
import customStyles from "./customStyles"; // Importálás

function ModifyOfferWindow(offerId) {
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
  const [selectedAm, setSelectedAm] = useState(null);
  const [selectedUgyfel, setSelecteUgyfel] = useState(null);
  const [resParams, setResParams] = useState([]);
  const [ams, setAms] = useState([]);

  useEffect(() => {
    const fetchAms = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/getams");

        const formattedAms = response.data.map((am) => ({
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
          szTipus: params.tipus_nev,
          haviDij: params.havidij,
          egyszeriDij: params.egyszeridij,
        }));

        setResParams(resParams);
        console.log(resParams);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOfferData();
  }, [offerId]);

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
    <div className="panel " style={{ display: "flex", width: "100%" }}>
      <div>
        <div className="left-left-bottom">
          <Select
            value={selectedAm}
            onChange={setSelectedAm}
            options={ams}
            placeholder="Válassz AM-et!"
            isClearable
            styles={customStyles} // Apply custom styles
          />
        </div>
      </div>
      <StatsTable
        resParams={resParams}
        ams={ams}
        customStyles={customStyles}
        selectedAm={selectedAm}
        setSelectedAm={setSelectedAm}
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
}) => (
  <div>
    <CommonData
      ams={ams}
      customStyles={customStyles}
      selectedAm={selectedAm}
      setSelectedAm={setSelectedAm}
    />
    <TableHeader />
    <div className="scrollable2-container">
      {resParams.map((param, index) => (
        <Row key={index} param={param} index={index} />
      ))}
    </div>
  </div>
);

const CommonData = ({ ams, customStyles, selectedAm, setSelectedAm }) => (
  <div>
    <div style={{ display: "flex" }}>
      <div style={{ width: "115px" }}>AM</div>
      <div style={{ width: "80px" }}>Ügyfél</div>
      <div style={{ width: "100px" }}>Fájlnév</div>
      <div style={{ width: "80px" }}>Firm/Budg.</div>
      <div style={{ width: "60px" }}>Dátum</div>
      <div style={{ width: "40px" }}>Valid</div>
    </div>
    <div>
      <div className="left-left-bottom">
        <Select
          value={selectedAm}
          onChange={setSelectedAm}
          options={ams}
          placeholder="Válassz AM-et!"
          isClearable
          styles={customStyles} // Apply custom styles
        />
      </div>
    </div>
  </div>
);
const TableHeader = () => (
  <div
    style={{
      display: "flex",
      width: "100%",
      marginLeft: "2%",
      marginTop: "2%",
    }}
  >
    <div style={{ width: "80px" }}>Szolg tipus</div>
    <div style={{ width: "70px" }}>Havidíj</div>
    <div style={{ width: "80px" }}>Egyszeridíj</div>
    <div style={{ width: "40px" }}>Töröl</div>
    <div style={{ width: "40px" }}>Módosít</div>
  </div>
);

const Row = ({ param, index }) => (
  <div
    key={index}
    className="list2-item"
    style={{
      display: "flex",
      width: "100%",
      marginLeft: "2%",
      marginTop: "2%",
    }}
  >
    <div
      className="stat-field"
      style={{
        width: "100px",
      }}
      title={param.fajlNev}
    >
      {param.fajlNev.substring(20)}
    </div>
    <div
      className="stat-field"
      style={{
        width: "90px",
      }}
      title={param.datum}
    >
      {param.datum}
    </div>
    <div
      className="stat-field"
      style={{
        width: "30px",
      }}
      title={param.valid}
    >
      {param.valid}
    </div>
    <div
      className="stat-field"
      style={{
        width: "105px",
      }}
      title={param.amNev}
    >
      {param.amNev}
    </div>
    <div
      className="stat-field"
      style={{
        width: "90px",
      }}
      title={param.ugyfelNev}
    >
      {param.ugyfelNev}
    </div>
    <div
      className="stat-field"
      style={{
        width: "80px",
      }}
      title={param.szTipus}
    >
      {param.szTipus}
    </div>
    <div
      className="stat-field"
      style={{
        width: "80px",
      }}
      title={param.haviDij}
    >
      {Number(param.haviDij).toLocaleString("hu-HU")}
    </div>
    <div
      className="stat-field"
      style={{
        width: "70px",
      }}
      title={param.egyszeriDij}
    >
      {Number(param.egyszeriDij).toLocaleString("hu-HU")}
    </div>
    <div style={{ width: "45px" }}>
      <button
        className="button"
        style={{
          marginRight: "0px",
          height: "15px",
          lineHeight: "1px",
          fontSize: "14px",
        }}
        id={index}
        // onClick={leTolt}
      >
        Đ{" "}
      </button>
    </div>
    <div style={{ width: "40px" }}>
      <button
        className="button"
        style={{
          marginRight: "0px",
          height: "15px",
          lineHeight: "1px",
          fontSize: "14px",
        }}
        id={index}
        // onClick={modosit}
      >
        M{" "}
      </button>
    </div>
  </div>
);



export default ModifyOfferWindow;
