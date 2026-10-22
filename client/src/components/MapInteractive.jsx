import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
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

const MapInteractive = ({ onDirectMapSelect }) => {
  const position = [-37.8331, 144.9722]; // Anzac station, Melbourne, Australia

  const [mapClickPosition, setMapClickPosition] = useState(null);

  const handleAddMarker = (lat, lng) => {
    setMapClickPosition([lat, lng]);
    onDirectMapSelect({ lat, lng });
  };

  return (
    <MapContainer center={position} zoom={13} scrollWheelZoom={false} className={styles.map}>
      <TileLayer
        attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapClickHandler onMapClick={handleAddMarker} />
      {mapClickPosition && <Marker position={mapClickPosition} />}
    </MapContainer>
  );
};

export default MapInteractive;
