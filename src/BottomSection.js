import React from "react";
import BottomLeft from "./BottomLeft";
import BottomRight from "./BottomRight";
import PropTypes from "prop-types"; 

function BottomSection({onModifyOffer, onSuccess}) {
  return (
    <div className="bottom-section">
      <BottomLeft />

      <BottomRight onModifyOffer={onModifyOffer} onSuccess={onSuccess} />
    </div>
  );
}

BottomSection.propTypes = {
  onModifyOffer: PropTypes.func.isRequired, // kötelező függvény típusú prop
  onSuccess: PropTypes.func, // opcionális függvény típusú prop
};

export default BottomSection;
