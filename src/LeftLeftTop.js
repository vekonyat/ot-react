import React, { useContext } from "react";
import { AppContext } from "./AppContext";

function LeftLeftTop() {
  const { selectedRadio, setSelectedRadio } = useContext(AppContext);

  const onOptionChange = (e) => {
    setSelectedRadio(e.target.value);
  };

  return (
    <div className="left-left-top">
      <h2 className="h2">{"\t"}Dokumentum típus</h2>
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
      <p>
        <input
          type="radio"
          name="topping"
          value="tech"
          id="muszakileiras"
          checked={selectedRadio === "tech"}
          onChange={onOptionChange}
        />
        <label
          title="Csak a műszaki leírást tartalmazza"
          htmlFor="muszakileiras"
        >
          Műszaki leírás
        </label>
      </p>
    </div>
  );
}

export default LeftLeftTop;
