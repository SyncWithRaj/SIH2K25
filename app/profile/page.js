"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

// --- Tab Content Components ---

const YourDetailsTab = ({ data, handleChange }) => (
    <div className="animate-fadeIn space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-4">Your Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input name="name" value={data.name || ''} onChange={handleChange} className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                <input name="mobile" type="tel" value={data.mobile || ''} onChange={handleChange} className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input name="city" value={data.city || ''} onChange={handleChange} className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Course Interested In</label>
                <input name="courseInterested" value={data.courseInterested || ''} onChange={handleChange} className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <select name="gender" value={data.gender || ''} onChange={handleChange} className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
            </div>
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
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-4">Education Details</h2>
            <div className="space-y-8 pt-4">
                {['graduation', 'twelfth', 'tenth'].map(level => (
                    <div key={level} className="p-6 bg-gray-50 border border-gray-200 rounded-xl">
                        <h3 className="font-semibold capitalize mb-4 text-lg text-gray-700">{level} Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input name="instituteName" value={data.educationDetails?.[level]?.instituteName || ''} onChange={(e) => handleNestedChange(level, e)} placeholder="Institute / School Name" className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                            <input name="passingYear" value={data.educationDetails?.[level]?.passingYear || ''} onChange={(e) => handleNestedChange(level, e)} placeholder="Passing Year" className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                            <input name="board" value={data.educationDetails?.[level]?.board || ''} onChange={(e) => handleNestedChange(level, e)} placeholder="Board/University" className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                            <input name="grade" value={data.educationDetails?.[level]?.grade || ''} onChange={(e) => handleNestedChange(level, e)} placeholder="Percentage / Grade" className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
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
    const [notification, setNotification] = useState('');

    useEffect(() => {
        if (isLoaded && user) {
            fetch(`/api/personal-detail?userId=${user.id}`)
                .then(res => res.ok ? res.json() : Promise.reject(res))
                .then(data => setProfile(data))
                .catch(err => console.error("Failed to fetch profile:", err))
                .finally(() => setIsLoading(false));
        }
    }, [isLoaded, user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        setNotification('');
        try {
            const res = await fetch('/api/personal-detail', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, ...profile }),
            });
            if (!res.ok) throw new Error("Failed to save profile");
            setNotification("Profile Saved Successfully!");
        } catch (error) {
            console.error(error);
            setNotification("Error saving profile.");
        } finally {
            setIsSaving(false);
            setTimeout(() => setNotification(''), 3000); // Clear notification after 3 seconds
        }
    };

    const TABS = ['Your Details', 'Education Details'];

    if (!isLoaded || isLoading) {
        return <div className="flex justify-center items-center h-screen bg-gray-100"><p>Loading Profile...</p></div>;
    }
    if (!user) {
        return <div className="flex justify-center items-center h-screen bg-gray-100"><p>Please sign in to view your profile.</p></div>;
    }

    return (
        <div className="flex bg-gray-100 min-h-screen font-sans mt-20">
            <aside className="w-80 bg-white p-8 shadow-lg hidden md:flex flex-col items-center">
                <div className="text-center mb-12 mt-4">
                    <img src={user.imageUrl} alt="Profile" className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white shadow-md" />
                    <h2 className="font-bold text-2xl text-gray-800">{profile.name || user.fullName}</h2>
                    <p className="text-md text-gray-500 mt-1">{user.primaryEmailAddress.emailAddress}</p>
                </div>
                <nav className="space-y-4 w-full">
                    {TABS.map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full text-left py-3 px-5 rounded-lg font-semibold text-md transition-all duration-200 flex items-center ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-gray-200 text-gray-700'}`}>
                            <span className="ml-3">{tab}</span>
                        </button>
                    ))}
                </nav>
            </aside>

            <main className="flex-1 p-4 sm:p-6 lg:p-10">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white p-6 rounded-xl shadow-md mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">Welcome back, {profile.name}!</h1>
                        <p className="text-gray-600 mt-1">Here you can view and update your profile information.</p>
                    </div>

                    <div className="bg-white p-6 sm:p-8 lg:p-12 rounded-2xl shadow-lg">
                        {activeTab === 'Your Details' && <YourDetailsTab data={profile} handleChange={handleChange} />}
                        {activeTab === 'Education Details' && <EducationTab data={profile} handleChange={handleChange} />}

                        <div className="flex justify-end items-center mt-10 pt-6 border-t border-gray-200">
                             {notification && <p className={`mr-4 font-semibold ${notification.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>{notification}</p>}
                            <button onClick={handleSave} disabled={isSaving} className="px-10 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md disabled:bg-indigo-300 disabled:cursor-not-allowed hover:bg-indigo-700 transition-all duration-200">
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
