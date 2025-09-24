"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

// --- SVG Icons ---
const Icon = ({ className = 'w-6 h-6', children }) => <span className={`flex-shrink-0 ${className}`}>{children}</span>;
const UserCircleIcon = () => <Icon><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"></path></svg></Icon>;
const BookOpenIcon = () => <Icon><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253z"></path></svg></Icon>;
const Spinner = () => <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;

// --- UI Components ---

const FormInput = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
        <input {...props} className="mt-1 p-3 w-full border border-slate-300 bg-slate-50/70 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" />
    </div>
);

const FormSelect = ({ label, children, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
        <select {...props} className="mt-1 p-3 w-full border border-slate-300 bg-slate-50/70 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
            {children}
        </select>
    </div>
);

const NotificationToast = ({ message, type }) => {
    if (!message) return null;
    const isError = type === 'error';
    return (
        <div className={`fixed bottom-5 right-5 animate-fadeInUp bg-white shadow-2xl rounded-lg p-4 flex items-center border-l-4 ${isError ? 'border-red-500' : 'border-green-500'}`}>
            <p className={`font-semibold ${isError ? 'text-red-700' : 'text-green-700'}`}>{message}</p>
        </div>
    );
};


// --- Tab Content Components ---

const YourDetailsTab = ({ data, handleChange }) => (
    <div className="animate-fadeIn space-y-6">
        <h2 className="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-4">Your Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <FormInput label="Full Name" name="name" value={data.name || ''} onChange={handleChange} />
            <FormInput label="Mobile Number" name="mobile" type="tel" value={data.mobile || ''} onChange={handleChange} />
            <FormInput label="City" name="city" value={data.city || ''} onChange={handleChange} />
            <FormInput label="Course Interested In" name="courseInterested" value={data.courseInterested || ''} onChange={handleChange} />
            <FormSelect label="Gender" name="gender" value={data.gender || ''} onChange={handleChange}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
            </FormSelect>
        </div>
    </div>
);

const EducationTab = ({ data, handleChange }) => {
    const handleNestedChange = (level, e) => {
        const { name, value } = e.target;
        handleChange({ target: { name: 'educationDetails', value: { ...data.educationDetails, [level]: { ...data.educationDetails?.[level], [name]: value } } } });
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-4">Education Details</h2>
            <div className="space-y-8 pt-4">
                {['graduation', 'twelfth', 'tenth'].map(level => (
                    <div key={level} className="p-6 bg-slate-50/70 border border-slate-200 rounded-xl">
                        <h3 className="font-semibold capitalize mb-4 text-lg text-slate-700">{level} Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput name="instituteName" value={data.educationDetails?.[level]?.instituteName || ''} onChange={(e) => handleNestedChange(level, e)} placeholder="Institute / School Name" />
                            <FormInput name="passingYear" type="number" value={data.educationDetails?.[level]?.passingYear || ''} onChange={(e) => handleNestedChange(level, e)} placeholder="Passing Year" />
                            <FormInput name="board" value={data.educationDetails?.[level]?.board || ''} onChange={(e) => handleNestedChange(level, e)} placeholder="Board/University" />
                            <FormInput name="grade" value={data.educationDetails?.[level]?.grade || ''} onChange={(e) => handleNestedChange(level, e)} placeholder="Percentage / Grade" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
};

export default function ProfilePage() {
    const { user, isLoaded } = useUser();
    const [activeTab, setActiveTab] = useState('Your Details');
    const [profile, setProfile] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [notification, setNotification] = useState({ message: '', type: '' });

    useEffect(() => {
        if (isLoaded && user) {
            setIsLoading(true);
            fetch(`/api/personal-detail?userId=${user.id}`)
                .then(res => {
                    if (!res.ok) {
                         // If user not found (404), it's a new user. Don't throw error.
                        if (res.status === 404) return {}; 
                        return Promise.reject(res);
                    }
                    return res.json();
                })
                .then(data => setProfile(data || {})) // Ensure profile is an object
                .catch(err => {
                    console.error("Failed to fetch profile:", err);
                    setNotification({ message: 'Failed to load profile data.', type: 'error'});
                })
                .finally(() => setIsLoading(false));
        }
    }, [isLoaded, user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        setNotification({ message: '', type: '' });
        
        try {
            const res = await fetch('/api/personal-detail', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, ...profile }),
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to save profile");
            }
            setNotification({ message: "Profile Saved Successfully!", type: "success" });
        } catch (error) {
            console.error(error);
            setNotification({ message: `Error: ${error.message}`, type: "error" });
        } finally {
            setIsSaving(false);
            setTimeout(() => setNotification({ message: '', type: '' }), 3000);
        }
    };

    const TABS = [{ name: 'Your Details', icon: <UserCircleIcon/> }, { name: 'Education Details', icon: <BookOpenIcon/> }];

    if (!isLoaded || isLoading) {
        return <div className="flex justify-center items-center h-screen bg-slate-100"><Spinner /></div>;
    }
    if (!user) {
        return <div className="flex justify-center items-center h-screen bg-slate-100"><p>Please sign in to view your profile.</p></div>;
    }

    return (
        <div className="bg-slate-50 min-h-screen font-sans">
            <div className="flex flex-col md:flex-row mt-20">
                <aside className="w-full md:w-80 bg-white p-6 md:p-8 md:flex flex-col items-center border-b md:border-b-0 md:border-r border-slate-200">
                    <div className="text-center w-full mb-8">
                        <img src={user.imageUrl} alt="Profile" className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white shadow-lg ring-2 ring-indigo-200" />
                        <h2 className="font-bold text-2xl text-slate-800">{profile.name || user.fullName}</h2>
                        <p className="text-md text-slate-500 mt-1">{user.primaryEmailAddress.emailAddress}</p>
                    </div>
                    <nav className="w-full">
                        <div className="md:hidden border-b border-slate-200 mb-4">
                             <div className="flex space-x-2">
                                {TABS.map(tab => (
                                    <button key={tab.name} onClick={() => setActiveTab(tab.name)} className={`flex-1 text-center py-3 px-2 font-semibold text-sm transition-all duration-200 border-b-2 ${activeTab === tab.name ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-600 hover:text-indigo-600'}`}>
                                        {tab.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="hidden md:block space-y-2 w-full">
                            {TABS.map(tab => (
                                <button key={tab.name} onClick={() => setActiveTab(tab.name)} className={`w-full text-left py-3 px-4 rounded-lg font-semibold text-md transition-all duration-200 flex items-center gap-4 ${activeTab === tab.name ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-indigo-100 text-slate-700'}`}>
                                    {tab.icon}
                                    <span>{tab.name}</span>
                                </button>
                            ))}
                        </div>
                    </nav>
                </aside>

                <main className="flex-1 p-4 sm:p-6 lg:p-10">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white p-6 sm:p-8 lg:p-12 rounded-2xl shadow-lg border border-slate-200">
                            {activeTab === 'Your Details' && <YourDetailsTab data={profile} handleChange={handleChange} />}
                            {activeTab === 'Education Details' && <EducationTab data={profile} handleChange={handleChange} />}

                            <div className="flex justify-end items-center mt-10 pt-6 border-t border-slate-200">
                                <button onClick={handleSave} disabled={isSaving} className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md disabled:bg-indigo-300 disabled:cursor-not-allowed hover:bg-indigo-700 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2">
                                    {isSaving && <Spinner />}
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <NotificationToast message={notification.message} type={notification.type} />
        </div>
    );
}

