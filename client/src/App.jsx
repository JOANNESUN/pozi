import { useEffect, useState } from "react";
import "./App.css";
import MapInteractive from "./components/MapInteractive.jsx";
import FeedbackForm from "./components/FeedbackForm.jsx";
import { fetchFeedback } from "./api/feedbackApi.js";

const App = () => {
  const [notice, setNotice] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [features, setFeatures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setNotice(null);
  };

  const handleFeedbackAdded = (feature) => {
    setFeatures((current) => [feature, ...current]);
    setSelectedLocation(null);
    setNotice("Feedback added");
  };

  const handleCancel = () => setSelectedLocation(null);

  useEffect(() => {
    fetchFeedback()
      .then((collection) => setFeatures(collection.features))
      .catch((error) => setLoadError(error.message))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="layout">
      <div className="map-area">
        <MapInteractive
          location={selectedLocation}
          onLocationSelect={handleLocationSelect}
        />
      </div>
      <div className="panel">
        {selectedLocation ? (
          <FeedbackForm
            location={selectedLocation}
            onSubmitted={handleFeedbackAdded}
            onCancel={handleCancel}
          />
        ) : (
          <div>
            {/* Temporary: replaced by FeedbackHistory in step 5 */}
            <h2>Feedback history</h2>
            {notice && <p role="status">{notice}</p>}
            <p>
              {isLoading && "Loading feedback…"}
              {loadError && `Couldn't load feedback: ${loadError}`}
              {!isLoading &&
                !loadError &&
                `${features.length} feedback · click the map to add yours`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
