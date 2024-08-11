import React from "react";
import { useState } from "react";
import BottomLeft from "./BottomLeft";
import BottomRight from "./BottomRight";

function BottomSection({onModifyOffer}) {
  return (
    <div className="bottom-section">
      <BottomLeft />

      <BottomRight onModifyOffer={onModifyOffer} />
    </div>
  );
}

export default BottomSection;
