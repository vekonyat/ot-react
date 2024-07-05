import React from "react";
import { useState } from "react";
import axios from "axios";

function BottomLeft() {
  
const [file, setFile] = useState(null);
const [message, setMessage] = useState("");

    const onFileChange = (e) => {
      setFile(e.target.files[0]);
    };

    const onFileUpload = async () => {
    if (!file) {
      setMessage('Please select a file first.');
      return;
    }

const formData = new FormData();
formData.append("file", file);

try {
  const res = await axios.post("http://localhost:3001/api/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  setMessage(res.data);
} catch (err) {
  console.error(err);
  setMessage("File upload failed.");
}
};

  return (
    <div className="panel bottom-left">
      <div className="left-left-top">
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

        <p>
          <input
            type="radio"
            name="topping"
            value="firm"
            id="firmajanlat"
            checked={selectedRadio === "firm"}
            onChange={onOptionChange}
          />
          <label
            title="Firm ajánlat készítése: bevezető, általános rész, műszaki, ártábla"
            htmlFor="firmajanlat"
          >
            Firm ajánlat
          </label>
        </p>

        <p>
          <input
            type="radio"
            name="topping"
            value="budget"
            id="tajakoztatoajanlat"
            checked={selectedRadio === "budget"}
            onChange={onOptionChange}
          />
          <label
            title="Tájékoztató ajánlat készítése: bevezető, általános rész, műszaki, ártábla"
            htmlFor="tajakoztatoajanlat"
          >
            Tájékoztató ajánlat
          </label>
        </p>
      </div>
    </div>
  );
}

export default BottomLeft;
