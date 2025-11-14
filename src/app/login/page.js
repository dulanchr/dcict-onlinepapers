'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import LoginForm from '../../components/forms/LoginForm';
import Link from 'next/link';
import { motion } from 'framer-motion';
import GlowHoverSimple from '../../components/common/animations/GlowHoverSimple';

export default function LoginPage() {
  const { currentUser, loading } = useAuth();
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Trigger animations after component mounts
  useEffect(() => {
    // Add a small delay to ensure the animation is visible
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    if (!loading && currentUser) {
      setIsRedirecting(true);
      if (currentUser.role === 'teacher') {
        router.push('/teacher');
      } else if (currentUser.role === 'student') {
        router.push('/student');
      }
    }

    return () => clearTimeout(timer);
  }, [currentUser, loading, router]);

  if (loading || isRedirecting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin mx-auto"></div>
          <p className="mt-3 text-gray-600 text-sm">{isRedirecting ? 'Redirecting...' : 'Loading...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header with Back to Home Link */}
      <div className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-[52px] sm:h-[66px]">
          <div className="h-full flex items-center justify-between">
            {/* Back to Home Button */}
            <motion.div whileHover="hover" initial="rest" className="flex-shrink-0">
              <Link 
                href="/" 
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-300 ease-in-out"
              >
                <motion.svg 
                  className="w-4 h-4 sm:w-5 sm:h-5 rotate-180" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  variants={{
                    rest: { x: 0 },
                    hover: { x: 4 }
                  }}
                  transition={{
                    duration: 0.3,
                    ease: [0.4, 0.0, 0.2, 1]
                  }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </motion.svg>
                <span className="text-[11.2px] md:text-[12px] lg:text-[12.8px] font-normal hidden sm:inline whitespace-nowrap">Back to Home</span>
              </Link>
            </motion.div>

            {/* Student Portal Logo - Center (Mobile Only) */}
            <Link href="/" className="absolute left-1/2 transform -translate-x-1/2 flex items-center sm:hidden">
              <img 
                src="/images/logo.svg" 
                alt="Student Portal" 
                className="h-6 w-auto cursor-pointer hover:opacity-80 transition-opacity"
                style={{ height: '24px', width: 'auto' }}
              />
            </Link>

            {/* Profile and Logo - Right */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <img 
                src="/images/dulanchathuranga.png" 
                alt="Profile" 
                className="h-8 sm:h-10 w-auto rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                style={{ height: '40px', width: 'auto' }}
              />
              <img 
                src="/images/logo.svg" 
                alt="ICTBYDULAN.COM" 
                className="hidden sm:block h-6 sm:h-8 w-auto cursor-pointer hover:opacity-80 transition-opacity"
                style={{ height: '32px', width: 'auto' }}
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Login Form Section */}
      <div className="flex-1 flex items-center justify-center px-4 py-6 sm:py-8">
        <div className="w-full max-w-sm mx-auto">
          <div className={`transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <GlowHoverSimple>
              <div className="border border-gray-300 bg-white p-6 sm:p-8 rounded-lg relative z-10">
                <div className="text-center mb-6 sm:mb-8">
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">Student Portal</h2>
                  <p className="text-gray-600 text-xs sm:text-sm font-light">ictbydulan.com</p>
                </div>

                <LoginForm />
              </div>
            </GlowHoverSimple>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 py-3 sm:py-4 px-4">
        <p className="text-center text-xs text-gray-500 font-light">
          © 2025 ICT by Dulan Chathuranga. All rights reserved.
        </p>
      </div>
    </div>
  );
}
