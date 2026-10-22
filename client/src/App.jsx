import { useState } from "react";
import "./App.css";
import MapInteractive from "./components/MapInteractive.jsx";
import FeedbackForm from "./components/FeedbackForm.jsx";

const App = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  return (
    <div className="layout">
      <div className="map-area">
        <MapInteractive location={selectedLocation} onLocationSelect={setSelectedLocation} />
      </div>
      <div className="panel">
        <FeedbackForm location={selectedLocation} />
      </div>
    </div>
  );
};

export default App;
