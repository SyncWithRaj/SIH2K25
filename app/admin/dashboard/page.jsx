"use client";
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  FaUsers, FaUniversity, FaBook, FaSearch, FaUserCircle, FaTimes, FaSpinner,
  FaExclamationTriangle, FaPlus, FaEdit, FaTrash, FaExternalLinkAlt, FaCloudUploadAlt,
  FaMapMarkerAlt, FaEnvelope, FaLink
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
const ErrorDisplay = ({ error }) => <div className="text-red-600 bg-red-100 p-4 rounded-lg"><FaExclamationTriangle className="inline mr-2"/> Error: {error}</div>;
const Modal = ({ children }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col">
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
  const [activeTab, setActiveTab] = useState('resources'); // Default to resources for convenience
  const tabs = [
    { id: 'users', label: 'User Management', icon: <FaUsers /> },
    { id: 'colleges', label: 'College Management', icon: <FaUniversity /> },
    { id: 'resources', label: 'Resource Management', icon: <FaBook /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 font-sans mt-18">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1">Central hub for managing platform data and users.</p>
        </header>

        <div className="mb-6">
          <div className="border-b border-slate-200">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === tab.id ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
        
        <main>
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'colleges' && <CollegeManagement />}
          {activeTab === 'resources' && <ResourceManagement />}
        </main>
      </div>
    </div>
  );
}

// --- 1. User Management Component ---
const UserCard = ({ user }) => (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200/80 p-6 flex flex-col text-center items-center transform hover:-translate-y-1 transition-all duration-300">
        {user.imageUrl ? (
            <img src={user.imageUrl} alt={user.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow-md" />
        ) : (
            <FaUserCircle className="w-24 h-24 text-slate-300 mx-auto mb-4" />
        )}
        <h3 className="font-bold text-slate-800 text-lg">{user.name}</h3>
        <p className="text-slate-500 text-sm truncate w-full">{user.email}</p>
        <div className="mt-4 flex items-center gap-4">
            <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-3 py-1 rounded-full capitalize">{user.role || 'N/A'}</span>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${user.hasCompletedOnboarding ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                {user.hasCompletedOnboarding ? 'Onboarded' : 'Pending'}
            </span>
        </div>
    </div>
);

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
 
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
                <UserCard key={user._id} user={user} />
            ))}
        </div>
      </div>
    );
}

// --- 2. College Management Component ---
const CollegeCard = ({ college, onEdit, onDelete }) => (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200/80 flex flex-col transform hover:-translate-y-1 transition-all duration-300">
        <div className="p-6">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-slate-800 text-lg">{college.name}</h3>
                    <p className="text-indigo-600 text-sm font-medium">{college.university}</p>
                </div>
                <div className="flex-shrink-0 flex gap-2">
                     <button onClick={onEdit} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition-colors"><FaEdit/></button>
                     <button onClick={onDelete} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-red-500 transition-colors"><FaTrash/></button>
                </div>
            </div>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
                {college.address && <p className="flex items-center gap-2"><FaMapMarkerAlt className="text-slate-400"/> {college.address}</p>}
                {college.email && <p className="flex items-center gap-2"><FaEnvelope className="text-slate-400"/> {college.email}</p>}
                {college.website && <a href={college.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline"><FaLink className="text-slate-400"/> Visit Website</a>}
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
                <button onClick={() => openModal()} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700">
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
                <FaBook className="text-4xl"/>
            </div>
        )}
        <div className="p-5 flex flex-col flex-grow">
            <div className="flex justify-between items-start">
                <span className="text-xs font-semibold bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full self-start">{resource.category} › {resource.subCategory}</span>
                 <div className="flex-shrink-0 flex gap-1">
                     <button onClick={onEdit} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition-colors"><FaEdit/></button>
                     <button onClick={onDelete} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-red-500 transition-colors"><FaTrash/></button>
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
                <button onClick={() => openModal()} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700">
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
                                <input id="image-upload" name="imageFile" type="file" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
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

