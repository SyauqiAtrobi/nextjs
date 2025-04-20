"use client";

import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";
import ThemeToggleButton from "@/templates/LandingPage/components/ThemeToggleButton";
import ChatBot from "@/templates/LandingPage/components/ChatBot";

export default function Services() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  const services = [
    {
      title: "Web Development",
      description:
        "Custom websites and web applications using modern technologies.",
    },
    {
      title: "Mobile Development",
      description: "Cross-platform mobile apps with React Native.",
    },
    {
      title: "Backend Development",
      description: "Scalable backend solutions with Node.js and Express.js.",
    },
    {
      title: "UI/UX Design",
      description: "User-centric design using Figma and best practices.",
    },
    {
      title: "SEO Optimization",
      description: "Improve search engine ranking with SEO strategies.",
    },
  ];

  return (
    <div className="bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300 min-h-screen">
      {/* Theme Toggle Button */}
      <div className="fixed bottom-4 left-4 z-50">
        <ThemeToggleButton />
      </div>
      <div className="fixed bottom-20 right-20 z-50">
        <ChatBot />
      </div>
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Portfolio</h1>
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="hover:text-gray-300">
              Home
            </Link>
            <Link href="/about" className="hover:text-gray-300">
              About
            </Link>
            <Link href="/skills" className="hover:text-gray-300">
              Skills
            </Link>
            <Link href="/services" className="hover:text-gray-300">
              Services
            </Link>
            <Link href="/portofolio" className="hover:text-gray-300">
              Portofolio
            </Link>
            <Link href="/contact" className="hover:text-gray-300">
              Contact
            </Link>
          </nav>
          <div className="md:hidden">
            <button onClick={toggleMenu} className="focus:outline-none">
              {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-blue-700 p-4 absolute top-full left-0 w-full shadow-md">
            <Link
              href="/"
              className="block py-2 text-white"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="block py-2 text-white"
              onClick={toggleMenu}
            >
              About
            </Link>
            <Link
              href="/skills"
              className="block py-2 text-white"
              onClick={toggleMenu}
            >
              Skills
            </Link>
            <Link
              href="/services"
              className="block py-2 text-white"
              onClick={toggleMenu}
            >
              Services
            </Link>
            <Link
              href="/portofolio"
              className="block py-2 text-white"
              onClick={toggleMenu}
            >
              Portofolio
            </Link>
            <Link
              href="/contact"
              className="block py-2 text-white"
              onClick={toggleMenu}
            >
              Contact
            </Link>
          </div>
        )}
      </header>

      {/* Services Section */}
      <div className="container mx-auto py-16 px-6">
        <h1 className="text-4xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400">
          My Services
        </h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-gray-100 dark:bg-gray-800 p-6 shadow-lg rounded-lg text-center transition-colors"
            >
              <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
                {service.title}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mt-2">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
