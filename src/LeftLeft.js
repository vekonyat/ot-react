import "./App.css";
import React from "react";
import TopSection from "./TopSection";
import LeftSection from "./LeftSection";
import RightSection from "./RightSection";
import BottomSection from "./BottomSection";
import BottomSection2 from "./BottomSection";
import LeftLeftTop from "./LeftLeftTop";
import LeftLeftBottom from "./LeftLeftBottom";

function LeftLeft() {
  return (
    <div className="left-left">
      <LeftLeftTop />
      <hr />
      <LeftLeftBottom />
    </div>
  );
}

export default LeftLeft;
