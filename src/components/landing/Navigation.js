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
          <div 
            className="box-border content-stretch flex gap-2 md:gap-3 lg:gap-[12px] h-[82px] items-center px-4 md:px-8 lg:px-[60px] py-0 relative shrink-0 cursor-pointer border-l border-r border-b border-gray-300 transition-colors duration-300 hover:bg-orange-500 group"
            onClick={handleLogin}
          >
            <p className="font-['Inter',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] md:text-[15px] lg:text-[16px] text-nowrap whitespace-pre text-gray-900 group-hover:text-white transition-colors duration-300">
              Student Portal
            </p>
            
            <div className="flex items-center justify-center relative shrink-0">
              <Image 
                src="/images/arrow.svg" 
                alt="Arrow" 
                width={16}
                height={16}
                className="w-4 h-4 md:w-[18px] md:h-[18px] lg:w-[19px] lg:h-[19px] transition-colors duration-300 group-hover:brightness-0 group-hover:invert"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const MobileNavigation = () => (
    <div className="content-stretch flex items-center relative size-full">
      <div className="absolute border-[0px_0px_0.5px] border-solid inset-0 pointer-events-none border-gray-300" />
      <div className="basis-0 content-stretch flex grow h-full items-center justify-between min-h-px min-w-px relative shrink-0">
        {/* Logo */}
        <div className="box-border content-stretch flex h-[65px] min-[800px]:h-[75px] sm:h-[82px] items-center px-3 min-[800px]:px-5 sm:px-6 md:px-[30px] py-0 relative shrink-0">
          <LogoComponent />
        </div>
        
        {/* Mobile Menu Button */}
        <div className="box-border content-stretch flex h-[65px] min-[800px]:h-[75px] sm:h-[82px] items-center px-3 min-[800px]:px-5 sm:px-6 md:px-[30px] py-0 relative shrink-0">
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
    <header 
      className={`main-header w-full sticky top-0 z-[999] transition-all duration-300 ${
        isSticky 
          ? 'bg-white/98 backdrop-blur-md shadow-md' 
          : 'bg-white'
      }`}
    >
      <div className="header-upper">
        <div className="w-full">
          <div className="header-inner h-[65px] min-[800px]:h-[75px] sm:h-[82px]">
            {!isClient ? (
              <DesktopNavigation />
            ) : windowWidth >= 1280 ? (
              <DesktopNavigation />
            ) : (
              <MobileNavigation />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu - Full Screen */}
      <AnimatePresence>
        {isMenuOpen && isClient && windowWidth < 1280 && (
          <motion.div 
            className="fixed inset-0 bg-white z-50 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header with Logo and Close Button */}
            <div className="border-b border-gray-200">
              <div className="h-[65px] min-[800px]:h-[75px] sm:h-[82px] flex items-center justify-between px-3 min-[800px]:px-5 sm:px-6 md:px-[30px]">
                <LogoComponent />
                
                {/* Close Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(false);
                  }}
                  className="relative inline-flex flex-col items-center justify-center w-10 h-10 text-gray-600 hover:text-gray-900 focus:outline-none touch-manipulation"
                  aria-label="Close navigation menu"
                >
                  <motion.span 
                    className="block w-6 h-0.5 bg-current mb-1.5"
                    initial={{ rotate: 0, translateY: 0 }}
                    animate={{ rotate: 45, translateY: 8 }}
                    transition={{ duration: 0.2 }}
                  />
                  <motion.span 
                    className="block w-6 h-0.5 bg-current mb-1.5"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                  <motion.span 
                    className="block w-6 h-0.5 bg-current"
                    initial={{ rotate: 0, translateY: 0 }}
                    animate={{ rotate: -45, translateY: -8 }}
                    transition={{ duration: 0.2 }}
                  />
                </button>
              </div>
            </div>

            {/* Navigation Content - Centered */}
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-65px)] min-[800px]:min-h-[calc(100vh-75px)] sm:min-h-[calc(100vh-82px)] px-6 py-8">
              <motion.ul 
                className="navigation space-y-2 w-full max-w-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {navigationLinks.map((link, index) => (
                  <motion.li 
                    key={link.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: 0.15 + index * 0.05 }}
                  >
                    <Link 
                      href={link.id} 
                      className={`block text-center text-lg min-[800px]:text-xl sm:text-2xl font-medium py-4 min-[800px]:py-5 px-4 transition-colors rounded-lg ${
                        link.isSinhala ? 'font-malithi text-[20px] min-[800px]:text-[24px] sm:text-[28px]' : 'font-inter'
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
                  className="pt-6 min-[800px]:pt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: 0.35 }}
                >
                  <button
                    onClick={handleLogin}
                    className="w-full bg-gray-900 text-white px-6 min-[800px]:px-8 py-4 min-[800px]:py-5 text-base min-[800px]:text-lg sm:text-xl font-medium transition-all duration-200 hover:bg-gray-800 active:scale-[0.98] flex items-center justify-center gap-3 font-['Inter',sans-serif] rounded-lg shadow-lg touch-manipulation"
                  >
                    Student Portal
                    <svg 
                      className="w-5 h-5 min-[800px]:w-6 min-[800px]:h-6" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </motion.li>
              </motion.ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
