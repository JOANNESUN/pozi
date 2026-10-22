import { useEffect, useState } from "react";
import "./App.css";
import MapInteractive from "./components/MapInteractive.jsx";
import FeedbackForm from "./components/FeedbackForm.jsx";
import { fetchFeedback } from "./api/feedbackApi.js";

const App = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [features, setFeatures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

useEffect(() => {
  fetchFeedback()
    .then((collection) => setFeatures(collection.features))
    .catch((error) => setLoadError(error.message))
    .finally(() => setIsLoading(false));
}, []);


  return (
    <div className="layout">
      <div className="map-area">
        <MapInteractive location={selectedLocation} onLocationSelect={setSelectedLocation} />
      </div>
      <div className="panel">
        <FeedbackForm location={selectedLocation} />
         {/* place holder to see visual feedback */}
        <p role="status">
          {isLoading && "Loading feedback…"}
          {loadError && `Couldn't load feedback: ${loadError}`}
          {!isLoading && !loadError && `${features.length} reports`}
        </p>
      </div>
    </div>
  );
};

export default App;
