"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import styles from "./page.module.css";
import { performSearch, removeResults } from "@/components/do-search";
import React, { useState, useRef } from "react";
import "leaflet/dist/leaflet.css";
import StaticGeoJSONLayer from "@/components/StaticGeoJSONLayer";
import DynamicOverpassLayer from "@/components/DynamicOverpassLayer";

const  datab = {
  osm_data: [
    {
      osm_id: 962670214,
      entities: [
        {
          project_name: "Main Building Construction",
          start_date: "2020-11-11",
          due_date: "2023-06-30",
          project_status: "On Going",
          completion_percentage: 88,
          completed_on: "2024-01-01",
          contractor_details: {
            name: "Noushad M.M.",
            mobile: "9656806660",
          },
          engineer_details: {
            name: "Bini M George",
            designation: "",
            office: "NH Division Muvattupuzha",
          },
          maintenance_period_years: 3,
        },
      ],
    },
    {
      osm_id: 987654321,
      entities: [
        {
          project_name: "Bridge Repair Project",
          start_date: "2021-03-15",
          due_date: "2022-12-31",
          project_status: "Completed",
          completion_percentage: 100,
          completed_on: "2022-12-25",
          contractor_details: {
            name: "Afsal P.K.",
            mobile: "9447001234",
          },
          engineer_details: {
            name: "Arjun R",
            designation: "Assistant Engineer",
            office: "PWD Division Alappuzha",
          },
          maintenance_period_years: 5,
        },
        {
          project_name: "Riverbank Reinforcement",
          start_date: "2023-01-01",
          due_date: "2025-01-01",
          project_status: "On Going",
          completion_percentage: 60,
          completed_on: null,
          contractor_details: {
            name: "Faisal C.K.",
            mobile: "9536009876",
          },
          engineer_details: {
            name: "Maya V",
            designation: "Senior Engineer",
            office: "Irrigation Division Palakkad",
          },
          maintenance_period_years: 2,
        },
      ],
    },
    {
      osm_id: 112233445,
      entities: [
        {
          project_name: "Road Widening Project",
          start_date: "2019-08-10",
          due_date: "2021-05-20",
          project_status: "Completed",
          completion_percentage: 100,
          completed_on: "2021-05-18",
          contractor_details: {
            name: "Shyam S.",
            mobile: "9847001111",
          },
          engineer_details: {
            name: "Rajan P",
            designation: "Chief Engineer",
            office: "PWD HQ Trivandrum",
          },
          maintenance_period_years: 7,
        },
      ],
    },
    {
      osm_id: 223344556,
      entities: [
        {
          project_name: "GEC Palakkad Main Building",
          start_date: "2022-06-01",
          due_date: "2024-05-01",
          project_status: "On Going",
          completion_percentage: 75,
          completed_on: null,
          contractor_details: {
            name: "Jeevan R.",
            mobile: "9888776655",
          },
          engineer_details: {
            name: "Ravi K",
            designation: "Site Engineer",
            office: "GEC Palakkad",
          },
          maintenance_period_years: 4,
        },
      ],
    },
    {
      osm_id: 633670138,
      entities: [
        {
          project_name: "Malampuzha Dam Renovation",
          start_date: "2021-05-10",
          due_date: "2023-09-15",
          project_status: "Completed",
          completion_percentage: 100,
          completed_on: "2023-08-30",
          contractor_details: {
            name: "Suresh B.",
            mobile: "9448776655",
          },
          engineer_details: {
            name: "Ramesh T",
            designation: "Project Manager",
            office: "Irrigation Division Palakkad",
          },
          maintenance_period_years: 6,
        },
      ],
    },
    {
      osm_id: 735125285,
      entities: [
        {
          project_name: "Medical College Palakkad Extension",
          start_date: "2022-02-01",
          due_date: "2024-08-01",
          project_status: "On Going",
          completion_percentage: 45,
          completed_on: null,
          contractor_details: {
            name: "Nidhin K.",
            mobile: "9701122334",
          },
          engineer_details: {
            name: "Sanjay S",
            designation: "Civil Engineer",
            office: "Health Department",
          },
          maintenance_period_years: 5,
        },
      ],
    },
    {
      osm_id: 206997332,
      entities: [
        {
          project_name: "Kasaba Police Station Reconstruction",
          start_date: "2023-01-01",
          due_date: "2024-03-01",
          project_status: "On Going",
          completion_percentage: 30,
          completed_on: null,
          contractor_details: {
            name: "Mohammed S.",
            mobile: "9812345678",
          },
          engineer_details: {
            name: "Harish P",
            designation: "Structural Engineer",
            office: "Kasaba Police Division",
          },
          maintenance_period_years: 3,
        },
      ],
    },
    {
      osm_id: 464468839,
      entities: [
        {
          project_name: "GEC Road Widening",
          start_date: "2021-09-01",
          due_date: "2023-12-31",
          project_status: "Completed",
          completion_percentage: 100,
          completed_on: "2023-10-25",
          contractor_details: {
            name: "Vishnu V",
            mobile: "9532213445",
          },
          engineer_details: {
            name: "Manoj P",
            designation: "Assistant Engineer",
            office: "PWD Palakkad",
          },
          maintenance_period_years: 2,
        },
      ],
    },
  ],
};

const Box = () => {
  const inputRef = useRef();
  const [activeLayer, setActiveLayer] = useState(null);
  const [staticLayerProps, setStaticLayerProps] = useState({ type: "", id: "" });
  const staticLayerRef = useRef(null);
  const dynamicLayerRef = useRef(null);
  const [data, setData] = useState(null);

  const handleEnterPress = (event) => {
    if (event.key === "Enter") {
      const inputElement = inputRef.current;
      if (inputElement) {
        performSearch(inputElement, []).then((data) => {
          window.activateStaticLayer(data.osm_type, data.osm_id);
          removeResults();
          console.log("Search results cleared.",data);
          const foundData = datab.osm_data.find((item) => item.osm_id === data.osm_id);
          if (foundData) {
            setData(foundData.entities);
          } else {
            setData("no data");
          }
        });
      }
    }
  };

  const handleScan = () => {
    window.activateDynamicLayer();
  };

  const handleLocate = () => {
    map.locate();
  };

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

  if (typeof window !== "undefined") {
    window.clearAllLayers = clearAllLayers;
    window.activateStaticLayer = activateStaticLayer;
    window.activateDynamicLayer = activateDynamicLayer;
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerBar}>
        <h1>TrackPWD</h1>
      </div>

      <div className={styles.mainLayout}>
        <div className={styles.leftBox}>
          {!datab.osm_data.length && (
            <h2 className={styles.note}>
              Welcome to TrackPWD. Search constructions to view details.
            </h2>
          )}
          {data === "no data" && (
            <h2 className={styles.note}>No data found</h2>
          )}
          {data && data !== "no data" && data.map((entity, index) => (
            <div key={`${entity.osm_id}-${index}`} className={styles.card}>
              <h2>{entity.project_name}</h2>
              <p>Start Date: {entity.start_date}</p>
              <p>Due Date: {entity.due_date}</p>
              <p>Project Status: {entity.project_status}</p>
              <p>Completion Percentage: {entity.completion_percentage}%</p>
              <p>Completed On: {entity.completed_on || "Not completed yet"}</p>
              <p>Contractor Details: {entity.contractor_details.name}</p>
              <p>Mobile: {entity.contractor_details.mobile}</p>
              <p>Engineer Details: {entity.engineer_details.name}</p>
              <p>Designation: {entity.engineer_details.designation || "N/A"}</p>
              <p>Office: {entity.engineer_details.office}</p>
              <p>Maintenance Period Years: {entity.maintenance_period_years}</p>
            </div>
          ))}
        </div>

        <div className={styles.rightBox}>
          <div className={styles.controls}>
            <div className="search-bar">
              <div>
                <input
                  type="text"
                  placeholder="Search location"
                  className={styles.searchBar}
                  ref={inputRef}
                  onKeyDown={handleEnterPress}
                />
              </div>
            </div>
            <button className={styles.extraButton} onClick={handleScan}>
              Find From This Area
            </button>
            <button className={styles.rBotton}>+</button>
            <button className={styles.rBotton}>-</button>
            <button className={styles.rBotton}>Locate Me</button>
          </div>

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
              <StaticGeoJSONLayer ref={staticLayerRef} type={staticLayerProps.type} id={staticLayerProps.id} />
            )}
            {activeLayer === "dynamic" && <DynamicOverpassLayer ref={dynamicLayerRef} setData={setData} datab={datab} />
}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default Box;
