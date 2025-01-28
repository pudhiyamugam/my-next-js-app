import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { GeoJSON, useMap } from "react-leaflet";
import * as L from "leaflet";
import osmtogeojson from "osmtogeojson";

const fetchOverpassData = async (bbox) => {
  const query = `
    [out:json][timeout:25];
    (
      way["building"](${bbox});
      way["highway"](${bbox});
      way["bridge"](${bbox});
      relation["building"](${bbox});
      relation["bridge"](${bbox});
    );
    out geom;
  `;
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
  const response = await fetch(url);
  const data = await response.json();
  return osmtogeojson(data);
};

const DynamicOverpassLayer = forwardRef((props, ref) => {
  const { setData, datab } = props; // Destructure props
  const [overpassData, setOverpassData] = useState(null);
  const map = useMap();

  useEffect(() => {
    const updateOverpassData = async () => {
      const bounds = map.getBounds();
      const bbox = `${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()}`;
      try {
        const data = await fetchOverpassData(bbox);
        setOverpassData(data);
      } catch (error) {
        console.error("Error fetching Overpass data:", error);
      }
    };

    map.on("moveend", updateOverpassData);
    updateOverpassData(); // Initial fetch

    return () => {
      map.off("moveend", updateOverpassData);
    };
  }, [map]);

  // Expose a method to clear the layer
  useImperativeHandle(ref, () => ({
    clearLayer: () => setOverpassData(null),
  }));

  const onFeatureClick = (e) => {
    const properties = e.target.feature.properties;
    console.log("Search results cleared.",properties);

    const foundData = datab.osm_data.find((item) => item.osm_id === parseInt(properties.id.split('/')[1], 10));
    if (foundData) {
      setData(foundData.entities);
    } else {
      setData("no data");
    }
  };

  return (
    overpassData && (
      <GeoJSON
        data={overpassData}
        onEachFeature={(feature, layer) => {
          layer.on("click", onFeatureClick);
        }}
        style={{
          color: "red",
          weight: 1,
          fillColor: "red",
          fillOpacity: 0.3,
        }}
      />
    )
  );
});

export default DynamicOverpassLayer;
