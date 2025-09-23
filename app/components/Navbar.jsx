"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";

// This array of links remains the same
const navLinks = [
  { href: "/", label: "Home" },
  { href: "/career-map", label: "Career Tree" },
  { href: "/colleges", label: "Find Colleges" },
  { href: "/resources", label: "Resources" },
  { href: "/about", label: "About Us" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed top-3 left-10 right-10 z-50 py-2 bg-gray-500/20 rounded-full backdrop-blur-md shadow-sm">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo / Brand Name */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/logo.jpg"
                alt="MargDarshak Logo"
                className="h-12 w-auto rounded-xl" // You can adjust the height (h-9) as needed
              />
              <span
                className="
        text-3xl font-extrabold
        text-transparent
        bg-clip-text
        bg-gradient-to-r from-indigo-600 to-blue-500
      "
              >
                MargDarshak
              </span>
            </Link>
          </div>

          {/* Desktop Menu Links */}
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={`px-4 py-2 rounded-full text-base font-medium transition-colors duration-200 ${pathname === link.href
                ? 'bg-indigo-100 text-indigo-700 font-semibold'
                : 'text-slate-700 hover:bg-indigo-50/70 hover:text-indigo-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Authentication Buttons */}
          <div className="hidden md:block">
            <SignedOut>
              <div className="flex items-center space-x-2">
                <SignInButton mode="modal">
                  <button className="text-slate-700 hover:text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold transition-colors">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm hover:shadow-md">
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center space-x-4">
                <Link href="/profile" className={`px-4 py-2 rounded-full text-base font-medium transition-colors duration-200 ${pathname === '/profile'
                  ? 'bg-indigo-100 text-indigo-700 font-semibold'
                  : 'text-slate-700 hover:bg-indigo-50/70 hover:text-indigo-700'
                  }`}
                >
                  Dashboard
                </Link>
                <div className="w-9 h-8"> {/* Container to prevent layout shift */}
                  <UserButton afterSignOutUrl="/" />
                </div>
              </div>
            </SignedIn>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <SignedIn>
              <div className="mr-2 w-9 h-9"> <UserButton afterSignOutUrl="/" /></div>
            </SignedIn>
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-full text-slate-700 bg-slate-100 hover:bg-slate-200 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Now with smooth animation */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-slate-200/80">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className={`block px-3 py-2 rounded-full text-base font-medium ${pathname === link.href
              ? 'text-indigo-700 bg-indigo-100'
              : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Mobile Auth Section */}
          <div className="pt-4 mt-2 border-t border-slate-200/80">
            <SignedIn>
              <Link href="/profile" onClick={() => setIsOpen(false)} className={`block px-3 py-2 rounded-full text-base font-medium ${pathname === '/profile'
                ? 'text-indigo-700 bg-indigo-100'
                : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                Dashboard
              </Link>
            </SignedIn>
            <SignedOut>
              <div className="space-y-2">
                <SignInButton mode="modal">
                  <button onClick={() => setIsOpen(false)} className="w-full text-left block px-3 py-2 rounded-full text-base font-medium text-slate-700 hover:bg-slate-100">Sign In</button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button onClick={() => setIsOpen(false)} className="w-full text-left block bg-indigo-600 text-white px-4 py-2 rounded-full text-base font-semibold hover:bg-indigo-700 transition-colors shadow-sm">Sign Up</button>
                </SignUpButton>
              </div>
            </SignedOut>
          </div>
        </div>
      </div>
    </header>
  );
}