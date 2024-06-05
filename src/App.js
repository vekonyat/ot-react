import './App.css';
import React from 'react';
import TopSection from "./TopSection";
import LeftSection from "./LeftSection";
import RightSection from "./RightSection";
import BottomSection from "./BottomSection";
import BottomSection2 from "./BottomSection2";

function App() {

  return (
    <div className="App">
      <TopSection />
      <hr />
      <div className="middle-section">
        <LeftSection />
        <RightSection />
      </div>
      <div>
        <BottomSection />
      </div>
      <hr />
      <div>
        <BottomSection2 />
      </div>
    </div>
  );
}

export default App;
