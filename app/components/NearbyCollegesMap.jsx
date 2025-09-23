"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// --- Helper Component for Displaying Full College Details ---
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
    <div className="w-full md:w-1/3 max-w-md p-4 bg-white shadow-lg overflow-y-auto border-l border-r flex flex-col z-10">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h3 className="text-xl font-bold">College Details</h3>
        <button onClick={onClose} className="text-2xl font-bold text-gray-500 hover:text-gray-800">&times;</button>
      </div>

      {!details ? (
        <div className="flex-grow flex items-center justify-center">
            <p className="text-gray-600 text-center">
                Detailed information for <span className="font-semibold">{college.name}</span> is not available in our database.
            </p>
        </div>
      ) : (
        <div className="flex-grow">
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-lg text-blue-700">{details.name}</h4>
              <p className="text-gray-600 text-sm">{details.address}</p>
            </div>
            
            <ul className="space-y-1 text-sm text-gray-700 border-t pt-4">
              <li><strong>Contact:</strong> {details.contactNo || "N/A"}</li>
              <li><strong>Email:</strong> {details.email ? <a href={`mailto:${details.email}`} className="text-blue-600 hover:underline">{details.email}</a> : 'N/A'}</li>
              <li><strong>Website:</strong> {details.website ? <a href={`https://${details.website.replace(/^https?:\/\//,'')}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{details.website}</a> : 'N/A'}</li>
              <li><strong>University:</strong> {details.university || "N/A"}</li>
              <li><strong>Fees:</strong> {details.fees || "N/A"}</li>
            </ul>

            <div>
              <h4 className="font-semibold text-md mt-6 mb-2 border-t pt-4">Facilities</h4>
              <div className="flex flex-wrap gap-3 text-sm">
                <span className={`px-3 py-1 rounded-full font-medium ${details.facilities?.boysHostel ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {details.facilities?.boysHostel ? '✔️' : '❌'} Boys Hostel
                </span>
                <span className={`px-3 py-1 rounded-full font-medium ${details.facilities?.girlsHostel ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {details.facilities?.girlsHostel ? '✔️' : '❌'} Girls Hostel
                </span>
                 <span className={`px-3 py-1 rounded-full font-medium ${details.facilities?.mess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {details.facilities?.mess ? '✔️' : '❌'} Mess
                </span>
                <span className={`px-3 py-1 rounded-full font-medium ${details.facilities?.transportation ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {details.facilities?.transportation ? '✔️' : '❌'} Transportation
                </span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-md mt-6 mb-2 border-t pt-4">Branches & Cutoffs</h4>
              <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 text-left font-medium">Branch</th>
                      <th className="p-2 text-left font-medium">Category</th>
                      <th className="p-2 text-left font-medium">Closing Rank/Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedBranches && Object.entries(groupedBranches).map(([branchName, data]) => (
                      <React.Fragment key={branchName}>
                        <tr className="border-t bg-gray-50">
                          <td className="p-2 font-bold" colSpan="3">
                            {branchName} 
                            <span className="font-normal text-gray-600 ml-2">(Intake: {data.intake > 0 ? data.intake : 'N/A'}, Board: {data.board})</span>
                          </td>
                        </tr>
                        {data.categories.map((cat, catIndex) => (
                           <tr key={`${branchName}-${catIndex}`}>
                             <td className="p-2 pl-6">{/* Intentionally empty for alignment */}</td>
                             <td className="p-2">{cat.category}</td>
                             <td className="p-2 font-semibold">{cat.closingRank === 0 ? 'N/A' : cat.closingRank}</td>
                           </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Main Map Component ---

// Fix Leaflet icons
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
  const router = useRouter();

  useEffect(() => {
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

        if (!overpassResponse.ok) {
            const errorText = await overpassResponse.text();
            throw new Error(`Failed to fetch from Overpass API. Status: ${overpassResponse.status}. Message: ${errorText}`);
        }
        if (!dbResponse.ok) throw new Error('Failed to fetch from local database API');

        const overpassData = await overpassResponse.json();
        const dbData = await dbResponse.json();
        
        if (!dbData.success) throw new Error("Failed to fetch from database.");
        const dbColleges = dbData.data;

        const mergedColleges = overpassData.elements.map(el => {
            const mapName = el.tags.name || "Unnamed College";

            // ✅ --- THE FINAL FIX IS HERE --- ✅
            const dbMatch = dbColleges.find(dbCollege => {
                const normalize = (str) => 
                    str.toLowerCase()
                       .replace(/[(),.\-&]/g, '') // Remove punctuation
                       .replace('indian institute of technology', 'iit')
                       .replace('indian institute of management', 'iim')
                       .replace('national institute of design', 'nid')
                       .replace('government', 'govt') 
                       .split(' ')
                       .filter(Boolean);

                const mapWords = normalize(mapName);
                const dbWords = normalize(dbCollege.name);

                // If one name is just the acronym (e.g., "iit gandhinagar")
                // and the other is the full name, this will now work.
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
          const map = L.map(mapRef.current).setView([latitude, longitude], 10);
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
        const icon = new L.Icon({
            ...L.Icon.Default.prototype.options,
            iconUrl: college.dbData ? "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png" : "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
            shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
            iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
        });

        const marker = L.marker([college.lat, college.lon], { icon }).addTo(map).bindPopup(`<b>${college.name}</b>`);
        marker.on('click', () => handleCollegeClick(college));
        markersRef.current[college.id] = marker;
      }
    });
  }, [colleges]);

  const handleCollegeClick = (college) => {
    setSelectedCollege(college);
    const map = mapInstanceRef.current;
    const marker = markersRef.current[college.id];
    if (map && marker) {
      map.flyTo([college.lat, college.lon], 14);
      marker.openPopup();
    }
  };

  return (
    <div className="flex w-full h-full flex-col md:flex-row mt-24" style={{ height: "calc(100vh - 4rem)" }}>
      <aside className="w-full md:w-1/3 max-w-xs p-4 bg-gray-50 shadow-lg overflow-y-auto flex flex-col">
        <div className="flex items-center gap-3 mb-4 flex-shrink-0">
          <button onClick={() => router.push("/")} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition">
            ← Back
          </button>
          <h2 className="text-xl font-bold">Nearby Colleges</h2>
        </div>
        <div className="flex-grow overflow-y-auto">
          {colleges.length > 0 ? (
            <ul>
              {colleges.map((college) => (
                <li
                  key={college.id}
                  onClick={() => handleCollegeClick(college)}
                  className={`p-2 border-b cursor-pointer hover:bg-gray-200 rounded-md ${selectedCollege?.id === college.id ? 'bg-blue-100' : ''}`}
                >
                  <h3 className="font-semibold text-sm">{college.name}</h3>
                  {college.dbData && <span className="text-xs text-blue-600 font-bold">✓ Details Available</span>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">{status}</p>
          )}
        </div>
      </aside>
      {selectedCollege && (
        <CollegeDetailsPanel 
          college={selectedCollege} 
          onClose={() => setSelectedCollege(null)} 
        />
      )}
      <div id="map" ref={mapRef} className="flex-grow h-full w-full" />
    </div>
  );
}