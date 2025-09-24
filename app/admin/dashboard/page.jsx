"use client";
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    FaUsers, FaUniversity, FaBook, FaSearch, FaUserCircle, FaTimes, FaSpinner,
    FaExclamationTriangle, FaPlus, FaEdit, FaTrash, FaExternalLinkAlt, FaCloudUploadAlt,
    FaMapMarkerAlt, FaEnvelope, FaLink, FaPhone, FaBuilding, FaClipboardList, FaCheckCircle,
    FaClock, FaCalendarAlt, FaTransgender, FaSchool, FaGraduationCap, FaUserShield
} from 'react-icons/fa';

// --- Configuration for Resource Categories (used in the form) ---
const TABS_CONFIG = {
    'B.Tech': ['All', 'Computer Science', 'Mechanical', 'Civil', 'Electrical', 'Chemical'],
    'B.Sc': ['All', 'Physics', 'Chemistry', 'Biology', 'IT', 'Maths'],
    'B.Com': ['All', 'Finance', 'Accounting', 'Marketing', 'Economics'],
    'B.A.': ['All', 'History', 'Psychology', 'Economics', 'Political Science', 'Law'],
    'Vocational': ['All', 'Digital Marketing', 'Graphic Design', 'Hospitality', 'Healthcare Tech'],
    'Masters': ['All', 'M.Tech', 'MBA', 'M.Sc', 'M.A.'],
    'PhD': ['All', 'Research', 'Statistics'],
    'BCA': ['All'],
};

// --- Reusable Components ---
const LoadingSpinner = () => <div className="flex justify-center p-10"><FaSpinner className="animate-spin text-3xl text-indigo-500" /></div>;
const ErrorDisplay = ({ error }) => <div className="text-red-600 bg-red-100 p-4 rounded-lg"><FaExclamationTriangle className="inline mr-2" /> Error: {error}</div>;
const Modal = ({ children, widthClass = 'max-w-2xl' }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
        <div className={`bg-white w-full ${widthClass} max-h-[90vh] rounded-2xl shadow-2xl flex flex-col`}>
            {children}
        </div>
    </div>
);
const FormInput = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
        <input {...props} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg shadow-inner focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition" />
    </div>
);
const FormSelect = ({ label, children, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
        <select {...props} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg shadow-inner focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition appearance-none">
            {children}
        </select>
    </div>
);


// --- Main Dashboard Component ---
export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('users');
    const tabs = [
        { id: 'users', label: 'User Management', icon: <FaUsers /> },
        { id: 'colleges', label: 'College Management', icon: <FaUniversity /> },
        { id: 'resources', label: 'Resource Management', icon: <FaBook /> },
    ];

    return (
        <div className="h-[90vh] p-4 sm:p-6 lg:p-8 font-sans mt-18">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8  bg-white p-3 rounded-3xl">
                    <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Admin Dashboard</h1>
                    <p className="text-slate-500 mt-2">A central hub for managing your platform's data and users.</p>
                </header>

                <div className="mb-8">
                    <div className="bg-white/70 backdrop-blur-lg rounded-full p-2 inline-flex items-center gap-2 border border-slate-200/80 shadow-sm">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`whitespace-nowrap py-2 px-5 rounded-full font-semibold text-sm flex items-center gap-2 transition-colors duration-300 ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'}`}
                            >
                                {tab.icon} {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <main className="animate-fadeIn">
                    {activeTab === 'users' && <UserManagement />}
                    {activeTab === 'colleges' && <CollegeManagement />}
                    {activeTab === 'resources' && <ResourceManagement />}
                </main>
            </div>
        </div>
    );
}

// --- 1. User Management Component ---
function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // --- Components specific to User Management are now nested here ---

    // --- User Card and Modals Component ---
    const UserCardAndModals = ({ user, details }) => {
        const [detailsModalOpen, setDetailsModalOpen] = useState(false);
        const [assessmentModalOpen, setAssessmentModalOpen] = useState(false);
        const [assessmentData, setAssessmentData] = useState(null);
        const [isLoadingAssessment, setIsLoadingAssessment] = useState(false);
        const [assessmentError, setAssessmentError] = useState(null);

        const handleViewAssessment = async () => {
            setAssessmentModalOpen(true);
            setIsLoadingAssessment(true);
            setAssessmentError(null);

            try {
                const response = await fetch(`/api/assessment?userId=${user.userId}`);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Could not fetch assessment data.");
                }
                const data = await response.json();
                setAssessmentData(data.answers);
            } catch (err) {
                setAssessmentError(err.message);
            } finally {
                setIsLoadingAssessment(false);
            }
        };

        return (
            <>
                <div
                    className="bg-white rounded-2xl shadow-lg border border-slate-200/80 p-6 flex flex-col text-center items-center transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                    onClick={() => setDetailsModalOpen(true)}
                >
                    {user.imageUrl ? (
                        <img src={user.imageUrl} alt={user.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow-md" />
                    ) : (
                        <FaUserCircle className="w-24 h-24 text-slate-300 mx-auto mb-4" />
                    )}
                    <h3 className="font-bold text-slate-800 text-lg">{user.name}</h3>
                    <p className="text-slate-500 text-sm truncate w-full">{user.email}</p>
                    <div className="mt-4 flex items-center gap-4">
                        <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-3 py-1 rounded-full capitalize">
                            {user.role || "N/A"}
                        </span>
                        {user.courseInterested && (
                            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                                {user.courseInterested}
                            </span>
                        )}

                    </div>
                </div>

                <UserDetailsModal user={user} isOpen={detailsModalOpen} onClose={() => setDetailsModalOpen(false)} onViewAssessment={handleViewAssessment} />
                <AssessmentModal isOpen={assessmentModalOpen} onClose={() => setAssessmentModalOpen(false)} isLoading={isLoadingAssessment} error={assessmentError} data={assessmentData} userName={user.name} />
            </>
        );
    };

    // --- User Details Modal Component ---
    const UserDetailsModal = ({ user, isOpen, onClose, onViewAssessment }) => {
        if (!isOpen) return null;
        return (
            <Modal widthClass="max-w-2xl">
                <div className="relative p-8 text-center bg-gradient-to-br from-slate-100 to-white rounded-t-2xl border-b border-slate-200">
                    <button className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 p-2 rounded-full transition-colors" onClick={onClose}>
                        <FaTimes size={20} />
                    </button>
                    {user.imageUrl ? <img src={user.imageUrl} alt={user.name} className="w-28 h-28 rounded-full mx-auto mb-4 border-4 border-white shadow-lg" /> : <FaUserCircle className="w-28 h-28 text-slate-300 mx-auto mb-4" />}
                    <h2 className="text-3xl font-bold text-slate-800">{user.name}</h2>
                    <p className="text-slate-600 mt-1">{user.email}</p>
                </div>
                <div className="p-8 overflow-y-auto space-y-8">
                    <PersonalDetailsSection user={user} />
                    <EducationSection user={user} />
                </div>
                <div className="p-4 bg-slate-100 border-t border-slate-200 mt-auto rounded-b-2xl">
                    <button onClick={onViewAssessment} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700 transition-all">
                        <FaClipboardList /> View Assessment Answers
                    </button>
                </div>
            </Modal>
        );
    };

    // --- Assessment Answers Modal Component ---
    const AssessmentModal = ({ isOpen, onClose, isLoading, error, data, userName }) => {
        if (!isOpen) return null;
        const formatCheckboxAnswers = (answerObject) => {
            if (!answerObject) return "N/A";
            const selected = Object.entries(answerObject).filter(([, value]) => value).map(([key]) => key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()));
            return selected.length > 0 ? selected.join(', ') : "No preference selected";
        };
        const AnswerItem = ({ question, answer }) => (
            <div>
                <p className="text-sm font-semibold text-slate-700">{question}</p>
                <p className="text-slate-800 mt-1 pl-4 border-l-2 border-indigo-100">{answer || "N/A"}</p>
            </div>
        );
        return (
            <Modal widthClass="max-w-3xl">
                <header className="flex items-center justify-between p-5 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-slate-800">Assessment for <span className="text-indigo-600">{userName}</span></h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100"><FaTimes className="text-slate-500" /></button>
                </header>
                <div className="p-8 overflow-y-auto bg-slate-50">
                    {isLoading && <div className="flex justify-center items-center h-40"><FaSpinner className="animate-spin text-3xl text-indigo-500" /></div>}
                    {error && <ErrorDisplay error={error} />}
                    {data && (
                        <div className="space-y-8">
                            <AnswerSection title="Academics & Skills">
                                <AnswerItem question="What were your favorite subjects in 11th and 12th, and what interested you most?" answer={data.favoriteSubjects} />
                                <AnswerItem question="How do you prefer to learn?" answer={formatCheckboxAnswers(data.learningStyle)} />
                                <AnswerItem question="Describe a significant academic project or task you've worked on." answer={data.academicProject} />
                                <AnswerItem question="What was your role in the project?" answer={data.projectRole} />
                                <AnswerItem question="What challenges did you face and how did you overcome them?" answer={data.projectChallenges} />
                                <AnswerItem question="What specific technical skills do you have?" answer={data.technicalSkills} />
                                <AnswerItem question="What are your biggest areas for professional growth?" answer={data.professionalGrowthAreas} />
                                <AnswerItem question="How do you stay up-to-date with new developments in your field?" answer={data.stayingUpToDate} />
                            </AnswerSection>
                            <AnswerSection title="Career Aspirations">
                                <AnswerItem question="What does 'success' mean to you personally?" answer={data.successMeaning} />
                                <AnswerItem question="Where do you realistically see yourself in five years?" answer={data.fiveYearPlan} />
                                <AnswerItem question="What are the most important values in a future job?" answer={formatCheckboxAnswers(data.jobValues)} />
                                <AnswerItem question="What are the primary challenges or opportunities in the industry you want to enter?" answer={data.industryChallenges} />
                                <AnswerItem question="What kind of company culture are you looking for?" answer={data.companyCulture} />
                            </AnswerSection>
                            <AnswerSection title="Personal Interests">
                                <AnswerItem question="Besides academics, what do you enjoy doing in your spare time?" answer={data.hobbies} />
                                <AnswerItem question="Why is this hobby or interest important to you?" answer={data.hobbyImportance} />
                                <AnswerItem question="How has this hobby influenced your perspective or academic work?" answer={data.hobbyInfluence} />
                            </AnswerSection>
                            <AnswerSection title="Institute Selection Criteria">
                                <AnswerItem question="1st Priority when choosing a college:" answer={data.instituteRanking?.rank1} />
                                <AnswerItem question="2nd Priority when choosing a college:" answer={data.instituteRanking?.rank2} />
                                <AnswerItem question="3rd Priority when choosing a college:" answer={data.instituteRanking?.rank3} />
                            </AnswerSection>
                        </div>
                    )}
                </div>
            </Modal>
        );
    };
    const AnswerSection = ({ title, children }) => (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">{title}</h3>
            <div className="space-y-4">{children}</div>
        </div>
    );
    const DetailItem = ({ icon, label, value }) => (
        <div className="flex items-start gap-4 p-3 bg-slate-100/70 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm">{icon}</div>
            <div>
                <p className="text-sm text-slate-500">{label}</p>
                <p className="font-semibold text-slate-800 capitalize">{value || "N/A"}</p>
            </div>
        </div>
    );
    const EducationDetail = ({ level, details }) => {
        if (!details || !details.instituteName) return null;
        return (
            <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm">
                <h4 className="font-bold text-indigo-700 capitalize mb-3 flex items-center gap-2">
                    {level === 'graduation' ? <FaGraduationCap /> : <FaSchool />} {level}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-slate-600">
                    <p><strong>Institute:</strong> {details.instituteName || "N/A"}</p>
                    <p><strong>Year:</strong> {details.passingYear || "N/A"}</p>
                    <p><strong>Board:</strong> {details.board || "N/A"}</p>
                    <p><strong>Grade:</strong> {details.grade || "N/A"}</p>
                    {/* {level === "twelfth" && <p><strong>Stream:</strong> {details.stream || "N/A"}</p>}
                    <p><strong>City:</strong> {details.city || "N/A"}</p> */}
                </div>
            </div>
        );
    };
    const PersonalDetailsSection = ({ user }) => (
        <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4">Personal Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DetailItem icon={<FaUserShield className="text-blue-500" />} label="Role" value={user.role} />
                <DetailItem icon={user.hasCompletedOnboarding ? <FaCheckCircle className="text-green-500" /> : <FaClock className="text-amber-500" />} label="Onboarding" value={user.hasCompletedOnboarding ? "Completed" : "Pending"} />
                {user.mobile && <DetailItem icon={<FaPhone className="text-green-500" />} label="Mobile" value={user.mobile} />}
                {user.city && <DetailItem icon={<FaMapMarkerAlt className="text-red-500" />} label="City" value={user.city} />}
                {user.dob && <DetailItem icon={<FaCalendarAlt className="text-purple-500" />} label="Date of Birth" value={new Date(user.dob).toLocaleDateString('en-IN')} />}
                {user.gender && <DetailItem icon={<FaTransgender className="text-pink-500" />} label="Gender" value={user.gender} />}
                {user.courseInterested && <DetailItem icon={<FaBook className="text-indigo-500" />} label="Interested Course" value={user.courseInterested} />}
            </div>
        </div>
    );
    const EducationSection = ({ user }) => {
        const hasEducation = user.educationDetails?.tenth?.instituteName || user.educationDetails?.twelfth?.instituteName || user.educationDetails?.graduation?.instituteName;
        if (!hasEducation) return null;
        return (
            <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4">Educational Background</h3>
                <div className="space-y-4">
                    <EducationDetail level="tenth" details={user.educationDetails?.tenth} />
                    <EducationDetail level="twelfth" details={user.educationDetails?.twelfth} />
                    <EducationDetail level="graduation" details={user.educationDetails?.graduation} />
                </div>
            </div>
        );
    };

    // Main render logic for UserManagement
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/users');
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setUsers(data);
            } catch (err) { setError(err.message); } finally { setLoading(false); }
        };
        fetchUsers();
    }, []);

    const filteredUsers = useMemo(() => {
        if (!searchTerm) return users;
        return users.filter(user =>
            (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.role || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorDisplay error={error} />;

    return (
        <div>
            <div className="relative mb-6">
                <FaSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Search by name, email, or role..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-full shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredUsers.map((user) => (
                    <UserCardAndModals key={user._id} user={user} />
                ))}
            </div>
        </div>
    );
}


// --- 3. College Management Component ---
const CollegeCard = ({ college, onEdit, onDelete }) => (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200/80 flex flex-col transform hover:-translate-y-1 transition-all duration-300">
        <div className="p-6">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-slate-800 text-lg">{college.name}</h3>
                    <p className="text-indigo-600 text-sm font-medium">{college.university}</p>
                </div>
                <div className="flex-shrink-0 flex gap-2">
                    <button onClick={onEdit} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition-colors"><FaEdit /></button>
                    <button onClick={onDelete} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-red-500 transition-colors"><FaTrash /></button>
                </div>
            </div>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
                {college.address && <p className="flex items-center gap-2"><FaMapMarkerAlt className="text-slate-400" /> {college.address}</p>}
                {college.email && <p className="flex items-center gap-2"><FaEnvelope className="text-slate-400" /> {college.email}</p>}
                {college.website && <a href={college.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline"><FaLink className="text-slate-400" /> Visit Website</a>}
            </div>
        </div>
        <div className="bg-slate-50/80 p-4 border-t border-slate-200/80 mt-auto">
            <span className="text-xs font-semibold bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">{college.branches?.length || 0} Branches</span>
        </div>
    </div>
);

function CollegeManagement() {
    const [colleges, setColleges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCollege, setEditingCollege] = useState(null);

    const fetchColleges = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/colleges');
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch college data.');
            }
            const result = await response.json();
            setColleges(result.data);
        } catch (err) { setError(err.message); } finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchColleges(); }, [fetchColleges]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formValues = Object.fromEntries(formData.entries());
        const payload = editingCollege ? { ...editingCollege, ...formValues } : formValues;

        const url = editingCollege ? `/api/colleges/${editingCollege._id}` : '/api/colleges';
        const method = editingCollege ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save college.');
            }
            await fetchColleges();
            closeModal();
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    const handleDelete = async (collegeId) => {
        if (window.confirm('Are you sure you want to delete this college?')) {
            try {
                const response = await fetch(`/api/colleges/${collegeId}`, { method: 'DELETE' });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to delete college.');
                }
                await fetchColleges();
            } catch (err) {
                alert(`Error: ${err.message}`);
            }
        }
    };

    const openModal = (college = null) => {
        setEditingCollege(college);
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setEditingCollege(null);
        setIsModalOpen(false);
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorDisplay error={error} />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-700">Colleges</h2>
                <button onClick={() => openModal()} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-full shadow-md hover:bg-indigo-700 transition-transform hover:scale-105">
                    <FaPlus /> Add College
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {colleges.map(college => (
                    <CollegeCard
                        key={college._id}
                        college={college}
                        onEdit={() => openModal(college)}
                        onDelete={() => handleDelete(college._id)}
                    />
                ))}
            </div>
            {isModalOpen && (
                <Modal>
                    <header className="flex items-center justify-between p-5 border-b border-slate-200">
                        <h2 className="text-xl font-bold text-slate-800">{editingCollege ? 'Edit College' : 'Add New College'}</h2>
                        <button onClick={closeModal} className="p-2 rounded-full hover:bg-slate-100"><FaTimes className="text-slate-500" /></button>
                    </header>
                    <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-4">
                        <FormInput label="College Name" name="name" defaultValue={editingCollege?.name} required />
                        <FormInput label="Address" name="address" defaultValue={editingCollege?.address} />
                        <FormInput label="Contact No" name="contactNo" defaultValue={editingCollege?.contactNo} />
                        <FormInput label="Email" name="email" type="email" defaultValue={editingCollege?.email} />
                        <FormInput label="Website" name="website" type="url" defaultValue={editingCollege?.website} />
                        <FormInput label="University" name="university" defaultValue={editingCollege?.university} />
                        <div className="pt-4 flex justify-end gap-3">
                            <button type="button" onClick={closeModal} className="px-4 py-2 bg-slate-200 text-slate-800 font-semibold rounded-lg hover:bg-slate-300">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">{editingCollege ? 'Update' : 'Create'}</button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
}

// --- 3. Resource Management Component ---
const ResourceCard = ({ resource, onEdit, onDelete }) => (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200/80 flex flex-col overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
        {resource.imageUrl ? (
            <img src={resource.imageUrl} alt={resource.title} className="w-full h-40 object-cover" />
        ) : (
            <div className="w-full h-40 bg-slate-100 flex items-center justify-center text-slate-400">
                <FaBook className="text-4xl" />
            </div>
        )}
        <div className="p-5 flex flex-col flex-grow">
            <div className="flex justify-between items-start">
                <span className="text-xs font-semibold bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full self-start">{resource.category} › {resource.subCategory}</span>
                <div className="flex-shrink-0 flex gap-1">
                    <button onClick={onEdit} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition-colors"><FaEdit /></button>
                    <button onClick={onDelete} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-red-500 transition-colors"><FaTrash /></button>
                </div>
            </div>
            <h3 className="font-bold text-slate-800 text-lg mt-3">{resource.title}</h3>
            <p className="text-slate-600 text-sm mt-1 flex-grow">{resource.description}</p>
        </div>
        <div className="bg-slate-50/80 p-4 border-t border-slate-200/80 mt-auto">
            <a href={resource.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800">
                Visit Resource <FaExternalLinkAlt />
            </a>
        </div>
    </div>
);


function ResourceManagement() {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingResource, setEditingResource] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchResources = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/resources');
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch resource data.');
            }
            const result = await response.json();
            setResources(result.data);
        } catch (err) { setError(err.message); } finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchResources(); }, [fetchResources]);

    useEffect(() => {
        if (editingResource) {
            setSelectedCategory(editingResource.category);
            setImagePreview(editingResource.imageUrl);
        } else {
            setSelectedCategory(Object.keys(TABS_CONFIG)[0] || '');
            setImagePreview('');
        }
    }, [editingResource]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        let finalImageUrl = editingResource?.imageUrl || '';

        if (imageFile) {
            try {
                const formData = new FormData();
                formData.append('file', imageFile);

                const uploadResponse = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!uploadResponse.ok) {
                    const errorData = await uploadResponse.json();
                    throw new Error(errorData.message || 'Image upload failed.');
                }
                const uploadResult = await uploadResponse.json();
                finalImageUrl = uploadResult.url;
            } catch (err) {
                alert(`Error uploading image: ${err.message}`);
                setIsSubmitting(false);
                return;
            }
        }

        const form = e.target;
        const payload = {
            title: form.title.value,
            description: form.description.value,
            category: form.category.value,
            subCategory: form.subCategory.value,
            link: form.link.value,
            imageUrl: finalImageUrl,
        };

        const url = editingResource ? `/api/resources/${editingResource._id}` : '/api/resources';
        const method = editingResource ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save resource.');
            }
            await fetchResources();
            closeModal();
        } catch (err) {
            alert(`Error saving resource: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (resourceId) => {
        if (window.confirm('Are you sure you want to delete this resource?')) {
            try {
                const response = await fetch(`/api/resources/${resourceId}`, { method: 'DELETE' });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to delete resource.');
                }
                await fetchResources();
            } catch (err) {
                alert(`Error: ${err.message}`);
            }
        }
    };

    const openModal = (resource = null) => {
        setEditingResource(resource);
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setEditingResource(null);
        setIsModalOpen(false);
        setImageFile(null);
        setImagePreview('');
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorDisplay error={error} />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-700">Learning Resources</h2>
                <button onClick={() => openModal()} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-full shadow-md hover:bg-indigo-700 transition-transform hover:scale-105">
                    <FaPlus /> Add Resource
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {resources.map(resource => (
                    <ResourceCard
                        key={resource._id}
                        resource={resource}
                        onEdit={() => openModal(resource)}
                        onDelete={() => handleDelete(resource._id)}
                    />
                ))}
            </div>
            {isModalOpen && (
                <Modal>
                    <header className="flex items-center justify-between p-5 border-b border-slate-200">
                        <h2 className="text-xl font-bold text-slate-800">{editingResource ? 'Edit Resource' : 'Add New Resource'}</h2>
                        <button onClick={closeModal} className="p-2 rounded-full hover:bg-slate-100"><FaTimes className="text-slate-500" /></button>
                    </header>
                    <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-4">
                        <FormInput label="Title" name="title" defaultValue={editingResource?.title} required />
                        <FormInput label="Description" name="description" defaultValue={editingResource?.description} required />
                        <div className="grid grid-cols-2 gap-4">
                            <FormSelect label="Category" name="category" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} required>
                                {Object.keys(TABS_CONFIG).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </FormSelect>
                            <FormSelect label="Sub-Category" name="subCategory" defaultValue={editingResource?.subCategory} required>
                                {TABS_CONFIG[selectedCategory]?.map(subCat => <option key={subCat} value={subCat}>{subCat}</option>)}
                            </FormSelect>
                        </div>
                        <FormInput label="Resource Link (URL)" name="link" type="url" defaultValue={editingResource?.link} required />

                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Resource Image</label>
                            <div className="mt-1 flex items-center gap-4">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-24 h-16 object-cover rounded-lg shadow-md" />
                                ) : (
                                    <div className="w-24 h-16 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                                        <FaCloudUploadAlt className="text-3xl" />
                                    </div>
                                )}
                                <input id="image-upload" name="imageFile" type="file" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <button type="button" onClick={closeModal} className="px-4 py-2 bg-slate-200 text-slate-800 font-semibold rounded-lg hover:bg-slate-300">Cancel</button>
                            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 flex items-center gap-2">
                                {isSubmitting && <FaSpinner className="animate-spin" />}
                                {isSubmitting ? (editingResource ? 'Updating...' : 'Creating...') : (editingResource ? 'Update' : 'Create')}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
}

const UserCard = ({ user }) => {
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [assessmentModalOpen, setAssessmentModalOpen] = useState(false);
    const [assessmentData, setAssessmentData] = useState(null);
    const [isLoadingAssessment, setIsLoadingAssessment] = useState(false);
    const [assessmentError, setAssessmentError] = useState(null);

    const handleViewAssessment = async () => {
        // Open the modal immediately and show loading state
        setAssessmentModalOpen(true);
        setIsLoadingAssessment(true);
        setAssessmentError(null);

        try {
            const response = await fetch(`/api/assessment?userId=${user.userId}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Could not fetch assessment data.");
            }
            const data = await response.json();
            setAssessmentData(data.answers);
        } catch (err) {
            setAssessmentError(err.message);
        } finally {
            setIsLoadingAssessment(false);
        }
    };

    return (
        <>
            {/* The main card visible on the dashboard */}
            <div
                className="bg-white rounded-2xl shadow-lg border border-slate-200/80 p-6 flex flex-col text-center items-center transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                onClick={() => setDetailsModalOpen(true)}
            >
                {user.imageUrl ? (
                    <img
                        src={user.imageUrl}
                        alt={user.name}
                        className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow-md"
                    />
                ) : (
                    <FaUserCircle className="w-24 h-24 text-slate-300 mx-auto mb-4" />
                )}
                <h3 className="font-bold text-slate-800 text-lg">{user.name}</h3>
                <p className="text-slate-500 text-sm truncate w-full">{user.email}</p>
                <div className="mt-4 flex items-center gap-4">
                    <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-3 py-1 rounded-full capitalize">
                        {user.role || "N/A"}
                    </span>
                    <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${user.hasCompletedOnboarding
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                            }`}
                    >
                        {user.hasCompletedOnboarding ? "Onboarded" : "Pending"}
                    </span>
                </div>
            </div>

            {/* Renders the two modals when their respective states are true */}
            <UserDetailsModal
                user={user}
                isOpen={detailsModalOpen}
                onClose={() => setDetailsModalOpen(false)}
                onViewAssessment={handleViewAssessment}
            />
            <AssessmentModal
                isOpen={assessmentModalOpen}
                onClose={() => setAssessmentModalOpen(false)}
                isLoading={isLoadingAssessment}
                error={assessmentError}
                data={assessmentData}
                userName={user.name}
            />
        </>
    );
};

// --- User Details Modal Component ---
const UserDetailsModal = ({ user, isOpen, onClose, onViewAssessment }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-slate-50 rounded-2xl shadow-2xl w-[600px] max-w-full relative max-h-[90vh] flex flex-col">
                <div className="relative p-8 text-center bg-gradient-to-br from-slate-100 to-white rounded-t-2xl border-b border-slate-200">
                    <button className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 p-2 rounded-full transition-colors" onClick={onClose}>
                        <FaTimes size={20} />
                    </button>
                    {user.imageUrl ? (
                        <img src={user.imageUrl} alt={user.name} className="w-28 h-28 rounded-full mx-auto mb-4 border-4 border-white shadow-lg" />
                    ) : (
                        <FaUserCircle className="w-28 h-28 text-slate-300 mx-auto mb-4" />
                    )}
                    <h2 className="text-3xl font-bold text-slate-800">{user.name}</h2>
                    <p className="text-slate-600 mt-1">{user.email}</p>
                </div>

                <div className="p-8 overflow-y-auto space-y-8">
                    {/* Personal & Education details rendered here... */}
                    <PersonalDetailsSection user={user} />
                    <EducationSection user={user} />
                </div>

                <div className="p-4 bg-slate-100 border-t border-slate-200 mt-auto rounded-b-2xl">
                    <button
                        onClick={onViewAssessment}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700 transition-all"
                    >
                        <FaClipboardList /> View Assessment Answers
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Assessment Answers Modal Component ---
const AssessmentModal = ({ isOpen, onClose, isLoading, error, data, userName }) => {
    if (!isOpen) return null;

    // Helper to format answers that are objects of booleans
    const formatCheckboxAnswers = (answerObject) => {
        if (!answerObject) return "N/A";
        const selected = Object.entries(answerObject)
            .filter(([, value]) => value)
            .map(([key]) => key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())); // Format camelCase to normal text
        return selected.length > 0 ? selected.join(', ') : "No preference selected";
    };

    const AnswerItem = ({ question, answer }) => (
        <div>
            <p className="text-sm font-semibold text-indigo-700">{question}</p>
            <p className="text-slate-800 mt-1 pl-4 border-l-2 border-indigo-100">{answer || "N/A"}</p>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60] animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-[700px] max-w-full relative max-h-[90vh] flex flex-col">
                <header className="flex items-center justify-between p-5 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-slate-800">Assessment for <span className="text-indigo-600">{userName}</span></h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100"><FaTimes className="text-slate-500" /></button>
                </header>

                <div className="p-8 overflow-y-auto">
                    {isLoading && <div className="flex justify-center items-center h-40"><FaSpinner className="animate-spin text-3xl text-indigo-500" /></div>}
                    {error && <div className="text-red-600 bg-red-100 p-4 rounded-lg text-center"><FaExclamationTriangle className="inline mr-2" /> {error}</div>}
                    {data && (
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Academics & Skills</h3>
                                <div className="space-y-4">
                                    <AnswerItem question="What were your favorite subjects in 11th and 12th, and what interested you most?" answer={data.favoriteSubjects} />
                                    <AnswerItem question="How do you prefer to learn?" answer={formatCheckboxAnswers(data.learningStyle)} />
                                    <AnswerItem question="Describe a significant academic project or task you've worked on." answer={data.academicProject} />
                                    <AnswerItem question="What was your role in the project?" answer={data.projectRole} />
                                    <AnswerItem question="What challenges did you face and how did you overcome them?" answer={data.projectChallenges} />
                                    <AnswerItem question="What specific technical skills do you have?" answer={data.technicalSkills} />
                                    _MODIFIED_
                                    <AnswerItem question="What are your biggest areas for professional growth?" answer={data.professionalGrowthAreas} />
                                    <AnswerItem question="How do you stay up-to-date with new developments in your field?" answer={data.stayingUpToDate} />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Career Aspirations</h3>
                                <div className="space-y-4">
                                    <AnswerItem question="What does 'success' mean to you personally?" answer={data.successMeaning} />
                                    <AnswerItem question="Where do you realistically see yourself in five years?" answer={data.fiveYearPlan} />
                                    <AnswerItem question="What are the most important values in a future job?" answer={formatCheckboxAnswers(data.jobValues)} />
                                    <AnswerItem question="What are the primary challenges or opportunities in the industry you want to enter?" answer={data.industryChallenges} />
                                    <AnswerItem question="What kind of company culture are you looking for?" answer={data.companyCulture} />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Personal Interests</h3>
                                <div className="space-y-4">
                                    <AnswerItem question="Besides academics, what do you enjoy doing in your spare time?" answer={data.hobbies} />
                                    <AnswerItem question="Why is this hobby or interest important to you?" answer={data.hobbyImportance} />
                                    <AnswerItem question="How has this hobby influenced your perspective or academic work?" answer={data.hobbyInfluence} />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Institute Selection Criteria</h3>
                                <div className="space-y-4">
                                    _MODIFIED_
                                    <AnswerItem question="1st Priority when choosing a college:" answer={data.instituteRanking?.rank1} />
                                    <AnswerItem question="2nd Priority when choosing a college:" answer={data.instituteRanking?.rank2} />
                                    <AnswerItem question="3rd Priority when choosing a college:" answer={data.instituteRanking?.rank3} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


// --- Helper components for UserDetailsModal ---
const DetailItem = ({ icon, label, value }) => (
    <div className="flex items-start gap-4 p-3 bg-slate-100/70 rounded-lg">
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm">{icon}</div>
        <div>
            <p className="text-sm text-slate-500">{label}</p>
            <p className="font-semibold text-slate-800 capitalize">{value || "N/A"}</p>
        </div>
    </div>
);

const EducationDetail = ({ level, details }) => {
    if (!details || !details.instituteName) return null;
    return (
        <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm">
            <h4 className="font-bold text-indigo-700 capitalize mb-3 flex items-center gap-2">
                {level === 'graduation' ? <FaGraduationCap /> : <FaSchool />} {level}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-slate-600">
                <p><strong>Institute:</strong> {details.instituteName || "N/A"}</p>
                <p><strong>Year:</strong> {details.passingYear || "N/A"}</p>
                <p><strong>Board:</strong> {details.board || "N/A"}</p>
                <p><strong>Grade:</strong> {details.grade || "N/A"}</p>
                {level === "twelfth" && <p><strong>Stream:</strong> {details.stream || "N/A"}</p>}
                <p><strong>City:</strong> {details.city || "N/A"}</p>
            </div>
        </div>
    );
};

const PersonalDetailsSection = ({ user }) => (
    <div>
        <h3 className="text-lg font-bold text-slate-800 mb-4">Personal Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DetailItem icon={<FaUserShield className="text-blue-500" />} label="Role" value={user.role} />
            <DetailItem icon={user.hasCompletedOnboarding ? <FaCheckCircle className="text-green-500" /> : <FaClock className="text-amber-500" />} label="Onboarding" value={user.hasCompletedOnboarding ? "Completed" : "Pending"} />
            {user.mobile && <DetailItem icon={<FaPhone className="text-green-500" />} label="Mobile" value={user.mobile} />}
            {user.city && <DetailItem icon={<FaMapMarkerAlt className="text-red-500" />} label="City" value={user.city} />}
            {user.dob && <DetailItem icon={<FaCalendarAlt className="text-purple-500" />} label="Date of Birth" value={new Date(user.dob).toLocaleDateString('en-IN')} />}
            {user.gender && <DetailItem icon={<FaTransgender className="text-pink-500" />} label="Gender" value={user.gender} />}
            {user.courseInterested && <DetailItem icon={<FaBook className="text-indigo-500" />} label="Interested Course" value={user.courseInterested} />}
        </div>
    </div>
);

const EducationSection = ({ user }) => {
    const hasEducation = user.educationDetails?.tenth?.instituteName || user.educationDetails?.twelfth?.instituteName || user.educationDetails?.graduation?.instituteName;
    if (!hasEducation) return null;

    return (
        <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4">Educational Background</h3>
            <div className="space-y-4">
                <EducationDetail level="tenth" details={user.educationDetails?.tenth} />
                <EducationDetail level="twelfth" details={user.educationDetails?.twelfth} />
                <EducationDetail level="graduation" details={user.educationDetails?.graduation} />
            </div>
        </div>
    );
};

