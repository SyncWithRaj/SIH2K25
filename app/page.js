"use client";
import { useState } from 'react';
import Link from 'next/link';
import Footer from "./components/Footer";

// Icon components for features (using SVG for best quality)
const UserCheck = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>;
const Map = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>;
const School = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 22v-4a2 2 0 1 0-4 0v4"/><path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2"/><path d="M18 5v17"/><path d="m12 5 6 3"/><path d="M6 5v17"/><path d="m6 8 6-3"/></svg>;
const QuoteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6.5 10c-1.25.66-2.5 1-3.5 1.41V15c1.4-1 2.59-2.5 3.5-4.5V10zm11 0c-1.25.66-2.5 1-3.5 1.41V15c1.4-1 2.59-2.5 3.5-4.5V10z"/></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const MinusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>;

// --- Testimonials Data ---
const testimonials = [
  {
    quote: "I was so confused after my 12th exams. MargDarshak helped me understand my options and choose the right B.Sc course. I finally feel confident about my future!",
    name: "Priya Sharma",
    location: "Jammu",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    quote: "The career-to-course mapping feature is brilliant. I could see exactly what jobs my degree would lead to, which made my decision so much easier.",
    name: "Amit Kumar",
    location: "Srinagar",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    quote: "Finding a government college near me with the right facilities was a challenge. This platform simplified everything. Highly recommended for all students.",
    name: "Aisha Begum",
    location: "Anantnag",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    quote: "As a parent, I was worried about my son's future. MargDarshak provided the clarity we needed to support him in his academic journey. A fantastic initiative.",
    name: "Ravi Raina",
    location: "Kathua",
    avatar: "https://randomuser.me/api/portraits/men/46.jpg",
  },
   {
    quote: "The assessment tool was surprisingly accurate! It pointed me towards a career in Commerce that I hadn't considered before, and now I'm thriving.",
    name: "Jasleen Kaur",
    location: "Udhampur",
    avatar: "https://randomuser.me/api/portraits/women/50.jpg",
  },
];

// --- FAQ Data ---
const faqs = [
    {
        question: "Is MargDarshak completely free to use?",
        answer: "Yes, MargDarshak is a government-backed initiative and is completely free for all students, parents, and educators. Our goal is to make quality career guidance accessible to everyone."
    },
    {
        question: "How accurate is the career assessment?",
        answer: "Our assessment is designed by career counseling experts to provide strong directional guidance based on your interests and personality traits. While it's a powerful tool for self-discovery, we always recommend using it as a starting point for further research and exploration."
    },
    {
        question: "Is this platform only for students in Jammu & Kashmir?",
        answer: "While the initial focus and college directory are tailored for Jammu & Kashmir to address specific local needs, the career guidance and resource materials are valuable for students anywhere."
    },
    {
        question: "How can parents use this platform?",
        answer: "Parents can create an account to explore career paths with their children, understand the potential of different academic streams, and stay informed about important dates for college admissions and scholarships. It's a great tool for families to plan together."
    }
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="bg-white text-gray-800 font-sans">
      {/* Hero Section */}
      <main className="pt-24 sm:pt-32">
        <section className="relative px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column: Text Content */}
            <div className="text-center md:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">True Calling.</span>
              </h1>
              <p className="max-w-xl mx-auto md:mx-0 mt-6 text-lg text-gray-600">
                Confused after 10th or 12th? MargDarshak provides personalized guidance to help you choose the right stream, discover government colleges, and map your complete career path.
              </p>
              <div className="mt-8 flex justify-center md:justify-start">
                <Link href="/career-map" className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition-transform transform hover:scale-105">
                  Explore Career Paths
                </Link>
              </div>
            </div>
            {/* Right Column: Image */}
            <div>
              <img
                src="home.png"
                alt="Student planning their future on a path"
                className="w-full max-w-lg mx-auto rounded-3xl"
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 bg-slate-50 mt-20">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Your Journey to Clarity</h2>
            <p className="max-w-2xl mx-auto mt-4 text-gray-600">We simplify the complex process of career planning into three straightforward steps.</p>
            <div className="mt-16 grid gap-12 md:grid-cols-3 items-start">
              <div className="relative flex flex-col items-center">
                 <div className="bg-indigo-100 text-indigo-600 w-16 h-16 rounded-full flex items-center justify-center shadow-md"><UserCheck /></div>
                <h3 className="text-xl font-semibold mt-6">Discover Your Interests</h3>
                <p className="mt-2 text-gray-600">Our intuitive assessment helps you understand your strengths and suggests suitable career paths.</p>
              </div>
              <div className="relative flex flex-col items-center">
                <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center shadow-md"><Map /></div>
                <h3 className="text-xl font-semibold mt-6">Visualize Your Path</h3>
                <p className="mt-2 text-gray-600">Explore interactive career trees that map courses to jobs, higher studies, and beyond.</p>
              </div>
              <div className="relative flex flex-col items-center">
                <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center shadow-md"><School /></div>
                <h3 className="text-xl font-semibold mt-6">Find the Right College</h3>
                <p className="mt-2 text-gray-600">Access a curated directory of government colleges with details on courses and facilities.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section - Infinite Scroll */}
        <section className="py-24 bg-white text-gray-800">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Trusted by Students & Parents</h2>
            <p className="max-w-2xl mx-auto mt-4 text-gray-600">See how MargDarshak is making a real difference in the lives of students across the region.</p>
          </div>
          <div 
            className="mt-16 group relative w-full overflow-hidden"
            style={{ maskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)" }}
          >
            <div className="flex animate-scroll group-hover:pause">
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <div key={index} className="flex-shrink-0 w-80 sm:w-96 mx-4 p-6 bg-slate-50 rounded-xl shadow-lg border border-slate-100">
                  <div className="flex items-start">
                    <QuoteIcon className="text-indigo-200 w-10 h-10 flex-shrink-0" />
                    <p className="ml-4 italic text-slate-700 text-left">"{testimonial.quote}"</p>
                  </div>
                  <div className="flex items-center mt-6">
                    <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full border-2 border-indigo-200" />
                    <div className="ml-4 text-left">
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* --- NEW FAQ Section --- */}
        <section className="py-24 bg-slate-50">
            <div className="max-w-4xl mx-auto px-4">
                <h2 className="text-center text-3xl sm:text-4xl font-bold text-gray-900">Have Questions?</h2>
                <p className="text-center max-w-2xl mx-auto mt-4 text-gray-600">Find quick answers to common queries about our platform and services.</p>
                <div className="mt-12 space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200/80">
                            <button 
                                onClick={() => setOpenFaq(openFaq === index ? null : index)} 
                                className="w-full flex justify-between items-center text-left p-6"
                            >
                                <h3 className="font-semibold text-lg text-slate-800">{faq.question}</h3>
                                <span className="text-indigo-500 transition-transform duration-300" style={{ transform: openFaq === index ? 'rotate(45deg)' : 'rotate(0)' }}>
                                    <PlusIcon />
                                </span>
                            </button>
                            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openFaq === index ? 'max-h-96' : 'max-h-0'}`}>
                                <p className="text-slate-600 px-6 pb-6">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
