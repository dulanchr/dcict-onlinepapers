'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import GlowHover from '../animations/GlowHover';

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
    { 
      label: 'Home', 
      id: '/', 
      isSinhala: false
    },
    { 
      label: 'Classes', 
      id: '/classes', 
      isSinhala: false
    },
    { 
      label: 'Exams', 
      id: '/exams', 
      isSinhala: false
    },
    { 
      label: 'Contact', 
      id: '/contact', 
      isSinhala: false
    }
  ];

  const LogoComponent = () => (
    <motion.div 
      className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0"
    >
       <Image 
          src="/images/logo.svg"
          alt="Logo"
          width={150}
          height={150}
          className="block size-half object-cover"
          priority
        />
    </motion.div>
  );

  const DesktopNavigation = () => (
    <div className="content-stretch flex gap-[50px] items-center relative size-full">
      <div className="absolute border-[0px_0px_0.5px] border-solid inset-0 pointer-events-none border-gray-300" />
      <div className="basis-0 flex flex-row grow items-center self-stretch shrink-0">
        <div className="basis-0 content-stretch flex grow h-full items-center justify-between min-h-px min-w-px relative shrink-0">
          {/* Logo and Navigation */}
          <div className="box-border content-stretch flex gap-4 md:gap-6 lg:gap-[30px] h-[66px] items-center px-[60px] py-0 relative shrink-0">
            <LogoComponent />
            <div className="content-stretch flex font-normal gap-3 md:gap-4 lg:gap-[20px] items-center leading-[normal] not-italic relative shrink-0 text-[11.2px] md:text-[12px] lg:text-[12.8px] text-black text-nowrap whitespace-pre">
              {navigationLinks.map((link) => (
                <Link 
                  key={link.label}
                  href={link.id} 
                  className={`relative shrink-0 transition-colors duration-300 ease-in-out ${
                    link.isSinhala ? 'font-malithi text-[12.8px] md:text-[13.6px] lg:text-[14.4px]' : ''
                  } ${
                    (pathName === link.id || (link.id !== '/' && pathName.startsWith(link.id)))
                      ? 'text-gray-800 font-medium' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  style={link.isSinhala ? { fontFamily: 'Malithi, sans-serif' } : {}}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Student Portal Button */}
          <div className="box-border content-stretch flex h-[66px] items-center px-[60px] py-0 relative shrink-0">
            <GlowHover>
              <motion.button
                onClick={handleLogin}
                className="px-6 py-2.5 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 transition-all duration-200 flex items-center gap-2 relative z-10"
                whileHover="hover"
                initial="rest"
              >
                Student Portal
                <motion.svg 
                  className="w-4 h-4" 
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
              </motion.button>
            </GlowHover>
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
        <div className="box-border content-stretch flex h-[52px] min-[800px]:h-[60px] sm:h-[66px] items-center px-3 min-[800px]:px-5 sm:px-6 md:px-[30px] py-0 relative shrink-0">
          <LogoComponent />
        </div>
        
        {/* Mobile Menu Button */}
        <div className="box-border content-stretch flex h-[52px] min-[800px]:h-[60px] sm:h-[66px] items-center px-3 min-[800px]:px-5 sm:px-6 md:px-[30px] py-0 relative shrink-0">
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
          <div className="header-inner h-[52px] min-[800px]:h-[60px] sm:h-[66px]">
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
              <div className="h-[52px] min-[800px]:h-[60px] sm:h-[66px] flex items-center justify-between px-3 min-[800px]:px-5 sm:px-6 md:px-[30px]">
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
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-52px)] min-[800px]:min-h-[calc(100vh-60px)] sm:min-h-[calc(100vh-66px)] px-6 py-8">
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
                        link.isSinhala ? 'font-malithi text-[20px] min-[800px]:text-[24px] sm:text-[28px]' : ''
                      } ${
                        (pathName === link.id || (link.id !== '/' && pathName.startsWith(link.id)))
                          ? 'text-gray-800 bg-gray-100' 
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
                    className="w-full bg-gray-900 text-white px-6 min-[800px]:px-8 py-4 min-[800px]:py-5 text-base min-[800px]:text-lg sm:text-xl font-medium transition-all duration-200 hover:bg-gray-800 active:scale-[0.98] flex items-center justify-center gap-3 rounded-lg shadow-lg touch-manipulation"
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
