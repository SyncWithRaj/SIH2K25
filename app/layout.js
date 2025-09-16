import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ClientWrapper from "./components/ClientWrapper";
import 'leaflet/dist/leaflet.css';

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
  title: "EduCareer Advisor",
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
            {children}
          </ClientWrapper>
        </ClerkProvider>
      </body>
    </html>
  );
}
