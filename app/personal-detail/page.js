"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function PersonalDetail() {
  const { user } = useUser();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", age: "", gender: "", role: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("🚀 Submitting form:", form);

      const res = await fetch("/api/personal-detail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, userId: user.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to save personal details");
        return;
      }

      // ✅ Role-based redirect ONLY after form submission
      const role = data.role || form.role;
      if (role === "student") router.push("/assessment");
      else if (role === "parent") router.push("/");
      else if (role === "admin") router.push("/admin-dashboard");
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-blue-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-blue-600 mb-6">
          Personal Details
        </h1>

        {/* Name */}
        <input
          type="text"
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border p-3 rounded mb-4"
          required
        />

        {/* Age */}
        <input
          type="number"
          placeholder="Age"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
          className="w-full border p-3 rounded mb-4"
          required
        />

        {/* Gender */}
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

        {/* Role */}
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="w-full border p-3 rounded mb-6"
          required
        >
          <option value="">Select Role</option>
          <option value="student">Student</option>
          <option value="parent">Parent</option>
          <option value="admin">Admin</option>
        </select>

        {/* Submit */}
        <button
          type="submit"
          className={`w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 ${
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
