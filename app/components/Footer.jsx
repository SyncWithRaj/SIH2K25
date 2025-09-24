import React from 'react';

// --- Reusable SVG Icon Component ---
const SocialIcon = ({ href, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-slate-400 hover:text-indigo-400 transition-colors duration-300"
  >
    {children}
  </a>
);

// --- Main Footer Component ---
export default function Footer() {
  return (
    <footer className="bg-slate-800 text-slate-300 font-sans">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* About Section */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <h3 className="text-xl font-bold text-white mb-4">
              <span className="text-indigo-400">Marg</span>Darshak
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering students with personalized career and education guidance to unlock their true potential.
            </p>
          </div>

          {/* Quick Links Section */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="/about" className="text-slate-400 hover:text-indigo-400 transition-colors">About Us</a></li>
              <li><a href="/colleges" className="text-slate-400 hover:text-indigo-400 transition-colors">Find Colleges</a></li>
              <li><a href="/assessment" className="text-slate-400 hover:text-indigo-400 transition-colors">Take Assessment</a></li>
              <li><a href="/contact" className="text-slate-400 hover:text-indigo-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Resources Section */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="/resources/btech" className="text-slate-400 hover:text-indigo-400 transition-colors">B.Tech Guides</a></li>
              <li><a href="/resources/bcom" className="text-slate-400 hover:text-indigo-400 transition-colors">B.Com Guides</a></li>
              <li><a href="/resources/ba" className="text-slate-400 hover:text-indigo-400 transition-colors">B.A. Guides</a></li>
              <li><a href="/blog" className="text-slate-400 hover:text-indigo-400 transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Connect With Us Section */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <SocialIcon href="https://twitter.com">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.223.085a4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path></svg>
              </SocialIcon>
              <SocialIcon href="https://linkedin.com">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"></path></svg>
              </SocialIcon>
               <SocialIcon href="https://instagram.com">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.585-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.585-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.585.069-4.85c.149-3.225 1.664-4.771 4.919-4.919C8.415 2.175 8.796 2.163 12 2.163zm0 1.802c-3.118 0-3.488.012-4.7.068-2.736.124-3.914 1.3-4.04 4.04-.056 1.216-.067 1.583-.067 4.7s.011 3.484.067 4.7c.127 2.736 1.304 3.913 4.04 4.04 1.212.056 1.582.068 4.7.068s3.488-.012 4.7-.068c2.736-.124 3.913-1.304 4.04-4.04.056-1.216.068-1.584.068-4.7s-.012-3.484-.068-4.7c-.127-2.736-1.304-3.913-4.04-4.04-1.212-.056-1.582-.068-4.7-.068zm0 5.438c-2.427 0-4.388 1.96-4.388 4.388s1.96 4.388 4.388 4.388 4.388-1.96 4.388-4.388-1.96-4.388-4.388-4.388zm0 7.168c-1.523 0-2.76-1.237-2.76-2.78s1.237-2.78 2.76-2.78 2.76 1.237 2.76 2.78-1.237 2.78-2.76 2.78zm4.965-7.854c-.606 0-1.096.49-1.096 1.096s.49 1.096 1.096 1.096 1.096-.49 1.096-1.096-.49-1.096-1.096-1.096z"></path></svg>
              </SocialIcon>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-700 text-center text-sm text-slate-400">
          <p>© {new Date().getFullYear()} MargDarshak | Built with ❤️ for students everywhere.</p>
        </div>
      </div>
    </footer>
  );
}
