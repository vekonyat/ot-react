import React from "react";
import { useState, useEffect } from "react";
import BottomLeft from "./BottomLeft";
import BottomRight from "./BottomRight";

function BottomSection({onModifyOffer, onSuccess}) {
  // useEffect(() => {
  //   if (onSuccess) {
  //     onSuccess();
  //   }
  // }, [onSuccess]);
  return (
    <div className="bottom-section">
      <BottomLeft />

      <BottomRight onModifyOffer={onModifyOffer} onSuccess={onSuccess} />
    </div>
  );
}

export default BottomSection;
