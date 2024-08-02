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
  const { selectedAm, selectedUgyfel } = useContext(AppContext);

  const handleMutasdButtonClick = async () => {
    
    const formData = new FormData();
    // formData.append("file", file);
    // formData.append("radio", selectedRadio);
    // formData.append("date", selectedDate);
    // formData.append("valid", selectedValidity);
    // formData.append("am", selectedAm.value);
    // formData.append("ugyfel", selectedUgyfel.value);
    // formData.append("params", JSON.stringify(offerParams));

    try {
      const response = await axios.post(
        "http://localhost:3001/api/getstats",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);

      const resParams = response.data.map((params) => ({
        fajlNev: params.afajl_nev,
        ajanlatId: params.ajanlat_id,
        datum: params.datum,
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

  const handleStartDateChange = (e) => {
    setSelectedStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setSelectedEndDate(e.target.value);
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
              <div style={{ width: "80px" }}>Fájlnév</div>
              <div style={{ width: "80px" }}>Dátum</div>
              <div style={{ width: "120px" }}>Account Manager</div>
              <div style={{ width: "70px" }}>Ügyfél</div>
              <div style={{ width: "80px" }}>Szolg tipus</div>
              <div style={{ width: "70px" }}>Havidíj</div>
              <div style={{ width: "80px" }}>Egyszeridíj</div>
              <div style={{ width: "80px" }}>Darabszám</div>
              <div style={{ width: "50px" }}>Letöltés</div>
            </div>
            <div className="scrollable-container">
              {statParams.map((param, index) => (
                <div key={index} className="list-item">
                  <div className="item-field szolgtipus">{param.fajlNev}</div>
                  <div className="item-field szolgtipus">{param.datum}</div>
                  <div className="item-field szolgtipus">{param.amNev}</div>
                  <div className="item-field szolgtipus">{param.ugyfelNev}</div>
                  <div className="item-field szolgtipus">{param.szTipus}</div>
                  <div className="item-field havidij">
                    {Number(param.haviDij).toLocaleString("hu-HU")}
                  </div>
                  <div className="item-field egyszeridij">
                    {Number(param.egyszeriDij).toLocaleString("hu-HU")}
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
