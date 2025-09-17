"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/personal-detail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, userId: user.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to save personal details");
        setLoading(false);
        return;
      }

      // Redirect AFTER successful submission based on the selected role
      const role = data.role || form.role;
      if (role === "student") router.push("/assessment");
      else if (role === "parent") router.push("/");
      else if (role === "admin") router.push("/admin-dashboard");

    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
      setLoading(false);
    }
  };
  
  // --- NEW: Handler to manage conditional fields ---
  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setForm(prevForm => {
      const updatedForm = { ...prevForm, role: newRole };
      // If the new role is not 'student', clear the student-specific fields
      if (newRole !== 'student') {
        updatedForm.field = '';
        updatedForm.courseInterested = '';
      }
      return updatedForm;
    });
  };

  if (!isLoaded) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-blue-50">
        <p className="text-lg font-semibold text-gray-600">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-blue-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-blue-600 mb-6">
          Personal Details
        </h1>

        {/* Name Input */}
        <input
          type="text"
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border p-3 rounded mb-4"
          required
        />

        {/* Date of Birth Input */}
        <input
          type="date"
          placeholder="Date of Birth"
          value={form.dob}
          onChange={(e) => setForm({ ...form, dob: e.target.value })}
          className="w-full border p-3 rounded mb-4 text-gray-500"
          required
        />

        {/* Gender Select */}
        <select
          value={form.gender}
          onChange={(e) => setForm({ ...form, gender: e.target.value })}
          className="w-full border p-3 rounded mb-4"
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        {/* Role Select - Uses the new handler */}
        <select
          value={form.role}
          onChange={handleRoleChange}
          className="w-full border p-3 rounded mb-4"
          required
        >
          <option value="">Select Role</option>
          <option value="student">Student</option>
          <option value="parent">Parent</option>
          <option value="admin">Admin</option>
        </select>

        {/* --- NEW: Conditional rendering for student-only fields --- */}
        {form.role === 'student' && (
          <>
            {/* Field Select */}
            <select
              value={form.field}
              onChange={(e) => setForm({ ...form, field: e.target.value })}
              className="w-full border p-3 rounded mb-4"
              required={form.role === 'student'} // Make required only for students
            >
              <option value="">Select Field</option>
              <option value="Science">Science</option>
              <option value="Commerce">Commerce</option>
              <option value="Arts">Arts</option>
              <option value="Diploma">Diploma</option>
            </select>

            {/* Course Select */}
            <select
              value={form.courseInterested}
              onChange={(e) =>
                setForm({ ...form, courseInterested: e.target.value })
              }
              className="w-full border p-3 rounded mb-6"
              required={form.role === 'student'} // Make required only for students
            >
              <option value="">Select Course</option>
              <optgroup label="Bachelor's Degrees">
                <option value="B.Tech">B.Tech (Bachelor of Technology)</option>
                {/* ... other options */}
              </optgroup>
              <optgroup label="Master's Degrees">
                <option value="M.Tech">M.Tech (Master of Technology)</option>
                {/* ... other options */}
              </optgroup>
            </select>
          </>
        )}
        
        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition-colors ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Saving..." : "Continue"}
        </button>
      </form>
    </main>
  );
}