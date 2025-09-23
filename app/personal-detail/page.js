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

      const role = data.role || form.role;
      if (role === "student") router.push("/assessment");
      else if (role === "parent") router.push("/");
      else if (role === "admin") router.push("/admin/dashboard");

    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
      setLoading(false);
    }
  };

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
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

        {/* Role Select */}
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

        {/* Conditional rendering for student-only fields */}
        {form.role === 'student' && (
          <>
            {/* Field Select */}
            <select
              value={form.field}
              onChange={(e) => setForm({ ...form, field: e.target.value })}
              className="w-full border p-3 rounded mb-4"
              required={form.role === 'student'}
            >
              <option value="">Select Field</option>
              <option value="Science">Science</option>
              <option value="Commerce">Commerce</option>
              <option value="Arts">Arts</option>
              <option value="Diploma">Diploma</option>
            </select>

            {/* --- UPDATED AND EXPANDED COURSE SELECT --- */}
            <select
              value={form.courseInterested}
              onChange={(e) =>
                setForm({ ...form, courseInterested: e.target.value })
              }
              className="w-full border p-3 rounded mb-6"
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
            </select>
          </>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition-colors ${loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          disabled={loading}
        >
          {loading ? "Saving..." : "Continue"}
        </button>
      </form>
    </main>
  );
}