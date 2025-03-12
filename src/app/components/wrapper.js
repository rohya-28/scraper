'use client';
import { useState, useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';

export default function LeafletMapComponent({ start, end }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!start || !end) return;

    if (!mapRef.current) {
      // Initialize the map
      mapRef.current = L.map('map').setView(
        [(start.latitude + end.latitude) / 2, (start.longitude + end.longitude) / 2],
        13
      );

      // Add a tile layer (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);

      // Add routing control without side panel
      L.Routing.control({
        waypoints: [
          L.latLng(start.latitude, start.longitude),
          L.latLng(end.latitude, end.longitude),
        ],
        routeWhileDragging: true,
        show: false, // Hide the instruction panel
        lineOptions: {
          styles: [{ color: 'red', opacity: 0.7, weight: 5 }], // Customize line appearance
        },
      }).addTo(mapRef.current);
    } else {
      //Clear the map
      mapRef.current.eachLayer((layer) => {
        if (layer instanceof L.Routing.Control) {
          mapRef.current.removeLayer(layer);
        }
      });
      // Add routing control without side panel
      L.Routing.control({
        waypoints: [
          L.latLng(start.latitude, start.longitude),
          L.latLng(end.latitude, end.longitude),
        ],
        routeWhileDragging: true,
        show: false, // Hide the instruction panel
        lineOptions: {
          styles: [{ color: 'red', opacity: 0.7, weight: 5 }], // Customize line appearance
        },
      }).addTo(mapRef.current);
    }
  }, [start, end]);

  return <div id="map" className="h-[500px] w-full" />;
}