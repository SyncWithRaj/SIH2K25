"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

// --- SVG Icons ---
const Icon = ({ className = 'w-5 h-5', children }) => <span className={`absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 ${className}`}>{children}</span>;
const UserIcon = () => <Icon><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg></Icon>;
const CalendarIcon = () => <Icon><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></Icon>;
const GenderIcon = () => <Icon><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m-4-12h8m-8 6h8m-4 6a4 4 0 100-8 4 4 0 000 8z"></path></svg></Icon>;
const BriefcaseIcon = () => <Icon><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg></Icon>;
const BookIcon = () => <Icon><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg></Icon>;
const Spinner = () => <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;

// --- Reusable Form Components ---
const FormInput = ({ icon, ...props }) => (
  <div className="relative mb-4">
    {icon}
    <input {...props} className="w-full border-slate-300 bg-slate-50 p-3 pl-12 rounded-lg shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" />
  </div>
);

const FormSelect = ({ icon, children, ...props }) => (
  <div className="relative mb-4">
    {icon}
    <select {...props} className="w-full border-slate-300 bg-slate-50 p-3 pl-12 rounded-lg shadow-inner appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition">
      {children}
    </select>
  </div>
);

const RoleCard = ({ value, label, description, isSelected, onSelect }) => (
    <div 
        onClick={() => onSelect(value)}
        className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${isSelected ? 'border-indigo-600 bg-indigo-50 shadow-md' : 'border-slate-300 bg-white hover:border-indigo-400'}`}
    >
        <h3 className={`font-bold ${isSelected ? 'text-indigo-800' : 'text-slate-800'}`}>{label}</h3>
        <p className={`text-sm ${isSelected ? 'text-indigo-600' : 'text-slate-500'}`}>{description}</p>
    </div>
);

const ErrorMessage = ({ message, onClose }) => {
    if (!message) return null;
    return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
            <span className="block sm:inline">{message}</span>
            <button onClick={onClose} className="absolute top-0 bottom-0 right-0 px-4 py-3">
                <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
            </button>
        </div>
    );
};


export default function PersonalDetail() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    dob: "",
    gender: "",
    role: "",
    field: "",
    courseInterested: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/personal-detail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, userId: user.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to save personal details");
      }

      const userRole = data.role || form.role;
      if (userRole === "student") router.push("/assessment");
      else if (userRole === "parent") router.push("/");
      else if (userRole === "admin") router.push("/admin/dashboard");

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  const handleRoleChange = (newRole) => {
    setForm(prevForm => {
      const updatedForm = { ...prevForm, role: newRole };
      if (newRole !== 'student') {
        updatedForm.field = '';
        updatedForm.courseInterested = '';
      }
      return updatedForm;
    });
  };

  if (!isLoaded) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="text-center">
            <Spinner />
            <p className="text-lg font-semibold text-slate-600 mt-4">Loading Your Profile...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-200 p-4 font-sans">
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl p-8 w-full max-w-lg border border-slate-200"
      >
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 mb-2">
            Tell Us About Yourself
            </h1>
            <p className="text-slate-500">This helps us personalize your experience.</p>
        </div>
        
        <FormInput
          icon={<UserIcon />}
          type="text"
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <FormInput
          icon={<CalendarIcon />}
          type="date"
          value={form.dob}
          onChange={(e) => setForm({ ...form, dob: e.target.value })}
          className="w-full border-slate-300 bg-slate-50 p-3 pl-12 rounded-lg shadow-inner text-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          required
        />
        <FormSelect
          icon={<GenderIcon />}
          value={form.gender}
          onChange={(e) => setForm({ ...form, gender: e.target.value })}
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </FormSelect>

        <div className="my-6">
            <label className="block text-sm font-medium text-slate-600 mb-2">I am a...</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <RoleCard value="student" label="Student" description="Seeking guidance" isSelected={form.role === 'student'} onSelect={handleRoleChange} />
                <RoleCard value="parent" label="Parent" description="Helping my child" isSelected={form.role === 'parent'} onSelect={handleRoleChange} />
                <RoleCard value="admin" label="Admin" description="Managing platform" isSelected={form.role === 'admin'} onSelect={handleRoleChange} />
            </div>
        </div>

        {/* Conditional rendering for student-only fields */}
        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${form.role === 'student' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="pt-2">
                <FormSelect
                icon={<BriefcaseIcon />}
                value={form.field}
                onChange={(e) => setForm({ ...form, field: e.target.value })}
                required={form.role === 'student'}
                >
                <option value="">Select Field of Study</option>
                <optgroup label="Higher Secondary (Class 11-12)">
                    <option value="Science (PCM)">Science (PCM - Engineering Group)</option>
                    <option value="Science (PCB)">Science (PCB - Medical Group)</option>
                    <option value="Science (PCMB)">Science (PCMB)</option>
                    <option value="Commerce (With Maths)">Commerce (With Maths)</option>
                    <option value="Commerce (Without Maths)">Commerce (Without Maths)</option>
                    <option value="Arts/Humanities">Arts / Humanities</option>
                </optgroup>
                <optgroup label="Post-Secondary (After Class 10)">
                    <option value="Diploma in Engineering">Diploma in Engineering (Polytechnic)</option>
                    <option value="ITI">ITI (Industrial Training Institute)</option>
                    <option value="Paramedical">Paramedical Courses</option>
                </optgroup>
                <option value="Other">Other</option>
                </FormSelect>
                
                <FormSelect
                icon={<BookIcon />}
                value={form.courseInterested}
                onChange={(e) => setForm({ ...form, courseInterested: e.target.value })}
                required={form.role === 'student'}
                >
                    <option value="">Select Course of Interest</option>
                    <optgroup label="Bachelor's Degrees">
                        <option value="B.Tech">B.Tech (Bachelor of Technology)</option>
                        <option value="B.E.">B.E. (Bachelor of Engineering)</option>
                        <option value="B.Sc.">B.Sc. (Bachelor of Science)</option>
                        <option value="B.Com.">B.Com. (Bachelor of Commerce)</option>
                        <option value="B.A.">B.A. (Bachelor of Arts)</option>
                        <option value="B.B.A.">B.B.A. (Bachelor of Business Administration)</option>
                        <option value="B.C.A.">B.C.A. (Bachelor of Computer Applications)</option>
                        <option value="LL.B.">LL.B. (Bachelor of Laws)</option>
                        <option value="B.Pharm.">B.Pharm. (Bachelor of Pharmacy)</option>
                        <option value="B.Des.">B.Des. (Bachelor of Design)</option>
                        <option value="M.B.B.S.">M.B.B.S. (Bachelor of Medicine, Bachelor of Surgery)</option>
                    </optgroup>
                    <optgroup label="Master's Degrees">
                        <option value="M.Tech">M.Tech (Master of Technology)</option>
                        <option value="M.E.">M.E. (Master of Engineering)</option>
                        <option value="M.Sc.">M.Sc. (Master of Science)</option>
                        <option value="M.Com.">M.Com. (Master of Commerce)</option>
                        <option value="M.A.">M.A. (Master of Arts)</option>
                        <option value="M.B.A.">M.B.A. (Master of Business Administration)</option>
                        <option value="M.C.A.">M.C.A. (Master of Computer Applications)</option>
                        <option value="LL.M.">LL.M. (Master of Laws)</option>
                        <option value="M.Pharm.">M.Pharm. (Master of Pharmacy)</option>
                        <option value="M.D.">M.D. (Doctor of Medicine)</option>
                        <option value="M.S.">M.S. (Master of Surgery)</option>
                    </optgroup>
                    <optgroup label="Doctoral Degrees">
                        <option value="Ph.D.">Ph.D. (Doctor of Philosophy)</option>
                        <option value="D.Sc.">D.Sc. (Doctor of Science)</option>
                    </optgroup>
                    <optgroup label="Diploma & Vocational Courses">
                        <option value="Diploma in Engineering">Diploma in Engineering (Polytechnic)</option>
                        <option value="ITI">ITI (Industrial Training Institute) Course</option>
                        <option value="Diploma in Nursing">Diploma in Nursing</option>
                        <option value="Diploma in Hotel Management">Diploma in Hotel Management</option>
                        <option value="Diploma in Graphic Design">Diploma in Graphic Design</option>
                    </optgroup>
                    <option value="Other">Other</option>
                </FormSelect>
            </div>
        </div>

        <ErrorMessage message={error} onClose={() => setError(null)} />

        <button
          type="submit"
          className={`w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-3 rounded-lg font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          disabled={loading}
        >
          {loading ? <><Spinner /> Saving...</> : "Continue"}
        </button>
      </form>
    </main>
  );
}

