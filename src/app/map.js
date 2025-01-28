"use client";
import React, { useState, useRef } from "react";
import "leaflet/dist/leaflet.css";
import { TileLayer, MapContainer } from "react-leaflet";
import StaticGeoJSONLayer from "@/components/StaticGeoJSONLayer";
import DynamicOverpassLayer from "@/components/DynamicOverpassLayer";

function MapContainerComponent() {
  const [activeLayer, setActiveLayer] = useState(null);
  const [staticLayerProps, setStaticLayerProps] = useState({ type: "", id: "" });
  const staticLayerRef = useRef(null);
  const dynamicLayerRef = useRef(null);

  const clearAllLayers = () => {
    if (staticLayerRef.current) staticLayerRef.current.clearLayer();
    if (dynamicLayerRef.current) dynamicLayerRef.current.clearLayer();
    setActiveLayer(null);
    console.log("All layers cleared.");
  };

  const activateStaticLayer = (type, id) => {
    clearAllLayers();
    setStaticLayerProps({ type, id });
    setActiveLayer("static");
    console.log(`Static GeoJSON layer activated with type: ${type}, id: ${id}`);
  };

  const activateDynamicLayer = () => {
    clearAllLayers();
    setActiveLayer("dynamic");
    console.log("Dynamic Overpass layer activated.");
  };

  // Expose public methods to the console
  if (typeof window !== "undefined") {
    window.clearAllLayers = clearAllLayers;
    window.activateStaticLayer = activateStaticLayer;
    window.activateDynamicLayer = activateDynamicLayer;
  }

  return (
    <MapContainer
      keyboardPanDelta={0}
      center={[23.888564332707915, 76.78227851664825]}
      zoom={4}
      style={{ width: "97vw", height: "97vh" }}
    >
      <TileLayer
        noWrap
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {activeLayer === "static" && (
        <StaticGeoJSONLayer
          ref={staticLayerRef}
          type={staticLayerProps.type}
          id={staticLayerProps.id}
        />
      )}
      {activeLayer === "dynamic" && <DynamicOverpassLayer ref={dynamicLayerRef} />}
    </MapContainer>
  );
}

export default MapContainerComponent;
