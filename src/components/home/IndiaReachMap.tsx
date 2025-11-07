import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

// Coordinates for the cities
const cities = [
  { name: "Delhi", since: "2019", lat: 28.6448, lng: 77.2167 },
  { name: "Mumbai", since: "2020", lat: 19.075983, lng: 72.877655 },
  { name: "Bangalore", since: "2020", lat: 12.971599, lng: 77.594566 },
  { name: "Jaipur", since: "2021", lat: 26.912434, lng: 75.78727 },
];

export const IndiaReachMap: React.FC = () => {
  return (
    <section id="india-reach" className="py-20 bg-warm-beige">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">
          Connecting Every Corner of India
        </h2>
        <p className="text-xl text-text-secondary text-center mb-6">
          Active in 120+ cities across metro, tier-2, and tier-3 regions
        </p>

        <div className="relative max-w-4xl mx-auto">
          {/* ✅ Note: center uses tuple [lat, lng], zoom is number */}
          <MapContainer
            center={[22.0, 79.0]}
            zoom={5}
            scrollWheelZoom={true}
            className="rounded-lg shadow-md"
            style={{ width: "100%", height: "520px" }}
          >
            {/* ✅ TileLayer props in v4 use 'url' and 'attribution' */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {cities.map((city) => (
              <Marker key={city.name} position={[city.lat, city.lng]}>
                {/* ✅ Tooltip in v4 supports direction & offset as props */}
                <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                  <span className="font-semibold">{city.name}</span>
                </Tooltip>
                <Popup>
                  <div>
                    <h4 className="font-semibold mb-1">{city.name}</h4>
                    <p className="text-sm text-gray-600">
                      Active since {city.since}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg text-text-secondary">
            And we're expanding to more cities every month!
          </p>
        </div>
      </div>
    </section>
  );
};
