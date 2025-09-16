"use client";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  // Replace with real logged-in userId
  const userId = "123";

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/personal-details?userId=${userId}`);
      const data = await res.json();
      setDetail(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ✅ For now, use base64 (better: Cloudinary)
    const reader = new FileReader();
    reader.onloadend = async () => {
      const profilePic = reader.result;
      await updateProfile({ ...detail, profilePic });
    };
    reader.readAsDataURL(file);
  };

  const updateProfile = async (updated) => {
    const res = await fetch("/api/personal-details", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    const data = await res.json();
    setDetail(data);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-6">
      <div className="flex items-center gap-6">
        {/* Profile Picture */}
        <div>
          <img
            src={detail?.profilePic || "/default-avatar.png"}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border"
          />
          <input
            type="file"
            accept="image/*"
            className="mt-2 text-sm"
            onChange={handleFileChange}
          />
        </div>

        {/* Info */}
        <div>
          <h2 className="text-2xl font-bold">{detail?.name}</h2>
          <p className="text-gray-600">
            {detail?.age} years | {detail?.gender}
          </p>
          <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            {detail?.role}
          </span>
        </div>
      </div>

      {/* Edit Form */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Edit Details</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target;
            updateProfile({
              userId,
              name: form.name.value,
              age: form.age.value,
              gender: form.gender.value,
              role: form.role.value,
              profilePic: detail?.profilePic,
            });
          }}
          className="space-y-4"
        >
          <input
            name="name"
            defaultValue={detail?.name}
            placeholder="Name"
            className="w-full border p-2 rounded"
          />
          <input
            name="age"
            type="number"
            defaultValue={detail?.age}
            placeholder="Age"
            className="w-full border p-2 rounded"
          />
          <select
            name="gender"
            defaultValue={detail?.gender}
            className="w-full border p-2 rounded"
          >
            <option>male</option>
            <option>female</option>
            <option>other</option>
          </select>
          <select
            name="role"
            defaultValue={detail?.role}
            className="w-full border p-2 rounded"
          >
            <option value="student">Student</option>
            <option value="parent">Parent</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
