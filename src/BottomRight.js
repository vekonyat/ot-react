import React, { useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "./AppContext";
import ReactDOM from "react-dom/client";
import ModifyOfferWindow from "./ModifyOfferWindow";

const BottomRight = () => {
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");
  const [statParams, setStatParams] = useState([]);
  const {
    selectedAm,
    selectedUgyfel,
    selectedFile,
    setSelectedAm,
    setSelectedUgyfel,
    setSelectedFile,
  } = useContext(AppContext);

  const handleMutasdButtonClick = async () => {
    const data = {
      am: selectedAm ? selectedAm.value : null,
      ugyfel: selectedUgyfel ? selectedUgyfel.value : null,
      tipus: selectedFile ? selectedFile.id : null,
      startDate: selectedStartDate,
      endDate: selectedEndDate,
    };
    try {
      const response = await axios.post(
        "http://localhost:3001/api/getstats",
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const resParams = response.data.map((params) => ({
        fajlNev: params.afajl_nev,
        ajanlatId: params.ajanlat_id,
        datum: params.datum.split("T")[0],
        valid: params.ervenyesseg,
        amNev: params.nev,
        ugyfelNev: params.cegnev,
        szTipus: params.tipus_nev,
        haviDij: params.havidij,
        egyszeriDij: params.egyszeridij,
      }));
      setStatParams(resParams);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartDateChange = (e) => setSelectedStartDate(e.target.value);
  const handleEndDateChange = (e) => setSelectedEndDate(e.target.value);

  const leTolt = async (e) => {
    const fileName = statParams[e.target.id].fajlNev;
    try {
      const response = await axios.post(
        "http://localhost:3001/api/statdownload",
        { filePath: "uploads/" + fileName },
        { responseType: "blob" }
      );

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(new Blob([response.data]));
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("There was an error downloading the file!", error);
    }
  };

  const modosit = (e) => {
    const param = statParams[e.target.id];
    const newWindow = window.open(
      "",
      "_blank",
      "width=1200,height=400,left=200,top=200"
    );

    newWindow.document.write(`
    <html>
      <head>
        <title>Modify Offer</title>
        <link rel="stylesheet" href="App.css">
        
      </head>
      <body>
        <div id="root" class="container"></div>
      </body>
    </html>
  `);
    newWindow.document.close(); // Close the document stream

    newWindow.document.title = "Adatok Módosítása";

    const root = ReactDOM.createRoot(newWindow.document.getElementById("root"));
    root.render(<ModifyOfferWindow offerId={param.ajanlatId} />);
  };


  const handleAlaphelyzetButtonClick = () => {
    setSelectedStartDate("");
    setSelectedEndDate("");
    setStatParams([]);
    setSelectedAm(null);
    setSelectedUgyfel(null);
    setSelectedFile(null);
  };

  return (
    <div className="panel bottom-right">
      <div className="left-left-top">
        <div style={{ display: "flex", width: "100%" }}>
          <Form
            selectedStartDate={selectedStartDate}
            selectedEndDate={selectedEndDate}
            handleMutasdButtonClick={handleMutasdButtonClick}
            handleAlaphelyzetButtonClick={handleAlaphelyzetButtonClick}
            handleStartDateChange={handleStartDateChange}
            handleEndDateChange={handleEndDateChange}
          />
          <StatsTable
            statParams={statParams}
            leTolt={leTolt}
            modosit={modosit}
          />
        </div>
      </div>
    </div>
  );
};

const Form = ({
  selectedStartDate,
  selectedEndDate,
  handleMutasdButtonClick,
  handleAlaphelyzetButtonClick,
  handleStartDateChange,
  handleEndDateChange,
}) => (
  <div style={{ minWidth: "220px" }}>
    <h2 className="h2">Letöltés, Statisztika</h2>
    <div>
      <FormButtons
        handleMutasdButtonClick={handleMutasdButtonClick}
        handleAlaphelyzetButtonClick={handleAlaphelyzetButtonClick}
      />
      <FormDateInput
        label="Kezdő dátum"
        value={selectedStartDate}
        id="startdate"
        onChange={handleStartDateChange}
      />
      <FormDateInput
        label="Záró dátum"
        value={selectedEndDate}
        id="enddate"
        onChange={handleEndDateChange}
      />
    </div>
  </div>
);

const FormButtons = ({
  handleMutasdButtonClick,
  handleAlaphelyzetButtonClick,
}) => (
  <>
    <button className="button" id="nodeb1" onClick={handleMutasdButtonClick}>
      Mutasd
    </button>
    <button
      className="button"
      id="nodeb1"
      onClick={handleAlaphelyzetButtonClick}
    >
      Alaphelyzet
    </button>
  </>
);

const FormDateInput = ({ label, value, id, onChange }) => (
  <p
    style={{
      margin: "9px",
      marginLeft: "0px",
    }}
  >
    <label
      title={label}
      htmlFor={id}
      style={{
        padding: "2px",
      }}
    >
      {label}
    </label>
    <br />
    <input type="date" value={value} id={id} onChange={onChange} />
  </p>
);

const StatsTable = ({ statParams, leTolt, modosit }) => (
  <div>
    <TableHeader />
    <div className="scrollable2-container">
      {statParams.map((param, index) => (
        <Row
          key={index}
          param={param}
          index={index}
          leTolt={leTolt}
          modosit={modosit}
        />
      ))}
    </div>
    <TableFooter statParams={statParams} />
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
    <div style={{ width: "100px" }}>Fájlnév</div>
    <div style={{ width: "60px" }}>Dátum</div>
    <div style={{ width: "40px" }}>Valid</div>
    <div style={{ width: "115px" }}>Account Man.</div>
    <div style={{ width: "80px" }}>Ügyfél</div>
    <div style={{ width: "80px" }}>Szolg tipus</div>
    <div style={{ width: "70px" }}>Havidíj</div>
    <div style={{ width: "80px" }}>Egyszeridíj</div>
    <div style={{ width: "40px" }}>Letölt</div>
    <div style={{ width: "40px" }}>Módosít</div>
  </div>
);

const Row = ({ param, index, leTolt, modosit }) => (
  <div key={index} className="list2-item">
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
        onClick={leTolt}
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
        onClick={modosit}
      >
        M{" "}
      </button>
    </div>
  </div>
);

const TableFooter = ({ statParams }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      width: "100%",
      marginLeft: "2%",
      marginTop: "15px",
    }}
  >
    <div style={{ width: "140px" }}>Ajánlatok száma: {statParams.length}</div>
    <div style={{ width: "180px" }}>
      Összes havidíj:{" "}
      {statParams
        .reduce((acc, curr) => acc + curr.haviDij, 0)
        .toLocaleString("hu-HU")}
    </div>
    <div style={{ width: "180px" }}>
      Összes egyszeri díj:{" "}
      {statParams
        .reduce((acc, curr) => acc + curr.egyszeriDij, 0)
        .toLocaleString("hu-HU")}
    </div>
  </div>
);

export default BottomRight;
