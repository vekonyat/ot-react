import "./App.css";
import React from "react";
import TopSection from "./TopSection";
import LeftSection from "./LeftSection";
import RightSection from "./RightSection";
import BottomSection from "./BottomSection";
import { AppProvider } from "./AppContext";

function App() {
  return (
    <AppProvider>
      <div className="App">
        <TopSection />
        <hr />
        <div className="middle-section">
          <LeftSection />
          <RightSection />
        </div>
        <hr />
        <div>
          <BottomSection />
        </div>
      </div>
    </AppProvider>
  );
}

export default App;
