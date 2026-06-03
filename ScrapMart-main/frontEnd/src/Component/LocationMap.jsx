import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function LocationMarker({ onLocationChange }) {
  const [position, setPosition] = useState(null);
  const map = useMap();

  useEffect(() => {
    const geoOptions = {
      enableHighAccuracy: true,  // ✅ GPS if available
      // timeout: 10000,            // ⏱️ 10s max wait
      maximumAge: 0              // 🚫 No cached location
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        // console.log("Accurate Coords:", coords);
        // console.log("Accuracy (meters):", pos.coords.accuracy);

        setPosition(coords);
        map.flyTo(coords, 16); // zoom to street level
        onLocationChange?.(coords);
      },
      (err) => {
        console.error("Geolocation error:", err.message);
      },
      geoOptions
    );
  }, [map, onLocationChange]);

  return position === null ? null : (
    <Marker position={position}>
      <Popup>You are here (±{position.accuracy}m)</Popup>
    </Marker>
  );
}

const UserLocationMap = ({ onLocationChange }) => {
  return (
    <MapContainer
      center={{ lat: 19.076, lng: 72.8777 }} // fallback to Mumbai
      zoom={13}
      scrollWheelZoom={false}
      className="h-[250px] sm:h-[300px] w-[90%] sm:w-[90%] mx-auto mt-6 rounded-lg shadow-lg z-10"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker onLocationChange={onLocationChange} />
    </MapContainer>
  );
};

export default UserLocationMap;
