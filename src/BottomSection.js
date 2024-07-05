import React from "react";
import { useState } from "react";

function BottomSection() {
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");

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

  return (
    <div className="panel bottom-section">
      <h2 className="h2">
        Statisztikai modul
      </h2>
      <div>
        <button className="button" id="nodeb1" onClick={handleButtonClick}>
          Ajánlat feltöltése
        </button>
        <input
          id="iname1"
          type="text"
          placeholder="Fájlnév1"
          onChange={(event) => setName1(event.target.value)}
        />
        <p>
         </p>
      </div>
    </div>
  );
}

export default BottomSection;
