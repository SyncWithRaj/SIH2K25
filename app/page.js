"use client";

import { UserButton, SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
      {/* Navbar */}
      <header className="flex justify-between items-center px-8 py-4 bg-white shadow">
        <h1 className="text-2xl font-bold text-blue-600">EduCareer Advisor</h1>
        <nav>
          <SignedOut>
            <SignInButton>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mr-2">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between flex-1 px-12 py-16">
        <div className="max-w-xl">
          <h2 className="text-4xl font-extrabold text-gray-900 leading-snug">
            One-Stop <span className="text-blue-600">Career & Education</span> Advisor
          </h2>
          <p className="mt-6 text-gray-600 text-lg">
            Confused about which stream or degree to choose after 10th or 12th?  
            Get personalized guidance, explore career paths, and discover nearby government colleges — all in one place.
          </p>
          <div className="mt-8 flex gap-4">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Get Started
            </button>
            <button className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
              Learn More
            </button>
          </div>
        </div>
        <div className="mt-12 md:mt-0">
          <img
            src="https://illustrations.popsy.co/blue/student-studying.svg"
            alt="Career guidance"
            className="w-[400px] rounded-lg"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="px-12 py-16 bg-white shadow-inner">
        <h3 className="text-3xl font-bold text-center text-gray-900">Why Choose Us?</h3>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          <div className="p-6 bg-blue-50 rounded-xl shadow hover:shadow-md transition">
            <h4 className="text-xl font-semibold text-blue-700">Personalized Suggestions</h4>
            <p className="mt-3 text-gray-600">
              Get stream and subject suggestions based on your interests, strengths, and aptitude.
            </p>
          </div>
          <div className="p-6 bg-blue-50 rounded-xl shadow hover:shadow-md transition">
            <h4 className="text-xl font-semibold text-blue-700">Course-to-Career Mapping</h4>
            <p className="mt-3 text-gray-600">
              Understand what each degree leads to — jobs, exams, higher studies, or entrepreneurship.
            </p>
          </div>
          <div className="p-6 bg-blue-50 rounded-xl shadow hover:shadow-md transition">
            <h4 className="text-xl font-semibold text-blue-700">College Directory</h4>
            <p className="mt-3 text-gray-600">
              Find nearby government colleges, programs, and facilities at your fingertips.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} EduCareer Advisor | Built with ❤️ for SIH 2025
      </footer>
    </main>
  );
}
