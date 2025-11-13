'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Navigation from '../../components/landing/Navigation';
import Footer from '../../components/common/Footer';
import ClassCard from '../../components/classes/ClassCard';

export default function Classes() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    setIsLoaded(true);
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <main className="flex items-center justify-center flex-grow">
        <div className="max-w-6xl mx-auto px-4 py-8 lg:py-12 xl:py-16 w-full">
          <div className="text-center max-w-4xl mx-auto">
            {/* Animated Hero Content */}
            <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="flex items-center justify-center gap-3 lg:gap-4 mb-3 lg:mb-4">
                <img 
                  src="/images/dulanchathuranga.png" 
                  alt="Profile" 
                  style={{ height: '100px', width: 'auto' }}
                  className="lg:h-9 rounded-xl"
                />
                <img 
                  src="/images/logo.svg" 
                  alt="ICTBYDULAN.COM" 
                  className="h-8 md:h-12 lg:h-20 w-auto"
                />
              </div>
              <div className="flex gap-2 items-start justify-center text-black">
                <p className="text-base md:text-lg lg:text-[22px] uppercase font-light tracking-normal">Classes</p>
                <p className="text-base md:text-lg lg:text-[22px] uppercase tracking-normal" style={{ fontFamily: 'Rashmi, sans-serif' }}>පන්ති</p>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <ClassCard />
          </div>
        </div>
      </main>
    
      <Footer />
    </div>
  );
}
