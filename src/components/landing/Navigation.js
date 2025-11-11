'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1920);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathName]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    { label: 'Home', id: '/', isSinhala: false },
    { label: 'පංති', id: '/classes', isSinhala: true },
    { label: 'පරීක්ෂණ', id: '/exams', isSinhala: true },
    { label: 'Contact', id: '/contact', isSinhala: false }
  ];

  const LogoComponent = () => (
    <motion.div 
      className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <div className="[grid-area:1_/_1] relative w-[44px] h-[44px] md:w-[48px] md:h-[48px] lg:w-[50.573px] lg:h-[50.573px]">
        <Image 
          src="/images/profile.png"
          alt="Logo"
          width={51}
          height={51}
          className="block size-full rounded-full object-cover"
          priority
        />
      </div>
    </motion.div>
  );

  const DesktopNavigation = () => (
    <div className="content-stretch flex gap-[50px] items-center relative size-full">
      <div className="absolute border-[0px_0px_0.5px] border-solid inset-0 pointer-events-none border-gray-300" />
      <div className="basis-0 flex flex-row grow items-center self-stretch shrink-0 px-4 md:px-8 lg:px-[120px]">
        <div className="basis-0 content-stretch flex grow h-full items-center justify-between min-h-px min-w-px relative shrink-0">
          {/* Logo and Navigation */}
          <div className="box-border content-stretch flex gap-4 md:gap-8 lg:gap-[50px] h-[82px] items-center px-4 md:px-8 lg:px-[60px] py-0 relative shrink-0">
            <LogoComponent />
            <div className="content-stretch flex font-normal gap-4 md:gap-6 lg:gap-[34.692px] items-center leading-[normal] not-italic relative shrink-0 text-[14px] md:text-[15px] lg:text-[16px] text-black text-nowrap whitespace-pre">
              {navigationLinks.map((link) => (
                <motion.div
                  key={link.label}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link 
                    href={link.id} 
                    className={`relative shrink-0 transition-colors duration-200 ${
                      link.isSinhala ? 'font-malithi text-[16px] md:text-[17px] lg:text-[18px]' : 'font-inter'
                    } ${
                      pathName === link.id 
                        ? 'text-orange-500 font-medium' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    style={link.isSinhala ? { fontFamily: 'Malithi, sans-serif' } : {}}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Student Portal Button */}
          <motion.div 
            className="box-border content-stretch flex gap-2 md:gap-3 lg:gap-[12px] h-[82px] items-center px-4 md:px-8 lg:px-[60px] py-0 relative shrink-0 cursor-pointer overflow-hidden group border-l border-r border-b border-gray-300"
            onClick={handleLogin}
            initial={{ backgroundColor: "rgba(255, 255, 255, 1)" }}
            whileHover={{ backgroundColor: "rgba(243, 244, 246, 1)" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Sweep animation background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />
            
            <p className="font-['Inter',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] md:text-[15px] lg:text-[16px] text-nowrap whitespace-pre z-10 text-gray-900">
              Student Portal
            </p>
            
            <div className="flex items-center justify-center relative shrink-0 z-10">
              <Image 
                src="/images/arrow.svg" 
                alt="Arrow" 
                width={16}
                height={16}
                className="w-4 h-4 md:w-[18px] md:h-[18px] lg:w-[19px] lg:h-[19px]"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );

  const MobileNavigation = () => (
    <div className="content-stretch flex items-center relative size-full">
      <div className="absolute border-[0px_0px_0.5px] border-solid inset-0 pointer-events-none border-gray-300" />
      <div className="basis-0 content-stretch flex grow h-full items-center justify-between min-h-px min-w-px relative shrink-0">
        {/* Logo */}
        <div className="box-border content-stretch flex h-[70px] sm:h-[82px] items-center px-4 sm:px-6 md:px-[30px] py-0 relative shrink-0">
          <LogoComponent />
        </div>
        
        {/* Mobile Menu Button */}
        <div className="box-border content-stretch flex h-[70px] sm:h-[82px] items-center px-4 sm:px-6 md:px-[30px] py-0 relative shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            className="relative inline-flex flex-col items-center justify-center w-10 h-10 text-gray-600 hover:text-gray-900 focus:outline-none touch-manipulation"
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMenuOpen}
          >
            <motion.span 
              className="block w-6 h-0.5 bg-current mb-1.5"
              animate={{
                rotate: isMenuOpen ? 45 : 0,
                translateY: isMenuOpen ? 8 : 0,
              }}
              transition={{ duration: 0.2 }}
            />
            <motion.span 
              className="block w-6 h-0.5 bg-current mb-1.5"
              animate={{ opacity: isMenuOpen ? 0 : 1 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span 
              className="block w-6 h-0.5 bg-current"
              animate={{
                rotate: isMenuOpen ? -45 : 0,
                translateY: isMenuOpen ? -8 : 0,
              }}
              transition={{ duration: 0.2 }}
            />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <motion.header 
      className="main-header w-full"
      animate={{ 
        position: isSticky ? "fixed" : "relative",
        top: isSticky ? 0 : "auto",
        left: isSticky ? 0 : "auto",
        right: isSticky ? 0 : "auto",
        zIndex: 999,
        backgroundColor: isSticky ? "rgba(255, 255, 255, 0.98)" : "rgba(255, 255, 255, 1)",
      }}
      transition={{ duration: 0.2 }}
      style={{
        boxShadow: isSticky ? "0 2px 8px rgba(0, 0, 0, 0.1)" : "none",
        backdropFilter: isSticky ? "blur(10px)" : "none",
      }}
    >
      <div className="header-upper">
        <div className="w-full">
          <div className="header-inner h-[70px] sm:h-[82px]">
            {!isClient ? (
              <DesktopNavigation />
            ) : windowWidth >= 1024 ? (
              <DesktopNavigation />
            ) : (
              <MobileNavigation />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && isClient && windowWidth < 1024 && (
          <>
            {/* Backdrop Overlay */}
            <motion.div 
              className="fixed inset-0 bg-black/30 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMenuOpen(false)}
            />
            
            <motion.div 
              className="relative z-50 bg-white border-b border-gray-200 shadow-lg"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 max-w-screen-lg">
                <ul className="navigation space-y-2">
                  {navigationLinks.map((link, index) => (
                    <motion.li 
                      key={link.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <Link 
                        href={link.id} 
                        className={`block text-base sm:text-lg font-medium py-3 px-2 transition-colors rounded-lg ${
                          link.isSinhala ? 'font-malithi text-[18px] sm:text-[20px]' : 'font-inter'
                        } ${
                          pathName === link.id 
                            ? 'text-orange-500 bg-orange-50' 
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                        style={link.isSinhala ? { fontFamily: 'Malithi, sans-serif' } : {}}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                  <motion.li 
                    className="pt-3 border-t border-gray-200"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: 0.2 }}
                  >
                    <button
                      onClick={handleLogin}
                      className="w-full bg-gray-900 text-white px-6 py-3.5 sm:py-4 text-base sm:text-lg font-medium transition-all duration-200 hover:bg-gray-800 active:scale-[0.98] flex items-center justify-center gap-2 font-['Inter',sans-serif] rounded-lg shadow-sm touch-manipulation"
                    >
                      Student Portal
                      <svg 
                        className="w-4 h-4 sm:w-5 sm:h-5" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </motion.li>
                </ul>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
