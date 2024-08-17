import "./App.css";
import React, { useState } from "react";
import TopSection from "./TopSection";
import LeftSection from "./LeftSection";
import RightSection from "./RightSection";
import BottomSection from "./BottomSection";
import ModifyOfferWindow from "./ModifyOfferWindow";
import { AppProvider } from "./AppContext";

function App() {
  const [showModifyOffer, setShowModifyOffer] = useState(false); // Állapot a ModifyOfferWindow megjelenítésére
  const [offerId, setOfferId] = useState(null); // Az aktuális ajánlat ID-je

  const handleShowModifyOffer = (id) => {
    setOfferId(id);
    setShowModifyOffer(true);
  };

  const handleHideModifyOffer = () => {
    setOfferId(null);
    setShowModifyOffer(false);
  };
const handleSuccess = () => {
       
  };
  return (
    <AppProvider>
      <div className="App">
        <TopSection />
        <hr />
        <div className="middle-section">
          <LeftSection />
          {showModifyOffer ? (
            <ModifyOfferWindow
              offerId={offerId}
              onClose={handleHideModifyOffer}
              onSuccess={handleSuccess}
            />
          ) : (
            <RightSection onModifyOffer={handleShowModifyOffer} />
          )}
        </div>
        <div>
          <BottomSection onModifyOffer={handleShowModifyOffer} onSuccess={handleSuccess}/>
        </div>
      </div>
    </AppProvider>
  );
}

export default App;
