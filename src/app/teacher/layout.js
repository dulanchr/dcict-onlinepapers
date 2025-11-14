'use client';

import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function TeacherLayout({ children }) {
    const { currentUser, isTeacher, isAuthenticated, logout, loading } = useAuth();
    const router = useRouter();

    // Authentication check
    useEffect(() => {
        if (!loading) {
            if (!isAuthenticated() || !isTeacher()) {
                router.push('/');
            }
        }
    }, [loading, isAuthenticated, isTeacher, router]);

    const handleLogout = () => {
        const success = logout();
        if (success) {
            router.push('/');
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white">
                <div className="text-center">
                    <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin mx-auto"></div>
                    <p className="mt-3 text-gray-600 text-sm">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated() || !isTeacher()) {
        return null;
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="border-b border-gray-200 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-[52px] sm:h-[66px]">
                    <div className="h-full flex items-center justify-between">
                        {/* Left - Dashboard Title */}
                        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                            <h1 className="text-sm sm:text-base font-medium text-gray-900">Teacher Dashboard</h1>
                        </div>

                        {/* Center - Logo (Mobile Only) */}
                        <Link href="/" className="absolute left-1/2 transform -translate-x-1/2 flex items-center sm:hidden">
                            <img 
                                src="/images/logo.svg" 
                                alt="Student Portal" 
                                className="h-6 w-auto cursor-pointer hover:opacity-80 transition-opacity"
                                style={{ height: '24px', width: 'auto' }}
                            />
                        </Link>

                        {/* Right - User Info and Logout */}
                        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                            {/* User Profile */}
                            <div className="hidden sm:flex items-center gap-2 sm:gap-3">
                                <img 
                                    src="/images/dulanchathuranga.png" 
                                    alt="Profile" 
                                    className="h-8 sm:h-10 w-auto rounded-lg"
                                    style={{ height: '40px', width: 'auto' }}
                                />
                                <img 
                                    src="/images/logo.svg" 
                                    alt="ICTBYDULAN.COM" 
                                    className="h-6 sm:h-8 w-auto"
                                    style={{ height: '32px', width: 'auto' }}
                                />
                            </div>

                            {/* Mobile Profile */}
                            <img 
                                src="/images/dulanchathuranga.png" 
                                alt="Profile" 
                                className="sm:hidden h-8 w-auto rounded-lg"
                                style={{ height: '32px', width: 'auto' }}
                            />

                            {/* Logout Button */}
                            <motion.button
                                onClick={handleLogout}
                                whileHover="hover"
                                initial="rest"
                                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 transition-all duration-200 flex items-center gap-1.5 sm:gap-2 min-h-[36px] sm:min-h-[40px]"
                            >
                                <span className="whitespace-nowrap">Sign Out</span>
                                <motion.svg 
                                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" 
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </motion.svg>
                            </motion.button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="py-6">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
