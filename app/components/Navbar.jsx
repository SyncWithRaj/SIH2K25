"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { UserButton, SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg-px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* ## Logo / Brand Name */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-indigo-600 hover:text-indigo-700">
              MargDarshak
            </Link>
          </div>

          {/* ## Desktop Menu Links */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/aptitude-test" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              Aptitude Test
            </Link>
            <Link href="/career-map" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              Career Tree
            </Link>
            <Link href="/colleges" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              Find Colleges
            </Link>
            <Link href="/resources" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              Resources
            </Link>
          </div>

          {/* ## Authentication Buttons */}
          <div className="hidden md:block">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="ml-2 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              {/* ✅ ADDED a wrapper div for alignment */}
              <div className="flex items-center space-x-4">
                {/* ✅ ADDED Dashboard Button */}
                <Link href="/dashboard" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </Link>
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
          </div>

          {/* ## Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ## Mobile Menu */}
      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
            <Link href="/aptitude-test" className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">
              Aptitude Test
            </Link>
            <Link href="/career-map" className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">
              Career Tree
            </Link>
            <Link href="/colleges" className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">
              Find Colleges
            </Link>
            <Link href="/resources" className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">
              Resources
            </Link>

            {/* Mobile Auth Section */}
            <div className="pt-4 pb-3 border-t border-gray-200">
                <SignedOut>
                    <div className="flex flex-col space-y-2">
                        <SignInButton mode="modal">
                            <button className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">Sign In</button>
                        </SignInButton>
                        <SignUpButton mode="modal">
                             <button className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">Sign Up</button>
                        </SignUpButton>
                    </div>
                </SignedOut>
                <SignedIn>
                    {/* ✅ ADDED Dashboard link for mobile */}
                    <Link href="/dashboard" className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">
                      Dashboard
                    </Link>
                    <div className="mt-2 px-3 flex items-center">
                        <span className="mr-3 text-base font-medium text-gray-700">Profile:</span>
                        <UserButton afterSignOutUrl="/" />
                    </div>
                </SignedIn>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}