import React from "react";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "./AppContext";

function BottomRight() {
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");
  const [statParams, setStatParams] = useState([]);
  const { selectedAm, selectedUgyfel, selectedFile } = useContext(AppContext);

  const handleMutasdButtonClick = async () => {
    console.log("selectedFile", selectedFile);
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
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const resParams = response.data.map((params) => ({
        fajlNev: params.afajl_nev,
        ajanlatId: params.ajanlat_id,
        datum: params.datum.split("T")[0],
        amNev: params.nev,
        ugyfelNev: params.cegnev,
        szTipus: params.tipus_nev,
        haviDij: params.havidij,
        egyszeriDij: params.egyszeridij,
      }));
      setStatParams(resParams);
     // console.log(resParams);
    } catch (err) {
       console.error(err);
    }

    

  };

  const handleStartDateChange = (e) => {
    setSelectedStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setSelectedEndDate(e.target.value);
  };

const leTolt = async (e) => {
  const fileName = statParams[e.target.id].fajlNev;
      try {
      const response = await axios.post(
        "http://localhost:3001/api/statdownload",
        {
          filePath: "uploads/" + fileName,
        },
        {
          responseType: "blob", // A válasz típusának beállítása blob-ra
        }
      );

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(new Blob([response.data]));
      link.setAttribute("download", fileName); // Beállítjuk a letöltendő fájl nevét
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("There was an error downloading the file!", error);
    }
  
};

  return (
    <div className="panel bottom-right">
      <div className="left-left-top">
        <div style={{ display: "flex", width: "100%" }}>
          <div style={{ minWidth: "250px" }}>
            <h2 className="h2">Statisztikai modul</h2>
            <div>
              <button
                className="button"
                id="nodeb1"
                onClick={handleMutasdButtonClick}
              >
                Mutasd
              </button>
              <p>
                <label
                  title="A vizsgált időszak kezdete"
                  htmlFor="startdate"
                  style={{ padding: "5px" }}
                >
                  Kezdő dátum:
                </label>
                <input
                  type="date"
                  value={selectedStartDate}
                  id="startdate"
                  onChange={handleStartDateChange}
                />
              </p>
              <p>
                <label
                  title="A vizsgált időszak vége"
                  htmlFor="enddate"
                  style={{ padding: "5px" }}
                >
                  Záró dátum:
                </label>
                <input
                  type="date"
                  value={selectedEndDate}
                  id="enddate"
                  onChange={handleEndDateChange}
                />
              </p>
            </div>
          </div>
          <div>
            <div
              style={{
                display: "flex",
                // alignItems: "center",
                width: "100%",
                marginLeft: "2%",
                marginTop: "2%",
              }}
            >
              <div style={{ width: "100px" }}>Fájlnév</div>
              <div style={{ width: "70px" }}>Dátum</div>
              <div style={{ width: "115px" }}>Account Man.</div>
              <div style={{ width: "80px" }}>Ügyfél</div>
              <div style={{ width: "80px" }}>Szolg tipus</div>
              <div style={{ width: "70px" }}>Havidíj</div>
              <div style={{ width: "80px" }}>Egyszeridíj</div>
              <div style={{ width: "50px" }}>Letölt</div>
            </div>
            <div className="scrollable2-container">
              {statParams.map((param, index) => (
                <div key={index} className="list2-item">
                  <div
                    style={{
                      width: "100px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={param.fajlNev}
                  >
                    {param.fajlNev.substring(20)}
                  </div>
                  <div
                    style={{
                      width: "85px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={param.datum}
                  >
                    {param.datum}
                  </div>
                  <div
                    style={{
                      width: "105px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={param.amNev}
                  >
                    {param.amNev}
                  </div>
                  <div
                    style={{
                      width: "90px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={param.ugyfelNev}
                  >
                    {param.ugyfelNev}
                  </div>
                  <div
                    style={{
                      width: "80px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={param.szTipus}
                  >
                    {param.szTipus}
                  </div>
                  <div
                    style={{
                      width: "80px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={param.haviDij}
                  >
                    {Number(param.haviDij).toLocaleString("hu-HU")}
                  </div>
                  <div
                    style={{
                      width: "70px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={param.egyszeriDij}
                  >
                    {Number(param.egyszeriDij).toLocaleString("hu-HU")}
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
                       onClick={leTolt}
                    >
                      Đ                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BottomRight;
