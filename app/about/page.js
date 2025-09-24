import React from 'react';

// A helper component for the icons to keep the main component cleaner
const Icon = ({ path }) => (
  <svg className="h-14 w-14 mx-auto mb-6 text-indigo-500 group-hover:text-indigo-600 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

const AboutPage = () => {
  // We'll add a <style> tag to define custom animations since we can't configure tailwind.css directly here.
  const animationStyles = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-fadeInUp {
      animation: fadeInUp 0.8s ease-out forwards;
    }
    
    /* Utility for staggering animations */
    .delay-1 { animation-delay: 0.2s; }
    .delay-2 { animation-delay: 0.4s; }
    .delay-3 { animation-delay: 0.6s; }
    .delay-4 { animation-delay: 0.8s; }
    
    /* Make animations start only when they are visible (a real app would use JS Intersection Observer) 
       For this demo, we'll have them animate on load.
    */
    .section-animate {
        opacity: 0; /* Start hidden */
    }
  `;

  return (
    <>
      <style>{animationStyles}</style>
      <div className="bg-slate-50 min-h-screen text-gray-800 font-sans mt-18">
        
        {/* Header */}
        <header className="bg-white shadow-sm py-12">
          <div className="container mx-auto px-6 text-center section-animate animate-fadeInUp">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">MargDarshak</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mt-4 max-w-3xl mx-auto">
              Your Beacon for Personalized Career & Education Guidance
            </p>
          </div>
        </header>

        <main className="container mx-auto px-6 py-20">
          
          {/* Our Mission Section */}
          <section className="bg-white p-8 md:p-12 rounded-2xl shadow-lg mb-20 border border-gray-100 section-animate animate-fadeInUp delay-1">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">Our Mission</h2>
            <div className="max-w-4xl mx-auto text-lg leading-relaxed text-gray-700 space-y-5">
              <p>
                In an increasingly complex educational landscape, many students and their families face significant hurdles in navigating academic and career choices. From selecting the right subject stream to understanding long-term career prospects, the path forward often seems unclear. This uncertainty can lead to suboptimal decisions, affecting future opportunities.
              </p>
              <blockquote className="border-l-4 border-indigo-500 bg-indigo-50/50 p-6 rounded-r-lg text-indigo-900 italic">
                <strong>Margdarshak</strong> stands as a solution to this critical need. Our mission is to empower every student with precise, personalized, and accessible guidance, illuminating the diverse pathways available. We are dedicated to transforming uncertainty into clarity, enabling students to make informed decisions that align with their true potential and aspirations.
              </blockquote>
            </div>
          </section>

          {/* How We Empower You Section */}
          <section className="mb-20 section-animate animate-fadeInUp delay-2">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
              How We <span className="text-indigo-600">Empower You</span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Feature 1 */}
              <div className="bg-white p-8 rounded-2xl shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10 border border-gray-100 group section-animate animate-fadeInUp delay-1">
                <Icon path="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311a15.045 15.045 0 01-7.5 0C4.508 17.627 2.25 14.434 2.25 10.5 2.25 6.566 4.508 3.373 7.5 3.373c2.992 0 5.25 3.203 5.25 7.127 0 3.924-2.25 7.127-5.25 7.127z" />
                <h3 className="text-2xl font-bold text-gray-800 text-center mb-3">Personalized Guidance</h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Through engaging quizzes, we uncover your unique strengths and passions, guiding you towards the perfect academic and vocational paths.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-8 rounded-2xl shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10 border border-gray-100 group section-animate animate-fadeInUp delay-2">
                <Icon path="M9 6.75V15m6-6v8.25m.503-12.492A9.752 9.752 0 0118 7.5c0 1.94-.586 3.75-1.5 5.25m-3.75-7.521c-.443-.18-1.02-.323-1.503-.323a9.753 9.753 0 00-4.5 1.036m4.5-1.036A9.753 9.753 0 0112 3c2.485 0 4.75.925 6.5 2.488" />
                <h3 className="text-2xl font-bold text-gray-800 text-center mb-3">Clear Career Pathways</h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Visualize your future with our detailed course-to-career maps, outlining opportunities in government, private sectors, and higher education.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-8 rounded-2xl shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10 border border-gray-100 group section-animate animate-fadeInUp delay-3">
                <Icon path="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m-15.432 0A8.959 8.959 0 003 12c0 .778.099 1.533.284 2.253m15.432 0l-2.829-5.657m-12.596 0L4.28 14.253" />
                <h3 className="text-2xl font-bold text-gray-800 text-center mb-3">College & Scholarship Info</h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Access a directory of nearby government colleges, complete with admission criteria, facilities, and alerts for important dates.
                </p>
              </div>
            </div>
          </section>

          {/* Our Vision Section */}
          <section 
            className="bg-indigo-700 text-white p-10 md:p-16 rounded-2xl shadow-xl text-center section-animate animate-fadeInUp delay-3"
            style={{
                backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.1) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(255, 255, 255, 0.1) 2%, transparent 0%)',
                backgroundSize: '100px 100px',
            }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Vision for a Brighter Future</h2>
            <p className="text-lg md:text-xl font-light leading-relaxed max-w-4xl mx-auto opacity-90">
              We envision a future where every student, regardless of background, has equitable access to superior career guidance. Margdarshak aims to be the catalyst in fostering a generation of confident, well-informed individuals who pursue careers aligned with their true potential.
            </p>
          </section>

          {/* Contact Us Section */}
          <section className="mt-20 section-animate animate-fadeInUp delay-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
              Get in <span className="text-indigo-600">Touch</span>
            </h2>
            <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-lg border border-gray-100">
              <form action="#" method="POST">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input type="text" name="first-name" id="first-name" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out" placeholder="John" />
                  </div>
                  <div>
                    <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input type="text" name="last-name" id="last-name" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out" placeholder="Doe" />
                  </div>
                </div>
                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input type="email" name="email" id="email" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out" placeholder="you@example.com" />
                </div>
                <div className="mb-6">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input type="text" name="subject" id="subject" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out" placeholder="Question about career paths" />
                </div>
                <div className="mb-8">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea id="message" name="message" rows="5" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out" placeholder="Your message here..."></textarea>
                </div>
                <div>
                  <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out transform hover:scale-105">
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-gray-400 text-center py-6 mt-16 border-t-2 border-indigo-700">
          <div className="container mx-auto px-6">
            <p className="text-sm">&copy; {new Date().getFullYear()} Margdarshak. All Rights Reserved. Crafted with <span className="text-red-500 animate-pulse">&hearts;</span> for students.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default AboutPage;

