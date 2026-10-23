import { useEffect, useState } from "react";
import "./App.css";
import MapInteractive from "./components/MapInteractive.jsx";
import FeedbackForm from "./components/FeedbackForm.jsx";
import FeedbackHistory from "./components/FeedbackHistory.jsx";
import { fetchFeedback, importFeedback } from "./api/feedbackApi.js";

const App = () => {
  const [notice, setNotice] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
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

  const filteredFeatures =
    categoryFilter === "all"
      ? features
      : features.filter(
          (feature) => feature.properties.category === categoryFilter,
        );

  const handleCancel = () => setSelectedLocation(null);

  const handleImportFile = async (file) => {
    try {
      const collection = JSON.parse(await file.text());
      const { imported, rejectedCount } = await importFeedback(collection);
      setFeatures((current) => [...imported, ...current]);
      setNotice(
        rejectedCount > 0
          ? `Imported ${imported.length} feedback, skipped ${rejectedCount} invalid`
          : `Imported ${imported.length} feedback`,
      );
    } catch (error) {
      setNotice(
        error instanceof SyntaxError
          ? "Import failed: the file isn't valid JSON"
          : `Import failed: ${error.message}`,
      );
    }
  };

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
          features={filteredFeatures}
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
          <FeedbackHistory
            features={filteredFeatures}
            totalCount={features.length}
            isLoading={isLoading}
            loadError={loadError}
            notice={notice}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={setCategoryFilter}
            onImportFile={handleImportFile}
          />
        )}
      </div>
    </div>
  );
};

export default App;
