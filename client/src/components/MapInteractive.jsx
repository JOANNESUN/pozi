import {
  MapContainer,
  TileLayer,
  Marker,
  CircleMarker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { CATEGORIES, getCategory } from "../constants/categories.js";
import { formatDate } from "../utils/formatDate.js";
import styles from "./MapInteractive.module.css";

const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onMapClick(lat, lng);
    },
  });

  return null;
};

const FeedbackMarker = ({ feature }) => {
  const [lng, lat] = feature.geometry.coordinates;
  const { category: categoryValue, comment, created_at } = feature.properties;
  const category = getCategory(categoryValue);

  return (
    <CircleMarker
      center={[lat, lng]}
      radius={8}
      bubblingMouseEvents={false}
      pathOptions={{
        color: "#ffffff",
        weight: 2,
        fillColor: category.color,
        fillOpacity: 0.9,
      }}
    >
      <Popup>
        <strong>{category.label}</strong> · {formatDate(created_at)}
        <br />
        {comment}
      </Popup>
    </CircleMarker>
  );
};

const MapInteractive = ({ location, features, onLocationSelect }) => {
  const position = [-37.8331, 144.9722]; // Anzac station, Melbourne, Australia

  const handleAddMarker = (lat, lng) => {
    onLocationSelect({ lat, lng });
  };

  return (
    <div className={styles.wrapper}>
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={false}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClickHandler onMapClick={handleAddMarker} />
        {features.map((feature) => (
          <FeedbackMarker key={feature.properties.id} feature={feature} />
        ))}
        {location && <Marker position={location} />}
      </MapContainer>

      <ul className={styles.categoryKey} aria-label="Category colours">
        {CATEGORIES.map((category) => (
          <li key={category.value}>
            <span
              className={styles.swatch}
              style={{ background: category.color }}
              aria-hidden="true"
            />
            {category.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MapInteractive;
