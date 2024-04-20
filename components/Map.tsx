// components/Map.tsx

import React, { useState } from "react";
import GoogleMapReact from "google-map-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import dotenv from "dotenv";

type MarkerProps = {
  lat: number;
  lng: number;
  raceName: string;
};

type Props = {
  markers: MarkerProps[];
  defaultCenter: { lat: number; lng: number };
  defaultZoom: number;
};

dotenv.config();

const Map: React.FC<Props> = ({ markers, defaultCenter, defaultZoom }) => {
  const apiKey = process.env.GOOGLE_MAPS_API_AUTH;
  return (
    <div style={{ height: "700px", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: apiKey }}
        defaultCenter={defaultCenter}
        defaultZoom={defaultZoom}
      >
        {markers.map((marker, index) => (
          <CustomMarker key={index} {...marker} />
        ))}
      </GoogleMapReact>
    </div>
  );
};

const CustomMarker: React.FC<MarkerProps> = ({ lat, lng, raceName }) => {
  const [showInfo, setShowInfo] = useState<boolean>(false);

  const handleMarkerClick = () => {
    setShowInfo(!showInfo);
  };

  return (
    <div
      style={{
        position: "absolute",
        transform: "translate(-50%, -100%)",
        cursor: "pointer",
      }}
      onClick={handleMarkerClick}
      lat={lat}
      lng={lng}
    >
      <FontAwesomeIcon
        icon={faMapMarkerAlt}
        style={{ color: "red", fontSize: "32px" }}
      />
      {showInfo && (
        <div
          style={{
            position: "absolute",
            top: "-50px",
            left: "-50%",
            background: "white",
            padding: "5px",
            borderRadius: "5px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            color: "black",
          }}
        >
          {raceName}
        </div>
      )}
    </div>
  );
};

export default Map;
