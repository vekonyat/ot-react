import "./App.css";
import React from "react";
import TopSection from "./TopSection";
import LeftSection from "./LeftSection";
import RightSection from "./RightSection";
import BottomSection from "./BottomSection";
import BottomSection2 from "./BottomSection2";
import LeftRightTop from "./LeftRightTop";
import LeftRightBottom from "./LeftRightBottom";

function LeftRight() {
  return (
    <div className="left-right">
      <LeftRightTop />
      <LeftRightBottom />
    </div>
  );
}

export default LeftRight;
