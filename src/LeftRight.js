import React from "react";
import { useState } from "react";

function LeftRight() {
  const [topping, setTopping] = useState("Firm ajánlat");
  const onOptionChange = (e) => {
    setTopping(e.target.value);
  };
  const openInNewTab = (url) => {
    window.open(url, "_blank", "noopener, noreferrer");
  };

  const useDropdownSelect = () => {
    const [selectedValue, setSelectedValue] = useState("");
    const handleChange = (event) => {
      setSelectedValue(event.target.value);
    };
    const renderSelect = () => (
      <select value={selectedValue} onChange={handleChange}>
        <option value="valasszegyszolgaltatast">
          Válassz egy szolgáltatást!
        </option>
        <option value="mllinternet">MLL Internet</option>
        <option value="ipvpn">IP VPN</option>
        <option value="sdwan">SD-WAN</option>
        <option value="carrierethernet">Carrier Ethernet</option>
        <option value="wdm">WDM</option>
        <option value="sotetszal">Sötét szál</option>
      </select>
    );
    return { selectedValue, renderSelect };
  };
  const MyComponent = () => {
    const { selectedValue, renderSelect } = useDropdownSelect();
    return <div>{renderSelect()}</div>;
  };

  return (
    <div className="left-tr">
      
      <p>
        <h2>{"\t"}Szolgáltatás:</h2>
        <MyComponent />
      </p>
      <p>
        {"\n"}
        <button
          onClick={() =>
            openInNewTab(
              "https://docs.google.com/document/d/1mPRSPi4Am9qMzM1FKloxnTh94I8EvIRY/edit?usp=drive_link&ouid=103437204468830260691&rtpof=true&sd=true"
            )
          }
        >
          Megnyitás
        </button>
      </p>
    </div>
  );
}

export default LeftRight;
