'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Navigation from '../components/landing/Navigation';
import FeaturesSection from '../components/landing/FeaturesSection';

export default function Home() {
  const router = useRouter();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    setIsLoaded(true);

    // Handle scroll to show/hide scroll-to-top button
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStarted = () => {
    router.push('/login');
  };

  const handleLearnMore = () => {
    const featuresElement = document.getElementById('features');
    if (featuresElement) {
      featuresElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <main id="home" className="flex-1 flex items-center min-h-[calc(100vh-4rem)]">
        <div className="max-w-6xl mx-auto px-4 py-12 w-full">
          <div className="text-center max-w-4xl mx-auto">
            {/* Animated Hero Content */}
            <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <img 
                src="/images/logo-full.svg" 
                alt="ICTBYDULAN.COM" 
                className="h-12 w-auto mx-auto mb-6"
              />
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Digital multiple choice examination platform for Department of Computer & Information Communication Technology
              </p>
            </div>
            
            {/* Animated CTA Buttons */}
            <div className={`transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <button
                  onClick={handleGetStarted}
                  className="bg-gray-900 text-white px-8 py-3 text-base border border-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
                  aria-label="Get started with ICTBYDULAN.COM"
                >
                  Get Started
                </button>
                <button 
                  onClick={handleLearnMore}
                  className="border border-gray-300 text-gray-900 px-8 py-3 text-base hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
                  aria-label="Learn more about our features"
                >
                  Learn More
                </button>
              </div>
            </div>

            {/* Animated Features Section */}
            <div 
              id="features"
              className={`transition-all duration-1000 delay-600 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              <FeaturesSection />
            </div>
          </div>
        </div>
      </main>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-gray-900 text-white p-3 border border-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 transition-all duration-200 z-40 shadow-lg"
          aria-label="Scroll to top"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  );
}
