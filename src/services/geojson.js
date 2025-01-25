"use client"

import osmtogeojson from "osmtogeojson";




var geoLayer = null;
let place = null;

export async function geoJSON(type, id) {
    var result = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      // The body contains the query
      // to understand the query language see "The Programmatic Query Language" on
      // https://wiki.openstreetmap.org/wiki/Overpass_API#The_Programmatic_Query_Language_(OverpassQL)
      body:
        "data=" +
        encodeURIComponent(`
              [out:json][timeout:25];(${type}(${id}););out geom;`),
    }).then((data) => data.json());
    if (geoLayer != null) {
      geoLayer.remove();
    } //removing if there any already
  
    result = osmtogeojson(result); //converting JSON to geoJSON
    
    return result;
  
    //adding geoJSON to map
    
  }