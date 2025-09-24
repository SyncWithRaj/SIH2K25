import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ClientWrapper from "./components/ClientWrapper";
import 'leaflet/dist/leaflet.css';
import Script from "next/script";
import Navbar from "./components/Navbar";

// Load Google Fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata
export const metadata = {
  title: "MargDarshak",
  description: "One-Stop Personalized Career & Education Advisor (SIH 2025)",
};

// Root Layout
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkProvider afterSignInUrl="/" afterSignUpUrl="/personal-detail">
          <ClientWrapper>
            <Navbar />
            {children}
            <Script
              id="omnidimension-web-widget"
              strategy="afterInteractive" // loads after page is interactive (like async)
              src="https://backend.omnidim.io/web_widget.js?secret_key=1f41b7e01b49016266f3e7812ffc5325"
            />
          </ClientWrapper>
        </ClerkProvider>
      </body>
    </html>
  );
}
