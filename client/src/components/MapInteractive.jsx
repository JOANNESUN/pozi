import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; 
import styles from './MapInteractive.module.css';


const QuickMap = () => {
  const position = [-37.8331, 144.9722]; // Anzac station, Melbourne, Australia

  return (
    <MapContainer center={position} zoom={13} scrollWheelZoom={false} className={styles.map}>
      <TileLayer
        attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
           Anzac station <br /> Pozi 🐥
        </Popup>
      </Marker>
    </MapContainer>
);
}

export default QuickMap;