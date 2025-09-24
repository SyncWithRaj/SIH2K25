"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaSpinner, FaExclamationTriangle, FaBookOpen } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// --- Data & Config ---
const TABS_CONFIG = {
  'B.Tech': ['All', 'Computer Science', 'Mechanical', 'Civil', 'Electrical', 'Chemical'],
  'B.Sc': ['All', 'Physics', 'Chemistry', 'Biology', 'IT', 'Maths'],
  'B.Com': ['All', 'Finance', 'Accounting', 'Marketing', 'Economics'],
  'B.A.': ['All', 'History', 'Psychology', 'Economics', 'Political Science', 'Law'],
  'Vocational': ['All', 'Digital Marketing', 'Graphic Design', 'Hospitality', 'Healthcare Tech'],
  'Masters': ['All', 'M.Tech', 'MBA', 'M.Sc', 'M.A.'],
  'PhD': ['All', 'Research', 'Statistics'],
  'BCA': ['All'],
};

const MAIN_TABS = ['All', 'B.Tech', 'B.Sc', 'B.Com', 'B.A.', 'BCA', 'Vocational', 'Masters', 'PhD'];

// --- Reusable Components ---
const ResourceCard = ({ title, description, imageUrl, link }) => (
  <Link href={link} target="_blank" rel="noopener noreferrer" className="block group">
    <motion.div
      whileHover={{ scale: 1.03, y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col"
    >
      <div className="aspect-video overflow-hidden">
        <img
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          src={imageUrl}
          alt={`${title} thumbnail`}
          onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x338/e2e8f0/4a5568?text=Image+Missing' }}
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition-colors duration-300 flex-shrink-0">{title}</h3>
        <p className="mt-2 text-gray-600 text-sm flex-grow">{description}</p>
      </div>
    </motion.div>
  </Link>
);

const LoadingSpinner = () => (
    <div className="flex flex-col justify-center items-center py-20 text-center">
        <FaSpinner className="animate-spin text-5xl text-indigo-500" />
        <p className="mt-4 text-gray-600 font-medium">Loading Resources...</p>
    </div>
);

const ErrorDisplay = ({ message }) => (
    <div className="text-center py-20 bg-red-50/50 border border-red-200 border-dashed p-6 rounded-lg">
        <FaExclamationTriangle className="mx-auto text-5xl text-red-400 mb-4" />
        <h3 className="text-xl font-semibold text-red-800">Failed to load resources</h3>
        <p className="text-red-600 mt-2">{message}</p>
    </div>
);

const NoResultsDisplay = () => (
    <div className="text-center py-20 bg-gray-100/50 border border-gray-200 border-dashed rounded-lg">
        <FaBookOpen className="mx-auto text-5xl text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700">No Resources Found</h3>
        <p className="text-gray-500 mt-2">Please check back later or select a different category.</p>
    </div>
);

// --- Main Page Component ---
export default function ResourcesPage() {
  const [allResources, setAllResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [activeTab, setActiveTab] = useState('All');
  const [activeSubTab, setActiveSubTab] = useState('All');

  useEffect(() => {
    const fetchResources = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch('/api/resources');
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Could not fetch resources.');
            }
            const result = await response.json();
            setAllResources(result.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    fetchResources();
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setActiveSubTab('All');
  };

  const filteredResources = allResources.filter(resource => {
    if (activeTab !== 'All' && resource.category !== activeTab) return false;
    if (TABS_CONFIG[activeTab] && TABS_CONFIG[activeTab].length > 1 && activeSubTab !== 'All' && resource.subCategory !== activeSubTab) return false;
    return true;
  });

  // Animation variants for the card grid
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <main className="bg-slate-50 min-h-screen mt-20">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Study Resources
            </span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
            Explore curated materials for every step of your academic journey.
          </p>
        </div>

        {/* Main Tab Navigation */}
        <div className="mb-6 sticky top-16 bg-slate-50/80 backdrop-blur-sm z-10 py-4">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex flex-wrap justify-center space-x-2 sm:space-x-4 lg:space-x-8" aria-label="Tabs">
              {MAIN_TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  className={`whitespace-nowrap py-3 px-4 border-b-2 font-semibold text-sm rounded-t-lg transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
                    activeTab === tab
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-indigo-600 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Sub-Tab Navigation */}
        <AnimatePresence>
          {TABS_CONFIG[activeTab] && TABS_CONFIG[activeTab].length > 1 && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-12"
            >
              <nav className="flex flex-wrap justify-center gap-3">
                {TABS_CONFIG[activeTab].map(subTab => (
                  <button
                    key={subTab}
                    onClick={() => setActiveSubTab(subTab)}
                    className={`py-2 px-5 rounded-full text-sm font-medium transition-all duration-200 transform focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
                      activeSubTab === subTab
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-white text-gray-700 ring-1 ring-inset ring-gray-200 hover:bg-gray-100 hover:ring-gray-300'
                    }`}
                  >
                    {subTab}
                  </button>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Area */}
        <div className="min-h-[400px]">
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorDisplay message={error} />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeTab}-${activeSubTab}`} // Re-trigger animation on tab change
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              >
                {filteredResources.length > 0 ? (
                  filteredResources.map(resource => (
                    <motion.div key={resource._id} variants={itemVariants}>
                      <ResourceCard {...resource} />
                    </motion.div>
                  ))
                ) : (
                  // The NoResultsDisplay is placed outside the grid for proper layout
                  // To handle it inside, we use a full-span grid item.
                  <div className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4">
                     <NoResultsDisplay />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </main>
  );
}