// This is a Server Component, so no 'use client' is needed.

// --- Helper Icon Components (Self-contained SVGs) ---
const HeroIcon = () => (
  <svg
    className="mx-auto h-12 w-12 text-indigo-500 mb-4"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.902 59.902 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
    />
  </svg>
);

const EmptyStateIcon = () => (
    <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
    </svg>
);


// Function to fetch data on the server
async function getScholarships() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  
  try {
    const res = await fetch(`${apiUrl}/api/scholarships`, {
      cache: 'no-store', 
    });

    if (!res.ok) {
      throw new Error('Failed to fetch scholarships');
    }
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error(error);
    return []; 
  }
}

export default async function ScholarshipsPage() {
  const scholarships = await getScholarships();

  return (
    <main className="bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-100 min-h-screen mt-10">
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in-card {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0; /* Start hidden */
        }
      `}</style>

      {/* --- 🎨 Hero Section --- */}
      <div className="text-center py-16 sm:py-20 px-4">
        <HeroIcon className="font-bold"/>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Scholarship Portal
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
          Discover and apply for scholarships to support your educational journey. New opportunities are added regularly.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        {scholarships.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2">
            {scholarships.map((scholarship, index) => (
              <article
                key={scholarship._id}
                className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 flex flex-col fade-in-card"
                // Staggered animation delay for each card
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex-grow">
                   {/* Decorative Accent */}
                  <div className="h-1.5 w-16 bg-indigo-500 rounded-full mb-4"></div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                    {scholarship.name}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {scholarship.description}
                  </p>
                </div>
                <a
                  href={scholarship.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 mt-6 px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg transform transition-transform duration-300 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 hover:scale-105"
                >
                  Visit & Apply
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </a>
              </article>
            ))}
          </div>
        ) : (
          // --- ✨ Enhanced Empty State ---
          <div className="text-center bg-white/80 backdrop-blur-sm p-12 rounded-xl shadow-lg fade-in-card" style={{ animationDelay: '100ms' }}>
            <EmptyStateIcon />
            <h3 className="text-2xl font-semibold text-gray-800">No Scholarships Available</h3>
            <p className="mt-3 text-gray-500 max-w-md mx-auto">
              Our team is working on adding new opportunities. Please check back soon!
            </p>
          </div>
        )}
      </div>
    </main>
  );
}