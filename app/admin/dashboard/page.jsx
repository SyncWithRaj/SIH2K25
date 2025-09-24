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

// --- Reusable Dashboard Components ---
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

function ScholarshipManagement() {
    // --- Icon & UI Components specific to Scholarship Management ---
    const Spinner = () => <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>;
    const PlusIcon = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" /></svg>;
    const SaveIcon = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M9.25 13.25a.75.75 0 0 0 1.5 0V4.636l2.955 3.129a.75.75 0 0 0 1.09-1.03l-4.25-4.5a.75.75 0 0 0-1.09 0l-4.25 4.5a.75.75 0 1 0 1.09 1.03L9.25 4.636v8.614Z" /><path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" /></svg>;
    const EditIconSch = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" /><path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z" /></svg>;
    const DeleteIconSch = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.58.22-2.365.468a.75.75 0 1 0 .53 1.402l.11-.034h11.451l.11.034a.75.75 0 0 0 .53-1.402c-.785-.248-1.57-.391-2.365-.468v-.443A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clipRule="evenodd" /></svg>;
    const AlertIcon = ({ type }) => {
        const colors = { error: 'text-red-500', success: 'text-green-500' };
        return (<svg className={`w-6 h-6 flex-shrink-0 ${colors[type]}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm-.75-4.75a.75.75 0 0 0 1.5 0V8.25a.75.75 0 0 0-1.5 0v5Zm0-8.25a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z" clipRule="evenodd" /></svg>);
    };
    const EmptyIcon = () => <svg className="w-16 h-16 mx-auto text-slate-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m-1.125 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>;
    const SkeletonCard = () => (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
            <div className="h-3 bg-slate-200 rounded w-full mb-2"></div>
            <div className="h-3 bg-slate-200 rounded w-5/6"></div>
            <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <div className="h-9 w-24 bg-slate-200 rounded-lg"></div>
                <div className="h-9 w-24 bg-slate-200 rounded-lg"></div>
            </div>
        </div>
    );

    const [scholarships, setScholarships] = useState([]);
    const [formData, setFormData] = useState({ name: '', description: '', url: '' });
    const [editingId, setEditingId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState({ message: '', type: '' });

    useEffect(() => { fetchScholarships(); }, []);

    const clearNotification = () => setNotification({ message: '', type: '' });

    // ✅ FIXED: Restored the full implementation for all handler functions
    
    // READ operation
    const fetchScholarships = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/scholarships');
            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Failed to fetch data.');
            }
            setScholarships(data.data);
        } catch (err) {
            setNotification({ message: err.message, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    // Handles input changes for the form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // CREATE and UPDATE operations
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        clearNotification();

        const method = editingId ? 'PUT' : 'POST';
        const url = editingId ? `/api/scholarships/${editingId}` : '/api/scholarships';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Failed to save scholarship.');
            }
            
            setNotification({ message: `Scholarship successfully ${editingId ? 'updated' : 'added'}!`, type: 'success' });
            cancelEdit();
            await fetchScholarships();
        } catch (err) {
            setNotification({ message: err.message, type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Prepares the form for an update
    const handleEdit = (scholarship) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setEditingId(scholarship._id);
        setFormData({ name: scholarship.name, description: scholarship.description, url: scholarship.url });
        clearNotification();
    };
    
    // Resets the form
    const cancelEdit = () => {
        setEditingId(null);
        setFormData({ name: '', description: '', url: '' });
    };

    // DELETE operation
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this scholarship?')) {
            try {
                const res = await fetch(`/api/scholarships/${id}`, { method: 'DELETE' });
                if (!res.ok) throw new Error('Failed to delete.');
                await fetchScholarships();
                setNotification({ message: 'Scholarship deleted successfully.', type: 'success' });
            } catch (err) {
                setNotification({ message: err.message, type: 'error' });
            }
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-8">
            <style>{`@keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } .fade-in-up { animation: fadeInUp 0.4s ease-out forwards; opacity: 0; }`}</style>

            {/* --- Left Column: Sticky Form --- */}
            <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-8 self-start">
                <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className={`p-3 rounded-lg mb-4 ${editingId ? 'bg-indigo-50' : 'bg-slate-50'}`}>
                        <h3 className="text-xl font-semibold text-slate-800">
                            {editingId ? 'Editing Scholarship' : 'Add New Scholarship'}
                        </h3>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">Scholarship Name</label>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required className="w-full bg-slate-50 border-slate-300 rounded-lg p-3 transition duration-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                            <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} required rows="5" className="w-full bg-slate-50 border-slate-300 rounded-lg p-3 transition duration-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                        </div>
                        <div>
                            <label htmlFor="url" className="block text-sm font-medium text-slate-700 mb-1.5">Website URL</label>
                            <input type="url" id="url" name="url" value={formData.url} onChange={handleInputChange} required className="w-full bg-slate-50 border-slate-300 rounded-lg p-3 transition duration-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                        </div>
                        <div className="flex items-center gap-4 pt-2">
                            <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center gap-2 py-2.5 px-5 font-semibold text-white bg-indigo-600 rounded-lg shadow-sm transform transition-all hover:bg-indigo-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:scale-100">
                                {isSubmitting ? <Spinner /> : (editingId ? <><SaveIcon /> Save Changes</> : <><PlusIcon /> Create</>)}
                            </button>
                            {editingId && <button type="button" onClick={cancelEdit} className="py-2.5 px-5 font-semibold text-slate-700 bg-white rounded-lg border border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Cancel</button>}
                        </div>
                    </form>
                    {notification.message && (
                        <div role="alert" className={`mt-5 flex items-start gap-3 text-sm p-4 rounded-lg ${notification.type === 'error' ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
                            <AlertIcon type={notification.type} />
                            <p>{notification.message}</p>
                        </div>
                    )}
                </section>
            </div>

            {/* --- Right Column: Scholarship List --- */}
            <div className="lg:col-span-7 xl:col-span-8 mt-10 lg:mt-0">
                {isLoading ? (
                    <div className="space-y-4">
                        <SkeletonCard /><SkeletonCard /><SkeletonCard />
                    </div>
                ) : scholarships.length > 0 ? (
                    <div className="space-y-4">
                        {scholarships.map((s, index) => (
                            <article key={s._id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 transition-all duration-300 hover:shadow-md hover:border-indigo-300 fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                                    <div className="flex-grow">
                                        <h3 className="text-lg font-semibold text-slate-900">{s.name}</h3>
                                        <p className="text-slate-600 mt-1 text-sm">{s.description}</p>
                                        <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline mt-3 inline-block text-sm font-medium">
                                            Visit Website &rarr;
                                        </a>
                                    </div>
                                    <div className="flex-shrink-0 flex items-center gap-2 self-end sm:self-start">
                                        <button onClick={() => handleEdit(s)} className="inline-flex items-center justify-center w-10 h-10 sm:w-auto sm:h-auto sm:gap-2 sm:py-2 sm:px-4 text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"><EditIconSch /><span className="hidden sm:inline">Edit</span></button>
                                        <button onClick={() => handleDelete(s._id)} className="inline-flex items-center justify-center w-10 h-10 sm:w-auto sm:h-auto sm:gap-2 sm:py-2 sm:px-4 text-sm font-medium bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"><DeleteIconSch /><span className="hidden sm:inline">Delete</span></button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="text-center bg-white p-10 rounded-xl border border-dashed border-slate-300 fade-in-up">
                        <EmptyIcon />
                        <h3 className="mt-4 text-xl font-semibold text-slate-800">No Scholarships Found</h3>
                        <p className="mt-2 text-slate-500">Add your first scholarship using the form on the left.</p>
                    </div>
                )}
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

// --- Main Dashboard Component ---
export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('users');
    const tabs = [
        { id: 'users', label: 'User Management', icon: <FaUsers /> },
        { id: 'colleges', label: 'College Management', icon: <FaUniversity /> },
        { id: 'resources', label: 'Resource Management', icon: <FaBook /> },
        // --- ✨ New Tab Added ---
        { id: 'scholarships', label: 'Scholarship Management', icon: <FaGraduationCap /> },
    ];

    return (
        <div className="h-full bg-slate-100/50 p-4 sm:p-6 lg:p-8 font-sans mt-20">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
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

                <main className="animate-fadeIn bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    {activeTab === 'users' && <UserManagement />}
                    {activeTab === 'colleges' && <CollegeManagement />}
                    {activeTab === 'resources' && <ResourceManagement />}
                    {/* --- ✨ New Component Rendered Here --- */}
                    {activeTab === 'scholarships' && <ScholarshipManagement />}
                </main>
            </div>
        </div>
    );
}