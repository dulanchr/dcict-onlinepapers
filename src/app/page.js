'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Navigation from '../components/landing/Navigation';
import FeaturesSection from '../components/landing/FeaturesSection';
import Footer from '../components/common/Footer';

export default function Home() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    setIsLoaded(true);
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
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

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <main id="home" className="flex items-center justify-center flex-grow">
        <div className="max-w-6xl mx-auto px-4 py-8 lg:py-12 xl:py-16 w-full">
          <div className="text-center max-w-4xl mx-auto">
            {/* Animated Hero Content */}
            <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            
              <img 
                src="/images/logo-full.svg" 
                alt="ICTBYDULAN.COM" 
                className="h-7 lg:h-10 w-auto mx-auto mb-3 lg:mb-4"
              />
              <div className="flex gap-2 items-start justify-center text-black">
                <p className="text-[22px] uppercase font-light tracking-tight">Technology</p>
                <p className="text-[22px] uppercase font-['Rashmi'] tracking-tight">හරියට ඉගෙන ගන්න..</p>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <FeaturesSection />
          </div>
        </div>
        
      </main>
    
      <Footer />
    </div>
  );
}
