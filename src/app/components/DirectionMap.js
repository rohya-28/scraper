'use client';
import { useState, useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

export default function DirectionMap({ start, end }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!start || !end) return;

    if (!mapRef.current) {
      mapRef.current = L.map('map').setView(
        [(start.latitude + end.latitude) / 2, (start.longitude + end.longitude) / 2],
        13
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);

      L.marker([start.latitude, start.longitude]).addTo(mapRef.current);
      L.marker([end.latitude, end.longitude]).addTo(mapRef.current);

      const polyline = L.polyline(
        [
          [start.latitude, start.longitude],
          [end.latitude, end.longitude],
        ],
        { color: 'blue' }
      ).addTo(mapRef.current);

      mapRef.current.fitBounds(polyline.getBounds());
    } else {
        const polyline = L.polyline(
          [
            [start.latitude, start.longitude],
            [end.latitude, end.longitude],
          ],
          { color: 'blue' }
        ).addTo(mapRef.current);

        mapRef.current.fitBounds(polyline.getBounds());
    }

  }, [start, end]);

  return <div id="map" className="h-[500px] w-full" />;
}