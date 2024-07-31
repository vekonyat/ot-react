import React from "react";
import { useState } from "react";

function BottomRight() {
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");

  const handleButtonClick = () => {
    // Call your Node.js script here
    const filename1 = name1;
    const filename2 = name2;
    const body = {
      filename1,
      filename2,
    };
    fetch("http://localhost:3001/api/myEndpoint", {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // Handle the response from the Node.js server here
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
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
        <h2 className="h2">Statisztikai modul</h2>
        <div>
          <button className="button" id="nodeb1" onClick={handleButtonClick}>
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
              htmlFor="startdate"
              style={{ padding: "5px" }}
            >
              Záró dátum:
            </label>
            <input
              type="date"
              value={selectedEndDate}
              id="startdate"
              onChange={handleEndDateChange}
            />
          </p>
        </div>
      </div>
    </div>
  );
}

export default BottomRight;
