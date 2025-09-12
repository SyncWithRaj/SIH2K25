"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function Assessment() {
  const { user } = useUser();
  const router = useRouter();
  const [answers, setAnswers] = useState({ q1: "", q2: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, answers }),
      });

      if (!res.ok) {
        throw new Error("Failed to save assessment");
      }

      // After successful save, redirect to homepage
      router.push("/");
    } catch (err) {
      console.error(err);
      alert("Error saving assessment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg"
      >
        <h1 className="text-2xl font-bold text-blue-600 mb-6">
          Quick Assessment
        </h1>

        <label className="block mb-4">
          <span className="text-gray-700">What subjects do you enjoy most?</span>
          <input
            type="text"
            value={answers.q1}
            onChange={(e) => setAnswers({ ...answers, q1: e.target.value })}
            className="w-full border p-3 rounded mt-2"
            required
          />
        </label>

        <label className="block mb-6">
          <span className="text-gray-700">What is your dream career?</span>
          <input
            type="text"
            value={answers.q2}
            onChange={(e) => setAnswers({ ...answers, q2: e.target.value })}
            className="w-full border p-3 rounded mt-2"
            required
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 rounded text-white ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Saving..." : "Finish"}
        </button>
      </form>
    </main>
  );
}
