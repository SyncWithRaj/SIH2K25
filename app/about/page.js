import React from 'react';

const AboutPage = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen text-gray-800 font-sans mt-18
    ">
      {/* Header */}
      <header className="bg-white shadow-lg py-8">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-extrabold text-blue-800 tracking-tight leading-tight">
            About <span className="text-indigo-600">MargDarshak</span>
          </h1>
          <p className="text-xl text-gray-600 mt-3 font-light">
            Your Beacon for Personalized Career & Education Guidance
          </p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-16">
        {/* Our Mission Section */}
        <section className="bg-white p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out mb-16 border border-blue-100">
          <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">Our Mission</h2>
          <div className="max-w-4xl mx-auto text-lg leading-relaxed text-gray-700">
            <p className="mb-4">
              In an increasingly complex educational landscape, many students and their families face significant hurdles in navigating academic and career choices. From selecting the right subject stream after Class 10 or 12 to understanding the long-term career prospects of various degree programs, the path forward often seems unclear. This uncertainty can lead to suboptimal decisions, affecting future opportunities and sometimes even leading to dropouts.
            </p>
            <p className="font-medium text-blue-700">
              <strong>Margdarshak</strong> stands as a solution to this critical need. Our mission is to empower every student with precise, personalized, and accessible guidance, illuminating the diverse educational and career pathways available. We are dedicated to transforming uncertainty into clarity, enabling students to make informed decisions that align with their true potential and aspirations.
            </p>
          </div>
        </section>

        {/* What We Do Section */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
            How We <span className="text-indigo-600">Empower You</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Feature 1: Aptitude & Interest-Based Guidance */}
            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 border border-indigo-50">
              <div className="text-indigo-500 mb-4">
                {/* Icon Placeholder - You can replace with actual SVG icons */}
                <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.12 2-2.5 2S4 20.105 4 19s1.12-2 2.5-2S9 17.895 9 19zm12 0c0 1.105-1.12 2-2.5 2S16 20.105 16 19s1.12-2 2.5-2S21 17.895 21 19zm-9-9V3.615A2.25 2.25 0 0114.25 3h1.018A2.25 2.25 0 0117.5 5.25V6H12z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-blue-700 text-center mb-3">Personalized Guidance</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Through engaging aptitude and interest quizzes, we uncover your unique strengths and passions, guiding you towards the perfect academic and vocational paths.
              </p>
            </div>

            {/* Feature 2: Course-to-Career Mapping */}
            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 border border-indigo-50">
              <div className="text-indigo-500 mb-4">
                {/* Icon Placeholder */}
                <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2zm3-13H5v10h14V8h-3l-4 4-4-4z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-blue-700 text-center mb-3">Clear Career Pathways</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Visualize your future with our detailed course-to-career maps, outlining opportunities in government, private sectors, entrepreneurship, and higher education.
              </p>
            </div>

            {/* Feature 3: Nearby Government Colleges Directory & Alerts */}
            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 border border-indigo-50">
              <div className="text-indigo-500 mb-4">
                {/* Icon Placeholder */}
                <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-blue-700 text-center mb-3">Local College & Scholarship Info</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Access a comprehensive directory of nearby government colleges, complete with admission criteria, facilities, and timely alerts for important dates and scholarships.
              </p>
            </div>
          </div>
        </section>

        {/* Our Vision Section */}
        <section className="bg-indigo-600 text-white p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out text-center">
          <h2 className="text-4xl font-bold mb-6">Our Vision for a Brighter Future</h2>
          <p className="text-xl font-light leading-relaxed max-w-4xl mx-auto opacity-90">
            We envision a future where every student, regardless of their socio-economic background or geographical location, has equitable access to superior career and educational guidance. Margdarshak aims to be the catalyst in fostering a generation of confident, well-informed individuals who actively contribute to society by pursuing careers aligned with their true potential. We believe in strengthening the perception and efficacy of government colleges as pillars of career development and academic excellence.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 text-center py-6 mt-16">
        <p className="text-sm">&copy; {new Date().getFullYear()} Margdarshak. All Rights Reserved. Crafted with <span className="text-red-500">&hearts;</span> for students.</p>
      </footer>
    </div>
  );
};

export default AboutPage;