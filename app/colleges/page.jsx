'use client';

import { useState, useEffect } from 'react';

// Displays the details of the selected college (Right Panel)
function CollegeDetails({ college }) {
    if (!college) {
        return (
            <div className="flex-grow h-full flex items-center justify-center bg-slate-50">
                <p className="text-gray-500 text-lg">Select a college to see the details.</p>
            </div>
        );
    }

    return (
        <div className="relative flex-grow p-6 sm:p-8 bg-white overflow-y-auto">
            <a
                href="/colleges/college-map/"
                className="absolute top-6 right-6 flex items-center gap-2 bg-slate-700 text-white px-4 py-2 rounded-lg font-semibold shadow-sm transition hover:bg-slate-800 hover:-translate-y-0.5"
            >
                <span>🗺️</span>
                View on Map
            </a>
            
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 border-b-2 border-blue-500 pb-3 pr-40">
                {college.name}
            </h2>

            <ul className="space-y-2 text-gray-600 mb-8">
                <li><strong>Address:</strong> {college.address || 'N/A'}</li>
                <li><strong>Contact:</strong> {college.contactNo || 'N/A'}</li>
                <li><strong>Email:</strong> {college.email ? <a href={`mailto:${college.email}`} className="text-blue-600 hover:underline">{college.email}</a> : 'N/A'}</li>
                <li><strong>Website:</strong> {college.website ? <a href={college.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{college.website}</a> : 'N/A'}</li>
                <li><strong>University:</strong> {college.university || 'N/A'}</li>
                <li><strong>Fees:</strong> {college.fees || 'N/A'}</li>
            </ul>

            {/* --- UPDATED: Facilities Section --- */}
            {college.facilities && (
                <>
                    <h3 className="text-xl font-semibold text-gray-700 mb-3">Facilities</h3>
                    <div className="flex flex-wrap gap-3 text-sm mb-8">
                        <span className={`px-3 py-1 rounded-full font-medium ${college.facilities.boysHostel ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {college.facilities.boysHostel ? '✔️' : '❌'} Boys Hostel
                        </span>
                        <span className={`px-3 py-1 rounded-full font-medium ${college.facilities.girlsHostel ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {college.facilities.girlsHostel ? '✔️' : '❌'} Girls Hostel
                        </span>
                        <span className={`px-3 py-1 rounded-full font-medium ${college.facilities.mess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {college.facilities.mess ? '✔️' : '❌'} Mess
                        </span>
                        <span className={`px-3 py-1 rounded-full font-medium ${college.facilities.transportation ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {college.facilities.transportation ? '✔️' : '❌'} Transportation
                        </span>
                    </div>
                </>
            )}

            <h3 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4">Branches & Cutoffs</h3>

            <div className="overflow-x-auto border rounded-lg">
                <table className="w-full min-w-[700px] text-left text-sm">
                    <thead className="bg-slate-100">
                        <tr>
                            <th className="p-3 font-semibold text-gray-600 uppercase">Branch Name</th>
                            <th className="p-3 font-semibold text-gray-600 uppercase">Intake</th>
                            <th className="p-3 font-semibold text-gray-600 uppercase">Govt. Seats</th>
                            <th className="p-3 font-semibold text-gray-600 uppercase">Board</th>
                            <th className="p-3 font-semibold text-gray-600 uppercase">Category</th>
                            <th className="p-3 font-semibold text-gray-600 uppercase">Closing Rank</th>
                        </tr>
                    </thead>
                    <tbody>
                        {college.branches?.map((branch, index) => (
                            <tr key={index} className="border-t border-slate-200 even:bg-slate-50">
                                <td className="p-3 font-medium text-gray-800">{branch.branchName}</td>
                                <td className="p-3 text-gray-700">{branch.intake}</td>
                                <td className="p-3 text-gray-700">{branch.governmentSeats}</td>
                                <td className="p-3 text-gray-700">{branch.board}</td>
                                <td className="p-3 text-gray-700">{branch.category}</td>
                                <td className="p-3 text-gray-700">{branch.closingRank}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}


// The main page component with the two-panel layout
export default function CollegesPage() {
    const [colleges, setColleges] = useState([]);
    const [selectedCollege, setSelectedCollege] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchColleges = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/colleges');
                const result = await response.json();

                if (!result.success) {
                    throw new Error(result.message || 'Failed to fetch data');
                }

                setColleges(result.data);
                if (result.data && result.data.length > 0) {
                    setSelectedCollege(result.data[0]);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchColleges();
    }, []);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-100 text-lg text-gray-600">Loading college data...</div>;
    }

    if (error) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-100 text-lg text-red-600 font-medium">Error: {error}</div>;
    }

    return (
        <div className="flex h-screen font-sans bg-slate-100">
            <aside className="w-full md:w-1/3 lg:w-1/4 h-full bg-slate-50 border-r border-slate-200 flex flex-col">
                <div className="p-4 border-b border-slate-200">
                    <h1 className="text-xl font-bold text-slate-800">College List</h1>
                </div>
                <div className="overflow-y-auto">
                    {colleges.length > 0 ? (
                        <ul>
                            {colleges.map(college => (
                                <li key={college._id}>
                                    <button
                                        onClick={() => setSelectedCollege(college)}
                                        className={`w-full text-left p-4 text-sm font-medium transition-colors duration-150
                                            ${selectedCollege && selectedCollege._id === college._id
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-700 hover:bg-slate-200'
                                            }`}
                                    >
                                        {college.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="p-4 text-gray-500">No colleges found.</p>
                    )}
                </div>
            </aside>
            
            <main className="w-full md:w-2/3 lg:w-3/4 h-full flex flex-col">
                 <CollegeDetails college={selectedCollege} />
            </main>
        </div>
    );
}