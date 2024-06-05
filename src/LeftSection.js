import React from "react";
import { useState } from "react";
import LeftLeft from "./LeftLeft";
import LeftRight from "./LeftRight";

function LeftSection() {
    return (
      
        <div className="left-section">
          <LeftLeft />
      
          <LeftRight />
        </div>
     
    );
}

export default LeftSection;
