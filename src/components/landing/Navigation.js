'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 85);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathName]);

  const handleLogin = () => {
    router.push('/login');
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('header')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const navigationLinks = [
    { label: 'Home', id: '/' },
    { label: 'Classes', id: '/classes' },
    { label: 'Exams', id: '/exams' },
    { label: 'Contact', id: '/contact' }
  ];

  return (
    <header className={`main-header ${isSticky ? 'fixed-header' : ''}`}>
      <div className="header-upper">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="header-inner flex items-center justify-between py-4">
            {/* Logo Section */}
            <div className="logo-outer">
              <div className="logo">
                <Link href="/">
                  <Image 
                    width={120} 
                    height={40} 
                    sizes="100vw" 
                    src="/images/logo.svg" 
                    alt="ICTBYDULAN.COM" 
                    title="ICTBYDULAN.COM" 
                    className="h-10 w-auto"
                  />
                </Link>
              </div>
            </div>

            {/* Navigation Section */}
            <div className="nav-outer mx-auto hidden lg:block">
              <nav className="main-menu">
                <div className={`navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
                  <ul className="navigation flex space-x-8">
                    {navigationLinks.map((link) => (
                      <li key={link.label}>
                        <Link 
                          href={link.id} 
                          className={`nav-link-click text-gray-700 hover:text-gray-900 font-medium transition-colors ${
                            pathName === link.id ? 'text-indigo-600' : ''
                          }`}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </nav>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="navbar-toggle relative inline-flex flex-col items-center justify-center w-8 h-8 text-gray-600 hover:text-gray-900 focus:outline-none"
                aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={isMenuOpen}
              >
                <span className={`icon-bar block w-6 h-0.5 bg-current mb-1 transition-all duration-200 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                <span className={`icon-bar block w-6 h-0.5 bg-current mb-1 transition-all duration-200 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`icon-bar block w-6 h-0.5 bg-current transition-all duration-200 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
              </button>
            </div>

            {/* Action Button */}
            <div className="menu-btns hidden lg:block">
              <button
                onClick={handleLogin}
                className="theme-btn bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-500 transition-colors font-medium flex items-center gap-2"
              >
                Student Portal
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <>
          {/* Backdrop Overlay */}
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden" />
          
          <div className="lg:hidden relative z-50 bg-white border-t border-gray-200 shadow-lg">
            <div className="container mx-auto px-4 py-4">
              <ul className="navigation space-y-4">
                {navigationLinks.map((link) => (
                  <li key={link.label}>
                    <Link 
                      href={link.id} 
                      className={`nav-link-click block text-gray-700 hover:text-gray-900 font-medium py-2 transition-colors ${
                        pathName === link.id ? 'text-indigo-600' : ''
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li className="pt-4 border-t border-gray-200">
                  <button
                    onClick={handleLogin}
                    className="w-full theme-btn bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-500 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    Student Portal
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .main-header {
          position: relative;
          z-index: 999;
          background: white;
          border-bottom: 1px solid #e5e7eb;
          transition: all 0.3s ease;
        }
        
        .main-header.fixed-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(8px);
          background: rgba(255, 255, 255, 0.95);
        }
        
        .icon-bar {
          transform-origin: center;
        }
      `}</style>
    </header>
  );
}
