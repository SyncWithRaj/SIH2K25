'use client';

import { useState, useEffect, useMemo } from 'react';

// --- SVG Icons ---
const Icon = ({ className = 'w-5 h-5', children }) => <span className={`inline-block ${className}`}>{children}</span>;
const MapPinIcon = () => <Icon><svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg></Icon>;
const PhoneIcon = () => <Icon><svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg></Icon>;
const MailIcon = () => <Icon><svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg></Icon>;
const GlobeIcon = () => <Icon><svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m0 18a9 9 0 009-9M3 12a9 9 0 019-9m-9 9a9 9 0 009 9m-9-9h18"></path></svg></Icon>;
const UniversityIcon = () => <Icon className="w-16 h-16 text-slate-400"><svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg></Icon>;
const CheckCircleIcon = () => <Icon className="w-6 h-6 text-green-500"><svg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg></Icon>;
const XCircleIcon = () => <Icon className="w-6 h-6 text-red-400"><svg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg></Icon>;
const SearchIcon = () => <Icon><svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></Icon>;
const MenuIcon = () => <Icon className="w-6 h-6"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg></Icon>;
const XIcon = () => <Icon className="w-6 h-6"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></Icon>;
const ChevronDownIcon = () => <Icon className="w-4 h-4 text-slate-500"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg></Icon>;

// --- Helper & UI Components ---

function SkeletonLoader() {
    return (
        <div className="flex h-screen font-sans bg-white">
            <aside className="hidden md:block w-full md:w-1/3 lg:w-1/4 h-full bg-slate-50 border-r border-slate-200 p-4 space-y-4">
                <div className="h-10 bg-slate-200 rounded-lg shimmer"></div>
                <div className="h-16 bg-slate-200 rounded-lg shimmer"></div>
                <div className="space-y-2 pt-4">
                    {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-slate-200 rounded-lg shimmer"></div>)}
                </div>
            </aside>
            <main className="w-full md:w-2/3 lg:w-3/4 h-full p-8 space-y-6">
                <div className="h-48 bg-slate-200 rounded-lg shimmer"></div>
                <div className="h-10 bg-slate-200 rounded-lg w-3/4 shimmer"></div>
                <div className="h-6 bg-slate-200 rounded-lg w-1/2 shimmer"></div>
                <div className="flex space-x-4">
                    <div className="h-10 w-24 bg-slate-200 rounded-lg shimmer"></div>
                    <div className="h-10 w-24 bg-slate-200 rounded-lg shimmer"></div>
                </div>
                <div className="h-40 bg-slate-200 rounded-lg mt-8 shimmer"></div>
            </main>
        </div>
    )
}

function CollegeDetails({ college, animationKey }) {
    const [activeTab, setActiveTab] = useState('details');

    useEffect(() => {
        setActiveTab('details');
    }, [college]);

    if (!college) {
        return (
            <div className="flex-grow h-full flex items-center justify-center bg-white p-4">
                <div className="text-center text-slate-500">
                    <UniversityIcon />
                    <p className="text-lg mt-2 font-medium">Select a college to see the details.</p>
                    <p className="text-sm">Use the filters on the left to narrow your search.</p>
                </div>
            </div>
        );
    }
    
    const facilitiesList = [
        { key: 'boysHostel', label: 'Boys Hostel' },
        { key: 'girlsHostel', label: 'Girls Hostel' },
        { key: 'mess', label: 'Mess' },
        { key: 'transportation', label: 'Transportation' },
    ];

    return (
        <div key={animationKey} className="relative flex-grow bg-white overflow-y-auto animate-fadeIn flex flex-col">
            <div className="p-6 sm:p-8">
                <div className="flex-grow">
                    <div className="relative mb-6">
                         <img src={`https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`} 
                         onError={(e) => { e.target.onerror = null; e.target.src=`https://placehold.co/1200x400/E0E7FF/4F46E5?text=${encodeURIComponent(college.name)}`}}
                         alt={`${college.name} campus`} className="w-full h-48 object-cover rounded-xl" />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl"></div>
                         <a href="/colleges/college-map" className="absolute top-4 right-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg font-semibold shadow-lg transition hover:bg-white/30 transform hover:-translate-y-0.5 text-sm">
                            <MapPinIcon />
                            <span className='mt-2'>Find Nearby Colleges</span>
                        </a>
                         <div className="absolute bottom-4 left-4 text-white">
                             <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{college.name}</h2>
                             <p className="font-semibold text-indigo-200">{college.university || 'N/A'}</p>
                         </div>
                    </div>
                </div>
            </div>

            <div className="border-b border-slate-200 px-6 sm:px-8">
                <nav className="-mb-px flex space-x-6 relative">
                    <TabButton name="details" activeTab={activeTab} setActiveTab={setActiveTab}>Details</TabButton>
                    <TabButton name="branches" activeTab={activeTab} setActiveTab={setActiveTab}>Branches / Cutoffs</TabButton>
                    <TabButton name="facilities" activeTab={activeTab} setActiveTab={setActiveTab}>Facilities</TabButton>
                </nav>
            </div>
            
            <div className="p-6 sm:p-8 flex-grow">
                {activeTab === 'details' && (
                     <div className="animate-fadeIn grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <InfoItem icon={<MapPinIcon />} label="Address" value={college.address} />
                        <InfoItem icon={<PhoneIcon />} label="Contact" value={college.contactNo} />
                        <InfoItem icon={<MailIcon />} label="Email" value={college.email} isEmail />
                        <InfoItem icon={<GlobeIcon />} label="Website" value={college.website} isLink />
                    </div>
                )}
                 {activeTab === 'branches' && (
                    <div className="animate-fadeIn">
                        <div className="overflow-x-auto border border-slate-200 rounded-lg shadow-sm">
                            <table className="w-full min-w-[700px] text-left text-sm">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="p-4 font-semibold text-slate-600 uppercase tracking-wider">Branch Name</th>
                                        <th className="p-4 font-semibold text-slate-600 uppercase tracking-wider text-center">Intake</th>
                                        <th className="p-4 font-semibold text-slate-600 uppercase tracking-wider text-center">Govt. Seats</th>
                                        <th className="p-4 font-semibold text-slate-600 uppercase tracking-wider">Category</th>
                                        <th className="p-4 font-semibold text-slate-600 uppercase tracking-wider text-right">Closing Rank</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {college.branches?.length > 0 ? college.branches.map((branch, index) => (
                                        <tr key={index} className="border-t border-slate-200 hover:bg-slate-50/70 transition-colors">
                                            <td className="p-4 font-medium text-slate-800">{branch.branchName}</td>
                                            <td className="p-4 text-slate-600 text-center">{branch.intake}</td>
                                            <td className="p-4 text-slate-600 text-center">{branch.governmentSeats}</td>
                                            <td className="p-4"><span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-semibold">{branch.category}</span></td>
                                            <td className="p-4 text-slate-800 font-semibold text-right">{branch.closingRank}</td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="5" className="text-center p-8 text-slate-500">No branch information available.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                 )}
                 {activeTab === 'facilities' && (
                    <div className="animate-fadeIn grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        {facilitiesList.map((facility, index) => (
                            <FacilityItem key={facility.key} label={facility.label} available={college.facilities ? college.facilities[facility.key] : false} index={index} />
                        ))}
                    </div>
                 )}
            </div>
        </div>
    );
}

const TabButton = ({ name, activeTab, setActiveTab, children }) => (
    <button onClick={() => setActiveTab(name)} className={`whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-sm transition-colors focus:outline-none ${activeTab === name ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>
        {children}
    </button>
);

const InfoItem = ({ icon, label, value, isLink, isEmail }) => {
    if (!value) return null;
    
    const renderValue = () => {
        if (isLink) return <a href={value} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline break-all">{value}</a>;
        if (isEmail) return <a href={`mailto:${value}`} className="text-indigo-600 hover:underline break-all">{value}</a>;
        return <span className="text-slate-700 break-words">{value}</span>;
    };

    return (
        <div className="flex items-start gap-3 py-2">
            <div className="flex-shrink-0 text-slate-400 mt-1">{icon}</div>
            <div>
                <p className="text-sm font-medium text-slate-500">{label}</p>
                {renderValue()}
            </div>
        </div>
    );
};

const FacilityItem = ({ label, available, index }) => (
    <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-200 shadow-sm" style={{'--delay': `${index * 50}ms`}}>
        {available ? <CheckCircleIcon /> : <XCircleIcon />}
        <span className={`font-medium ${available ? 'text-slate-700' : 'text-slate-500'}`}>{label}</span>
    </div>
);

const CollapsibleFilter = ({ children, title }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="border-b border-slate-200/80">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-4">
                <h3 className="font-semibold text-slate-700">{title}</h3>
                <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}><ChevronDownIcon /></span>
            </button>
            {isOpen && <div className="p-4 pt-0">{children}</div>}
        </div>
    )
}

// The main page component
export default function CollegesPage() {
    const [colleges, setColleges] = useState([]);
    const [filteredColleges, setFilteredColleges] = useState([]);
    const [selectedCollege, setSelectedCollege] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUniversity, setSelectedUniversity] = useState("All");
    const [selectedBranch, setSelectedBranch] = useState("All");

    const [animationKey, setAnimationKey] = useState(0);
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const universities = useMemo(() => ["All", ...new Set(colleges.map(c => c.university).filter(Boolean).sort())], [colleges]);
    const branches = useMemo(() => ["All", ...new Set(colleges.flatMap(c => c.branches?.map(b => b.branchName) || []).filter(Boolean).sort())], [colleges]);

    useEffect(() => {
        const fetchColleges = async () => {
            try {
                // In a real app, replace this with your actual API endpoint.
                const response = await fetch('/api/colleges');
                const result = await response.json();
                
                if (!result.success) throw new Error(result.message || 'API request failed');
                const collegeData = result.data || [];

                setColleges(collegeData);
                setFilteredColleges(collegeData);
                if (collegeData.length > 0) setSelectedCollege(collegeData[0]);

            } catch (err) {
                console.error("Fetch error:", err)
                setError("Could not load college data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchColleges();
    }, []);
    
    useEffect(() => {
        let results = colleges;
        if (searchTerm) results = results.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
        if (selectedUniversity !== "All") results = results.filter(c => c.university === selectedUniversity);
        if (selectedBranch !== "All") results = results.filter(c => c.branches?.some(b => b.branchName === selectedBranch));
        setFilteredColleges(results);
        if (selectedCollege && !results.some(c => c._id === selectedCollege._id)) {
            setSelectedCollege(results[0] || null);
        }
    }, [searchTerm, selectedUniversity, selectedBranch, colleges]);


    const handleSelectCollege = (college) => {
        setSelectedCollege(college);
        setAnimationKey(prevKey => prevKey + 1);
        if (isSidebarOpen) setSidebarOpen(false);
    };
    
    const animationStyles = `
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
      @keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }
      .animate-slideIn { animation: slideIn 0.3s ease-out forwards; }
      @keyframes shimmer { 0% { background-position: -1000px 0; } 100% { background-position: 1000px 0; } }
      .shimmer { background: linear-gradient(to right, #f0f0f0 4%, #e0e0e0 25%, #f0f0f0 36%); background-size: 2000px 100%; animation: shimmer 1.5s infinite; }
    `;

    if (loading) return <SkeletonLoader />;
    if (error) return <div className="min-h-screen flex items-center justify-center bg-red-50 text-lg text-red-600 font-medium p-4 text-center">Error: {error}</div>;

    const SidebarContent = () => (
        <>
            <div className="p-4 border-b border-slate-200/80">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><SearchIcon /></div>
                    <input type="text" placeholder="Search by name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
            </div>
            <CollapsibleFilter title="Filters">
                <div className="space-y-3">
                    <select value={selectedUniversity} onChange={e => setSelectedUniversity(e.target.value)} className="w-full text-sm bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        {universities.map(u => <option key={u} value={u}>{u === "All" ? "All Universities" : u}</option>)}
                    </select>
                     <select value={selectedBranch} onChange={e => setSelectedBranch(e.target.value)} className="w-full text-sm bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        {branches.map(b => <option key={b} value={b}>{b === "All" ? "All Branches" : b}</option>)}
                    </select>
                </div>
            </CollapsibleFilter>
            <div className="overflow-y-auto flex-grow">
                {filteredColleges.length > 0 ? (
                    <ul>
                        {filteredColleges.map(college => (
                            <li key={college._id}>
                                <button onClick={() => handleSelectCollege(college)} className={`w-full text-left p-4 transition-colors duration-150 border-l-4 ${selectedCollege?._id === college._id ? 'bg-indigo-50 text-indigo-800 border-indigo-500' : 'text-slate-700 hover:bg-slate-100 border-transparent'}`}>
                                    <h3 className="font-semibold text-sm">{college.name}</h3>
                                    <p className="text-xs text-slate-500 mt-1">{college.university}</p>
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="p-8 text-slate-500 text-center text-sm">No colleges match your criteria.</p>
                )}
            </div>
        </>
    );

    return (
        <>
            <style>{animationStyles}</style>
            <div className="h-[90vh] font-sans bg-slate-50 flex overflow-hidden mt-20">
                {/* Desktop Sidebar */}
                <aside className="hidden md:flex w-full md:w-1/3 lg:w-1/4 h-full bg-white border-r border-slate-200 flex-col">
                    <SidebarContent />
                </aside>
                
                {/* Mobile Sidebar */}
                {isSidebarOpen && <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden" onClick={() => setSidebarOpen(false)}></div>}
                <aside className={`fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white shadow-xl z-50 flex flex-col transform transition-transform md:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                   <div className="flex justify-between items-center p-4 border-b">
                     <h2 className="text-lg font-bold">Colleges</h2>
                     <button onClick={() => setSidebarOpen(false)} className="text-slate-500 hover:text-slate-800 p-1 rounded-full"><XIcon /></button>
                   </div>
                   <SidebarContent />
                </aside>
                
                <main className="w-full h-full flex flex-col">
                     <div className="p-3 border-b bg-white md:hidden flex items-center gap-4 sticky top-0 z-10">
                        <button onClick={() => setSidebarOpen(true)} className="text-slate-600"><MenuIcon /></button>
                        <div>
                             <h1 className="text-base font-bold text-slate-800 leading-tight">{selectedCollege?.name || "Explore Colleges"}</h1>
                             <p className="text-xs text-slate-500">{selectedCollege?.university}</p>
                        </div>
                    </div>
                    <CollegeDetails college={selectedCollege} animationKey={animationKey} />
                </main>
            </div>
        </>
    );
}


