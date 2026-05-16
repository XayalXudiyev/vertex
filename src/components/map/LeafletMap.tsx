"use client";

import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  useMap,
  useMapEvents,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCenter, setZoom, setSelectedPin } from "@/store/slices/mapSlice";
import { LOCATION_TYPE_LABELS } from "@/data/mockLocations";
import type { Venue } from "@/store/api/categoriesApi";

function createMarkerIcon(color = "#77bc20") {
  const cx = 24;
  const cy = 24;
  const outerR = 22;
  const innerR = 13;

  const hexPoints = (r: number) =>
    Array.from({ length: 6 }, (_, i) => {
      const angle = (Math.PI / 3) * i;
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    }).join(" ");
  const triTopY = 46;
  const triBottomY = 58;
  const triHalfWidth = 10.5;
  const triPoints = `${cx - triHalfWidth},${triTopY} ${cx + triHalfWidth},${triTopY} ${cx},${triBottomY}`;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="64" viewBox="0 0 48 64">
      <defs>
        <filter id="mshadow" x="-20%" y="-10%" width="140%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.25"/>
        </filter>
        <mask id="hexCutout">
          <rect width="48" height="64" fill="white"/>
          <polygon points="${hexPoints(innerR)}" fill="black"/>
        </mask>
      </defs>
      <polygon points="${hexPoints(outerR)}" fill="${color}" mask="url(#hexCutout)" filter="url(#mshadow)"/>
      <polygon points="${triPoints}" fill="${color}" filter="url(#mshadow)"/>
    </svg>`;

  return L.divIcon({
    className: "custom-marker",
    html: svg,
    iconSize: [48, 64],
    iconAnchor: [24, 60],
    tooltipAnchor: [0, -60],
    popupAnchor: [0, -60],
  });
}

const greenIcon = createMarkerIcon("#77bc20");

function MapController() {
  const map = useMap();
  const { center, zoom } = useAppSelector((s) => s.map);
  const prevCenter = useRef(center);
  const prevZoom = useRef(zoom);

  useEffect(() => {
    if (
      prevCenter.current[0] !== center[0] ||
      prevCenter.current[1] !== center[1] ||
      prevZoom.current !== zoom
    ) {
      map.flyTo(center, zoom, { duration: 1.2 });
      prevCenter.current = center;
      prevZoom.current = zoom;
    }
  }, [center, zoom, map]);

  return null;
}

function MapClickHandler() {
  const dispatch = useAppDispatch();

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      dispatch(setSelectedPin({ lat, lon: lng, label: "Seçilmiş yer" }));
    },
  });

  return null;
}

interface LeafletMapProps {
  venues: Venue[];
  onLocationSelect?: (venue: Venue) => void;
}

export function LeafletMap({ venues = [], onLocationSelect }: LeafletMapProps) {
  const dispatch = useAppDispatch();
  const { center, zoom, selectedPin } = useAppSelector((s) => s.map);
  const [activeMarkerId, setActiveMarkerId] = useState<number | null>(null);

  function handleMarkerClick(loc: Venue) {
    setActiveMarkerId(loc.id);
    dispatch(setCenter([loc.latitude, loc.longitude]));
    dispatch(setZoom(15));
    dispatch(
      setSelectedPin({
        lat: loc.latitude,
        lon: loc.longitude,
        label: loc.name,
      })
    );
    onLocationSelect?.(loc);
  }

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="h-full w-full"
      style={{ minHeight: 500 }}
      zoomControl={false}
      scrollWheelZoom
      doubleClickZoom
      touchZoom
      boxZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ZoomControl position="bottomright" />
      <MapController />
      <MapClickHandler />

      {/* Venue markers */}
      {venues.map((loc) => (
        <Marker
          key={loc.id}
          position={[loc.latitude, loc.longitude]}
          icon={greenIcon}
          eventHandlers={{
            click: () => handleMarkerClick(loc),
          }}
        >
          <Tooltip
            direction="top"
            offset={[0, 0]}
            className="vertex-tooltip"
            permanent={activeMarkerId === loc.id}
          >
            <div className="vertex-tooltip-inner">
              <strong>{loc.name}</strong>
              <span className="vertex-tooltip-type">
                Mağaza
              </span>
              <span className="vertex-tooltip-address">{loc.latitude.toFixed(5)}, {loc.longitude.toFixed(5)}</span>
            </div>
          </Tooltip>
        </Marker>
      ))}

      {/* Selected pin (from search / map click) */}
      {selectedPin &&
        !venues.some(
          (m) => m.latitude === selectedPin.lat && m.longitude === selectedPin.lon
        ) && (
          <Marker
            position={[selectedPin.lat, selectedPin.lon]}
            icon={greenIcon}
          >
            <Tooltip
              direction="top"
              offset={[0, 0]}
              className="vertex-tooltip"
              permanent
            >
              <div className="vertex-tooltip-inner">
                <strong>{selectedPin.label}</strong>
                <span className="vertex-tooltip-address">
                  {selectedPin.lat.toFixed(5)}, {selectedPin.lon.toFixed(5)}
                </span>
              </div>
            </Tooltip>
          </Marker>
        )}
    </MapContainer>
  );
}