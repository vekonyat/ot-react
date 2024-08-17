import "./App.css";
import React from "react";
import LeftRightTop from "./LeftRightTop";
import LeftRightBottom from "./LeftRightBottom";

function LeftRight() {
  return (
    <div className="left-right">
      <LeftRightTop />
      <hr />
      <LeftRightBottom />
    </div>
  );
}

export default LeftRight;
