"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, X, Mail, Phone, Globe, University, Building } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// --- Helper Components ---

// A simple loading spinner
const LoadingSpinner = ({ status }) => (
  <div className="flex flex-col items-center justify-center h-full text-center p-4">
    <svg className="animate-spin h-8 w-8 text-indigo-600 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <p className="text-slate-600 font-medium">{status}</p>
  </div>
);

// A new card component for the college list
const CollegeCard = ({ college, isSelected, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-200 ease-in-out space-x-4 ${isSelected
        ? 'bg-indigo-50 border-indigo-500 shadow-sm'
        : 'bg-white border-slate-200 hover:border-indigo-400 hover:shadow-sm'
      }`}
  >
    <div className="flex-shrink-0">
      <University size={24} className={isSelected ? "text-indigo-600" : "text-slate-500"} />
    </div>
    <div className="flex-grow">
      <h3 className="font-semibold text-sm text-slate-800 leading-tight">{college.name}</h3>
      {college.dbData && (
        <span className="inline-block mt-1.5 px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700">
          Details Available
        </span>
      )}
    </div>
  </div>
);


// Refined College Details Panel with updated exit animation
const CollegeDetailsPanel = ({ college, onClose }) => {
  const details = college.dbData;

  const groupedBranches = details?.branches?.reduce((acc, branch) => {
    const { branchName, ...rest } = branch;
    if (!acc[branchName]) {
      acc[branchName] = { intake: rest.intake, board: rest.board, categories: [] };
    }
    acc[branchName].categories.push(rest);
    return acc;
  }, {});

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }} // <-- UPDATED LINE
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="w-full md:w-1/3 max-w-md p-4 bg-white shadow-2xl overflow-y-auto border-l flex flex-col z-10"
    >
      {/* Panel Header */}
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h3 className="text-xl font-bold text-slate-800">College Details</h3>
        <button
          onClick={onClose}
          className="p-2 rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* Panel Content */}
      {!details ? (
        <div className="flex-grow flex items-center justify-center text-center">
          <p className="text-slate-600">
            Detailed information for <span className="font-semibold">{college.name}</span> is not available.
          </p>
        </div>
      ) : (
        <div className="flex-grow space-y-6">
          <div>
            <h4 className="font-extrabold text-2xl text-indigo-700">{details.name}</h4>
            <p className="text-slate-600 text-sm mt-1">{details.address}</p>
          </div>

          <ul className="space-y-3 text-sm text-slate-800 border-t pt-4">
            <li className="flex items-center gap-3"><Phone size={16} className="text-slate-500" /> <strong>Contact:</strong> {details.contactNo || "N/A"}</li>
            <li className="flex items-center gap-3"><Mail size={16} className="text-slate-500" /> <strong>Email:</strong> {details.email ? <a href={`mailto:${details.email}`} className="text-indigo-600 hover:underline">{details.email}</a> : 'N/A'}</li>
            <li className="flex items-center gap-3"><Globe size={16} className="text-slate-500" /> <strong>Website:</strong> {details.website ? <a href={`https://${details.website.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{details.website}</a> : 'N/A'}</li>
            <li className="flex items-center gap-3"><University size={16} className="text-slate-500" /> <strong>University:</strong> {details.university || "N/A"}</li>
            <li className="flex items-center gap-3"><Building size={16} className="text-slate-500" /> <strong>Fees:</strong> {details.fees || "N/A"}</li>
          </ul>

          <div>
            <h4 className="font-semibold text-md text-slate-700 mt-6 mb-3 border-t pt-4">Facilities</h4>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className={`px-3 py-1 rounded-full font-medium ${details.facilities?.boysHostel ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {details.facilities?.boysHostel ? '✔' : '✖'} Boys Hostel
              </span>
              <span className={`px-3 py-1 rounded-full font-medium ${details.facilities?.girlsHostel ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {details.facilities?.girlsHostel ? '✔' : '✖'} Girls Hostel
              </span>
              <span className={`px-3 py-1 rounded-full font-medium ${details.facilities?.mess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {details.facilities?.mess ? '✔' : '✖'} Mess
              </span>
              <span className={`px-3 py-1 rounded-full font-medium ${details.facilities?.transportation ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {details.facilities?.transportation ? '✔' : '✖'} Transportation
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-md text-slate-700 mt-6 mb-3 border-t pt-4">Branches & Cutoffs</h4>
            <div className="overflow-x-auto border rounded-lg shadow-sm">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="p-3 text-left font-semibold text-slate-600">Branch</th>
                    <th className="p-3 text-left font-semibold text-slate-600">Category</th>
                    <th className="p-3 text-left font-semibold text-slate-600">Closing Rank</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedBranches && Object.entries(groupedBranches).map(([branchName, data]) => (
                    <React.Fragment key={branchName}>
                      <tr className="border-t bg-slate-100/70">
                        <td className="p-3 font-bold text-slate-800" colSpan="3">
                          {branchName}
                          <span className="font-normal text-slate-500 ml-2">(Intake: {data.intake > 0 ? data.intake : 'N/A'})</span>
                        </td>
                      </tr>
                      {data.categories.map((cat, catIndex) => (
                        <tr key={`${branchName}-${catIndex}`} className="border-t hover:bg-slate-50">
                          <td className="p-3 pl-8">{/* Intentionally empty */}</td>
                          <td className="p-3 text-slate-600">{cat.category}</td>
                          <td className="p-3 font-semibold text-slate-900">{cat.closingRank === 0 ? 'N/A' : cat.closingRank}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// --- Main Map Component ---

const createIcon = (url) => new L.Icon({
  iconUrl: url,
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

const defaultIcon = createIcon("https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png");
const detailedIcon = createIcon("https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png");
const selectedIcon = createIcon("https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png");

if (typeof window !== 'undefined') {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  });
}

export default function NearbyCollegesMap() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const [colleges, setColleges] = useState([]);
  const [status, setStatus] = useState("Getting your location...");
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [lastSelectedId, setLastSelectedId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // --- This data fetching logic is unchanged ---
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setStatus("Geolocation is not supported by your browser.");
      return;
    }

    const fetchData = async (latitude, longitude) => {
      setStatus("Searching for nearby colleges...");
      const radius = 100000;
      const overpassQuery = `[out:json];(node["amenity"="college"](around:${radius},${latitude},${longitude});way["amenity"="college"](around:${radius},${latitude},${longitude});relation["amenity"="college"](around:${radius},${latitude},${longitude}););out center;`;
      try {
        const [overpassResponse, dbResponse] = await Promise.all([
          fetch("https://overpass-api.de/api/interpreter", { method: "POST", body: overpassQuery }),
          fetch("/api/colleges")
        ]);
        if (!overpassResponse.ok) throw new Error('Failed to fetch from Overpass API');
        if (!dbResponse.ok) throw new Error('Failed to fetch from local database API');
        const overpassData = await overpassResponse.json();
        const dbData = await dbResponse.json();
        if (!dbData.success) throw new Error("Failed to fetch from database.");
        const dbColleges = dbData.data;
        const mergedColleges = overpassData.elements.map(el => {
          const mapName = el.tags.name || "Unnamed College";
          const dbMatch = dbColleges.find(dbCollege => {
            const normalize = (str) =>
              str.toLowerCase()
                .replace(/[(),.\-&]/g, '')
                .replace('indian institute of technology', 'iit')
                .replace('indian institute of management', 'iim')
                .replace('national institute of design', 'nid')
                .replace('government', 'govt')
                .split(' ')
                .filter(Boolean);
            const mapWords = normalize(mapName);
            const dbWords = normalize(dbCollege.name);
            return mapWords.every(word => dbWords.includes(word)) || dbWords.every(word => mapWords.includes(word));
          });
          return { id: el.id, name: mapName, lat: el.lat || el.center?.lat, lon: el.lon || el.center?.lon, dbData: dbMatch || null };
        });
        const filterKeywords = ['government', 'govt', 'sarkari', 'national institute', 'indian institute', 'iit', 'nit', 'nid', 'grant-in-aid', 'grant', 'ld'];
        const filteredColleges = mergedColleges.filter(college => {
          if (!college.lat || !college.lon) return false;
          const lowerCaseName = college.name.toLowerCase();
          return filterKeywords.some(keyword => lowerCaseName.includes(keyword));
        });
        setColleges(filteredColleges);
        setStatus(filteredColleges.length === 0 ? "No Govt. or Grant-in-Aid colleges found within 100km." : "");
      } catch (error) {
        console.error("Error fetching data:", error);
        setStatus(error.message);
      }
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        if (mapRef.current && !mapInstanceRef.current) {
          const map = L.map(mapRef.current, { zoomControl: false }).setView([latitude, longitude], 10);
          L.control.zoom({ position: 'bottomright' }).addTo(map);
          mapInstanceRef.current = map;
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }).addTo(map);
          L.marker([latitude, longitude]).addTo(map).bindPopup("<b>Your Location</b>").openPopup();
        }
        fetchData(latitude, longitude);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setStatus("Could not get your location. Please enable location services.");
      }
    );
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !colleges) return;

    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    colleges.forEach((college) => {
      if (college.lat && college.lon) {
        const icon = college.dbData ? detailedIcon : defaultIcon;
        const marker = L.marker([college.lat, college.lon], { icon }).addTo(map).bindPopup(`<b>${college.name}</b>`);
        marker.on('click', () => handleCollegeClick(college));
        markersRef.current[college.id] = marker;
      }
    });
  }, [colleges]);

  const handleCollegeClick = (college) => {
    const newMarker = markersRef.current[college.id];

    if (lastSelectedId && markersRef.current[lastSelectedId]) {
      const lastMarker = markersRef.current[lastSelectedId];
      const lastCollege = colleges.find(c => c.id === lastSelectedId);
      if (lastCollege) {
        lastMarker.setIcon(lastCollege.dbData ? detailedIcon : defaultIcon);
      }
    }

    if (newMarker) newMarker.setIcon(selectedIcon);

    setSelectedCollege(college);
    setLastSelectedId(college.id);

    mapInstanceRef.current?.flyTo([college.lat, college.lon], 14, { duration: 1.0 });
  };

  const handleCloseDetails = () => {
    if (lastSelectedId && markersRef.current[lastSelectedId]) {
      const lastMarker = markersRef.current[lastSelectedId];
      const lastCollege = colleges.find(c => c.id === lastSelectedId);
      if (lastCollege) {
        lastMarker.setIcon(lastCollege.dbData ? detailedIcon : defaultIcon);
      }
    }
    setSelectedCollege(null);
    setLastSelectedId(null);
  }

  return (
    <div className="flex w-full h-screen flex-col md:flex-row bg-slate-50 mt-20">
      <aside className="w-full md:w-1/3 max-w-sm p-4 bg-white shadow-lg overflow-y-auto flex flex-col z-20 border-r border-slate-200">
        <div className="flex items-center gap-3 mb-4 flex-shrink-0">
          {/* <button onClick={() => router.push("/")} className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium">
            <ArrowLeft size={16} /> Back
          </button> */}
          <h2 className="text-2xl font-semibold text-slate-900 pb-3 border-b-2 border-slate-200">
            Nearby Government Colleges
          </h2>        </div>
        <div className="flex-grow overflow-y-auto -mr-2 pr-2">
          {colleges.length > 0 ? (
            <div className="space-y-2">
              {colleges.map((college) => (
                <CollegeCard
                  key={college.id}
                  college={college}
                  isSelected={selectedCollege?.id === college.id}
                  onClick={() => handleCollegeClick(college)}
                />
              ))}
            </div>
          ) : (
            <LoadingSpinner status={status} />
          )}
        </div>
      </aside>

      <AnimatePresence>
        {selectedCollege && (
          <CollegeDetailsPanel
            college={selectedCollege}
            onClose={handleCloseDetails}
          />
        )}
      </AnimatePresence>

      <div id="map" ref={mapRef} className="flex-grow h-full w-full z-0" />
    </div>
  );
}