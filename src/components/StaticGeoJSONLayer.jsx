import React, { useEffect, useImperativeHandle, forwardRef, useState } from "react";
import { GeoJSON, useMap } from "react-leaflet";
import { geoJSON as fetchGeoJSON } from "@/services/geojson";

const StaticGeoJSONLayer = forwardRef(({ type, id }, ref) => {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const map = useMap();

  useEffect(() => {
    const fetchStaticData = async () => {
      if (!type || !id) return; // Ensure both type and id are provided
      try {
        const data = await fetchGeoJSON(type, id);
        setGeoJsonData(data);

        // Automatically fit bounds to the GeoJSON data
        if (data && data.features && data.features.length > 0) {
          const geoJsonLayer = L.geoJSON(data);
          const bounds = geoJsonLayer.getBounds();
          map.fitBounds(bounds);
        }
      } catch (error) {
        console.error("Error fetching static GeoJSON data:", error);
      }
    };
    fetchStaticData();
  }, [type, id, map]); // Re-fetch data and refit bounds when type or id changes

  // Expose a method to clear the layer
  useImperativeHandle(ref, () => ({
    clearLayer: () => setGeoJsonData(null),
  }));

  return (
    geoJsonData && (
      <GeoJSON
        data={geoJsonData}
        style={{
          color: "blue",
          weight: 1,
          fillColor: "blue",
          fillOpacity: 0.1,
        }}
      />
    )
  );
});

export default StaticGeoJSONLayer;
