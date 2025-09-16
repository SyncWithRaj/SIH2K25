"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import L from "leaflet";

// Fix Leaflet icons not showing in Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export default function NearbyCollegesMap() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const [colleges, setColleges] = useState([]);
  const [status, setStatus] = useState("Getting your location...");
  const router = useRouter();

  // Fetch user location + nearby colleges
  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setStatus("Searching for nearby colleges...");
        const { latitude, longitude } = pos.coords;

        // Initialize map once
        if (mapRef.current && !mapInstanceRef.current) {
          const map = L.map(mapRef.current).setView([latitude, longitude], 12);
          mapInstanceRef.current = map;

          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }).addTo(map);

          // User marker
          L.marker([latitude, longitude])
            .addTo(map)
            .bindPopup("<b>Your Location</b>")
            .openPopup();
        }

        // Overpass API query (50 km radius)
        const radius = 10000;
        const query = `
          [out:json];
          (
            node["amenity"="college"](around:${radius},${latitude},${longitude});
            way["amenity"="college"](around:${radius},${latitude},${longitude});
            relation["amenity"="college"](around:${radius},${latitude},${longitude});
          );
          out center;
        `;

        try {
          const response = await fetch("https://overpass-api.de/api/interpreter", {
            method: "POST",
            body: query,
          });
          const data = await response.json();

          const collegeList = data.elements.map((el) => ({
            id: el.id,
            name: el.tags.name || "Unnamed College",
            lat: el.lat || el.center?.lat,
            lon: el.lon || el.center?.lon,
          }));

          setColleges(collegeList);
          if (collegeList.length === 0) {
            setStatus("No colleges found within a 50km radius.");
          }
        } catch (error) {
          console.error("Error fetching colleges:", error);
          setStatus("Failed to fetch college data.");
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setStatus("Could not get your location. Please enable location services.");
      }
    );
  }, []);

  // Add markers for colleges
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers (not user location)
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    colleges.forEach((college) => {
      if (college.lat && college.lon) {
        const marker = L.marker([college.lat, college.lon])
          .addTo(map)
          .bindPopup(`<b>${college.name}</b>`);
        markersRef.current[college.id] = marker;
      }
    });
  }, [colleges]);

  const handleCollegeClick = (college) => {
    const map = mapInstanceRef.current;
    const marker = markersRef.current[college.id];
    if (map && marker) {
      map.flyTo([college.lat, college.lon], 14);
      marker.openPopup();
    }
  };

  return (
    <div className="flex w-full h-full" style={{ height: "calc(100vh - 4rem)" }}>
      {/* Side Panel */}
      <aside className="w-1/3 max-w-sm p-4 bg-white shadow-lg overflow-y-auto">
        {/* 🔙 Back Button + Heading */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => router.push("/")}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
          >
            ← Back
          </button>
          <h2 className="text-2xl font-bold">Nearby Colleges</h2>
        </div>

        {colleges.length > 0 ? (
          <ul>
            {colleges.map((college) => (
              <li
                key={college.id}
                onClick={() => handleCollegeClick(college)}
                className="py-2 px-2 border-b cursor-pointer hover:bg-gray-100 rounded-md"
              >
                <h3 className="font-semibold">{college.name}</h3>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">{status}</p>
        )}
      </aside>

      {/* Map */}
      <div id="map" ref={mapRef} className="flex-grow h-full" />
    </div>
  );
}
