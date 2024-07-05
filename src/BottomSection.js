import React from "react";
import { useState } from "react";
import BottomLeft from "./BottomLeft";
import BottomRight from "./BottomRight";

function BottomSection() {
  return (
    <div className="bottom-section">
      <BottomLeft />

      <BottomRight />
    </div>
  );
}

export default BottomSection;
