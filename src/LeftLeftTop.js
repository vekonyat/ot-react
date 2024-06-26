import React from "react";
import { useState } from "react";

function LeftLeftTop() {
  const [topping, setTopping] = useState("Firm ajánlat");
  const onOptionChange = (e) => {
    setTopping(e.target.value);
  };
   
  return (
    <div className="left-left-top">
      <h2>{"\t"}Dokumentum típus</h2>
      <p>
        {"\n"}
        <input
          type="radio"
          name="topping"
          value="Firm ajánlat"
          id="firmajanlat"
          checked={topping === "Firm ajánlat"}
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
        {"\n"}
        <input
          type="radio"
          name="topping"
          value="Tájékoztató ajánlat"
          id="tajakoztatoajanlat"
          checked={topping === "Tájékoztató ajánlat"}
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
        {"\n"}

        <input
          type="radio"
          name="topping"
          value="Műszaki leírás"
          id="muszakileiras"
          checked={topping === "Műszaki leírás"}
          onChange={onOptionChange}
        />
        <label
          title="Csak a műszaki leírást tartalmazza"
          htmlFor="muszakileiras"
        >
          Műszaki leírás
        </label>
      </p>
      {/* <p>
        {"\n"}

        <input
          type="radio"
          name="topping"
          value="Ártábla"
          id="artabla"
          checked={topping === "Ártábla"}
          onChange={onOptionChange}
        />
        <label title="Csak az ártáblát tartalmazza" htmlFor="artabla">
          Ártábla
        </label>
      </p> */}

      <p>{"\n"}</p>
    </div>
  );
}

export default LeftLeftTop;
