"use client";
import { useState } from 'react';
import Link from 'next/link';
import Footer from "./components/Footer";
import { motion, AnimatePresence } from 'framer-motion';

// --- Icon Components (no changes) ---
const UserCheck = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>;
const Map = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>;
const School = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 22v-4a2 2 0 1 0-4 0v4"/><path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2"/><path d="M18 5v17"/><path d="m12 5 6 3"/><path d="M6 5v17"/><path d="m6 8 6-3"/></svg>;
const QuoteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6.5 10c-1.25.66-2.5 1-3.5 1.41V15c1.4-1 2.59-2.5 3.5-4.5V10zm11 0c-1.25.66-2.5 1-3.5 1.41V15c1.4-1 2.59-2.5 3.5-4.5V10z"/></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const MinusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const CheckCircle = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;


// --- Data (no changes) ---
const testimonials = [
    { quote: "I was so confused after my 12th exams. MargDarshak helped me understand my options and choose the right B.Sc course. I finally feel confident about my future!", name: "Priya Sharma", location: "Jammu", avatar: "https://randomuser.me/api/portraits/women/68.jpg" },
    { quote: "The career-to-course mapping feature is brilliant. I could see exactly what jobs my degree would lead to, which made my decision so much easier.", name: "Amit Kumar", location: "Srinagar", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
    { quote: "Finding a government college near me with the right facilities was a challenge. This platform simplified everything. Highly recommended for all students.", name: "Aisha Begum", location: "Anantnag", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
    { quote: "As a parent, I was worried about my son's future. MargDarshak provided the clarity we needed to support him in his academic journey. A fantastic initiative.", name: "Ravi Raina", location: "Kathua", avatar: "https://randomuser.me/api/portraits/men/46.jpg" },
    { quote: "The assessment tool was surprisingly accurate! It pointed me towards a career in Commerce that I hadn't considered before, and now I'm thriving.", name: "Jasleen Kaur", location: "Udhampur", avatar: "https://randomuser.me/api/portraits/women/50.jpg" },
];
const faqs = [
    { question: "Is MargDarshak completely free to use?", answer: "Yes, MargDarshak is a government-backed initiative and is completely free for all students, parents, and educators. Our goal is to make quality career guidance accessible to everyone." },
    { question: "How accurate is the career assessment?", answer: "Our assessment is designed by career counseling experts to provide strong directional guidance based on your interests and personality traits. While it's a powerful tool for self-discovery, we always recommend using it as a starting point for further research and exploration." },
    { question: "Is this platform only for students in Jammu & Kashmir?", answer: "While the initial focus and college directory are tailored for Jammu & Kashmir to address specific local needs, the career guidance and resource materials are valuable for students anywhere." },
    { question: "How can parents use this platform?", answer: "Parents can create an account to explore career paths with their children, understand the potential of different academic streams, and stay informed about important dates for college admissions and scholarships. It's a great tool for families to plan together." }
];

// --- Main Page Component ---
export default function Home() {
  const [openFaq, setOpenFaq] = useState(0); // Default first FAQ to be open

  // Animation variants for sections to fade in as they're scrolled into view
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="bg-white text-gray-800 font-sans antialiased">
      <main className="pt-24 sm:pt-32 overflow-x-hidden"> {/* Prevents horizontal scroll from animations */}

        {/* --- Hero Section --- */}
        <section className="relative px-4">
          <div className="absolute inset-0 -z-10 overflow-hidden">
             <div className="absolute -top-40 left-0 w-[80rem] h-[80rem] bg-indigo-50/50 rounded-full blur-3xl opacity-60"></div>
          </div>
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center md:text-left"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
                Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">True Calling.</span>
              </h1>
              <p className="max-w-xl mx-auto md:mx-0 mt-6 text-lg text-gray-600">
                Confused after 10th or 12th? MargDarshak provides personalized guidance to help you choose the right stream, discover government colleges, and map your complete career path.
              </p>
              <div className="mt-8 flex justify-center md:justify-start">
                <Link href="/career-map">
                  <motion.div
                    whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(99, 102, 241, 0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-full shadow-lg transition-shadow"
                  >
                    Explore Career Paths
                  </motion.div>
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              <img src="home.png" alt="Student planning their future" className="w-full max-w-lg mx-auto rounded-3xl" />
            </motion.div>
          </div>
        </section>

        {/* --- How It Works Section --- */}
        <motion.section 
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="py-24 bg-slate-50 mt-20"
        >
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Your Journey to Clarity</h2>
            <p className="max-w-2xl mx-auto mt-4 text-gray-600">We simplify the complex process of career planning into three straightforward steps.</p>
            <div className="mt-16 grid gap-8 md:grid-cols-3 items-start">
                {/* Replaced simple divs with interactive cards */}
                <motion.div whileHover={{ y: -10 }} className="p-8 bg-white rounded-2xl shadow-lg border border-slate-200/60 transition-transform">
                  <div className="bg-indigo-100 text-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-md mx-auto"><UserCheck /></div>
                  <h3 className="text-xl font-semibold mt-6">Discover Your Interests</h3>
                  <p className="mt-2 text-gray-600">Our intuitive assessment helps you understand your strengths and suggests suitable career paths.</p>
                </motion.div>
                <motion.div whileHover={{ y: -10 }} className="p-8 bg-white rounded-2xl shadow-lg border border-slate-200/60 transition-transform">
                  <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-md mx-auto"><Map /></div>
                  <h3 className="text-xl font-semibold mt-6">Visualize Your Path</h3>
                  <p className="mt-2 text-gray-600">Explore interactive career trees that map courses to jobs, higher studies, and beyond.</p>
                </motion.div>
                <motion.div whileHover={{ y: -10 }} className="p-8 bg-white rounded-2xl shadow-lg border border-slate-200/60 transition-transform">
                  <div className="bg-green-100 text-green-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-md mx-auto"><School /></div>
                  <h3 className="text-xl font-semibold mt-6">Find the Right College</h3>
                  <p className="mt-2 text-gray-600">Access a curated directory of government colleges with details on courses and facilities.</p>
                </motion.div>
            </div>
          </div>
        </motion.section>

        {/* --- NEW: Why Choose Us Section --- */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="py-24 bg-white"
        >
          {/* You can wrap this entire block within a <section> tag */}
<div className="bg-slate-50 py-24 sm:py-32">
  <div className="max-w-7xl mx-auto px-6 lg:px-8 grid md:grid-cols-2 gap-x-16 gap-y-12 items-center">
    
    {/* --- Left Column: Text Content --- */}
    <div className="order-2 md:order-1">
      <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
        <span className="bg-gradient-to-r pr-4 from-indigo-600 to-blue-500 bg-clip-text text-transparent">
          Why MargDarshak?
        </span>
      </h2>
      <p className="mt-6 text-lg leading-8 text-gray-600 max-w-lg">
        We are more than just a directory. We are a comprehensive guidance system built to empower the students of Jammu & Kashmir.
      </p>
      
      {/* Feature List with improved styling and icons */}
      <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
        <div className="relative pl-16">
          <dt className="inline font-semibold text-gray-900">
            <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-200">
              <CheckCircle className="h-7 w-7 text-white" />
            </div>
            Govt. Backed & Free
          </dt>
          <dd className="inline">: A trusted, no-cost platform dedicated to your future.</dd>
        </div>
        
        <div className="relative pl-16">
          <dt className="inline font-semibold text-gray-900">
             <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-200">
              <UserCheck className="h-7 w-7 text-white" />
            </div>
            Personalized Guidance
          </dt>
          <dd className="inline">: Move beyond generic advice with tailored career suggestions.</dd>
        </div>
        
        <div className="relative pl-16">
          <dt className="inline font-semibold text-gray-900">
             <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-200">
              <Map className="h-7 w-7 text-white" />
            </div>
            Holistic Approach
          </dt>
          <dd className="inline">: From self-assessment to college selection, we cover it all.</dd>
        </div>
      </dl>
    </div>
    
    {/* --- Right Column: Image with Decorative Elements --- */}
    <div className="order-1 md:order-2 relative pt-12">
       {/* Decorative blurred gradients for depth */}
       <div className="absolute -top-10 -right-10 w-80 h-80 bg-blue-200/40 rounded-full blur-3xl -z-10" aria-hidden="true"></div>
       <div className="absolute -bottom-16 -left-10 w-80 h-80 bg-indigo-200/40 rounded-full blur-3xl -z-10" aria-hidden="true"></div>

      <motion.img 
        src="home2.png"
        alt="Students collaborating and looking at a bright future" 
        className="relative rounded-2xl shadow-2xl ring-1 ring-gray-900/10 w-full object-cover"
        whileHover={{ scale: 1.03, y: -5 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
    </div>
    
  </div>
</div>
        </motion.section>

        {/* --- Testimonials Section --- */}
        <section className="py-24 bg-slate-50 text-gray-800">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Trusted by Students & Parents</h2>
            <p className="max-w-2xl mx-auto mt-4 text-gray-600">See how MargDarshak is making a real difference in the lives of students across the region.</p>
          </div>
          <div className="mt-16 group relative w-full overflow-hidden" style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}>
            <div className="flex animate-scroll group-hover:pause">
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <div key={index} className="flex-shrink-0 w-80 sm:w-96 mx-4 p-8 bg-white rounded-xl shadow-lg border border-slate-100">
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
        
        {/* --- FAQ Section --- */}
        <motion.section 
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="py-24 bg-white"
        >
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-center text-3xl sm:text-4xl font-bold text-gray-900">Have Questions?</h2>
            <p className="text-center max-w-2xl mx-auto mt-4 text-gray-600">Find quick answers to common queries about our platform and services.</p>
            <div className="mt-12 space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-slate-50/70 rounded-xl border border-slate-200/80">
                  <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full flex justify-between items-center text-left p-6">
                    <h3 className="font-semibold text-lg text-slate-800">{faq.question}</h3>
                    {/* Swapping icons is better UX than rotating */}
                    <motion.div animate={{ rotate: openFaq === index ? 180 : 0 }} className="text-indigo-500">
                        {openFaq === index ? <MinusIcon /> : <PlusIcon />}
                    </motion.div>
                  </button>
                  {/* Using AnimatePresence for smooth open/close */}
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="text-slate-600 px-6 pb-6">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* --- NEW: Call to Action (CTA) Section --- */}
        <section className="bg-white">
          <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
            <div className="relative isolate overflow-hidden bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-20 text-center shadow-2xl rounded-3xl sm:px-16">
               <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">Ready to Discover Your Future?</h2>
               <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-indigo-100">Start your journey today. Our tools are free, easy to use, and designed to bring you clarity and confidence.</p>
               <div className="mt-10 flex items-center justify-center gap-x-6">
                 <Link href="/profile">
                   <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="rounded-full bg-white px-8 py-3.5 text-base font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50"
                  >
                    Get Started Now
                  </motion.div>
                 </Link>
               </div>
            </div>
          </div>
        </section>

      </main>
      
      <Footer />
    </div>
  );
}