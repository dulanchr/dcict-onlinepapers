'use client';

import { useAuth } from '../../context/AuthContext';
import { getStudentSubmissions } from '../../lib/storage';
import { getAllQuestions } from '../../lib/questions';
import { getExamSchedule, isExamAvailable, hasExamEnded, hasExamNotStarted, getTimeRemainingMinutes } from '../../lib/examSettings';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

/**
 * Student Dashboard Page
 * Shows welcome message, exam status, and relevant actions
 * @returns {JSX.Element} Student dashboard component
 */
export default function StudentDashboard() {
    const { currentUser, logout } = useAuth();
    const router = useRouter();
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [examSettings, setExamSettings] = useState({ startTime: null, endTime: null, isActive: false });
    const [currentTime, setCurrentTime] = useState(new Date());

    // Load student submissions and exam settings
    useEffect(() => {
        if (currentUser?.id) {
            try {
                const studentSubmissions = getStudentSubmissions(currentUser.id);
                setSubmissions(studentSubmissions);
                
                // Load exam settings
                const settings = getExamSchedule();
                setExamSettings(settings);
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setLoading(false);
            }
        }

        // Update current time every second for countdown
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, [currentUser]);

    const handleLogout = () => {
        const success = logout();
        if (success) {
            router.push('/');
        }
    };

    const hasSubmitted = submissions.length > 0;
    const latestSubmission = hasSubmitted ? submissions[submissions.length - 1] : null;
    const totalQuestions = getAllQuestions().length;

    const handleStartExam = () => {
        // Check availability before navigation
        if (isExamAvailable()) {
            router.push('/student/exam');
        } else {
            alert('Exam is not currently available');
        }
    };

    const getExamStatusContent = () => {
        if (hasSubmitted) {
            // Student has already submitted
            return (
                <div className="space-y-4">
                    <div className="border border-green-300 bg-green-50 rounded-lg p-4">
                        <h3 className="font-medium text-green-900 mb-1">Exam Submitted</h3>
                        <p className="text-green-700 text-sm font-light">
                            You have successfully submitted your exam.
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 text-sm font-light">Submitted:</span>
                            <span className="text-sm text-gray-900 font-medium">
                                {latestSubmission?.timestamp ? 
                                    new Date(latestSubmission.timestamp).toLocaleString() : 
                                    'Unknown'
                                }
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 text-sm font-light">Status:</span>
                            <span className="text-sm text-green-700 font-medium">
                                Completed
                            </span>
                        </div>
                    </div>
                </div>
            );
        }

        if (!examSettings.isActive) {
            // No exam scheduled
            return (
                <div className="space-y-4">
                    <div className="border border-gray-300 bg-gray-50 rounded-lg p-4">
                        <h3 className="font-medium text-gray-700 mb-1">No Exam Scheduled</h3>
                        <p className="text-gray-600 text-sm font-light">
                            The exam has not been scheduled yet. Please wait for your teacher to set the exam times.
                        </p>
                    </div>
                </div>
            );
        }

        if (hasExamNotStarted()) {
            // Exam scheduled but not started
            const start = new Date(examSettings.startTime);
            const diffMs = start - currentTime;
            const hours = Math.floor(diffMs / (1000 * 60 * 60));
            const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

            return (
                <div className="space-y-4">
                    <div className="border border-blue-300 bg-blue-50 rounded-lg p-4">
                        <h3 className="font-medium text-blue-900 mb-1">Exam Scheduled</h3>
                        <p className="text-blue-700 text-sm font-light">
                            The exam will be available from {start.toLocaleString()}
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 text-sm font-light">Starts in:</span>
                            <span className="text-sm text-gray-900 font-medium">
                                {hours}h {minutes}m
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 text-sm font-light">Total Questions:</span>
                            <span className="text-sm text-gray-900 font-medium">{totalQuestions}</span>
                        </div>
                    </div>
                </div>
            );
        }

        if (hasExamEnded()) {
            // Exam has ended
            return (
                <div className="space-y-4">
                    <div className="border border-red-300 bg-red-50 rounded-lg p-4">
                        <h3 className="font-medium text-red-900 mb-1">Exam Period Ended</h3>
                        <p className="text-red-700 text-sm font-light">
                            The exam period has ended. You can no longer take the exam.
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 text-sm font-light">Ended:</span>
                            <span className="text-sm text-gray-900 font-medium">
                                {new Date(examSettings.endTime).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
            );
        }

        if (isExamAvailable()) {
            // Exam is currently available
            const timeRemaining = getTimeRemainingMinutes();

            return (
                <div className="space-y-4">
                    <div className="border border-green-300 bg-green-50 rounded-lg p-4">
                        <h3 className="font-medium text-green-900 mb-1">Exam Available</h3>
                        <p className="text-green-700 text-sm font-light">
                            පිළිතුරු සැපයීම ආරම්භ කිරීමට පහත බොත්තම ක්ලික් කරන්න.
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 text-sm font-light">ඉතිරිව ඇති කාලය:</span>
                            <span className="text-sm text-green-700 font-medium">
                                {timeRemaining} minutes
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 text-sm font-light">මුළු ප්‍රශ්න ගණන:</span>
                            <span className="text-sm text-gray-900 font-medium">{totalQuestions}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 text-sm font-light">ආකෘතිය:</span>
                            <span className="text-sm text-gray-900 font-medium">බහුවරණ</span>
                        </div>
                    </div>

                    <motion.button
                        onClick={handleStartExam}
                        whileHover="hover"
                        initial="rest"
                        className="w-full px-4 py-2.5 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        <span>Start Exam</span>
                        <motion.svg 
                            className="w-4 h-4" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            variants={{ rest: { x: 0 }, hover: { x: 4 } }}
                            transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </motion.svg>
                    </motion.button>
                </div>
            );
        }

        return null;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                {/* Header */}
                <header className="border-b border-gray-200 bg-white">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 h-[52px] sm:h-[66px]">
                        <div className="h-full flex items-center justify-between">
                            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                                <h1 className="text-sm sm:text-base font-medium text-gray-900">Student Dashboard</h1>
                            </div>
                            <Link href="/" className="absolute left-1/2 transform -translate-x-1/2 flex items-center sm:hidden">
                                <img src="/images/logo.svg" alt="Student Portal" className="h-6 w-auto" />
                            </Link>
                            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                                <div className="hidden sm:flex items-center gap-2 sm:gap-3">
                                    <img src="/images/dulanchathuranga.png" alt="Profile" className="h-8 sm:h-10 w-auto rounded-lg" />
                                    <img src="/images/logo.svg" alt="ICTBYDULAN.COM" className="h-6 sm:h-8 w-auto" />
                                </div>
                                <img src="/images/dulanchathuranga.png" alt="Profile" className="sm:hidden h-8 w-auto rounded-lg" />
                            </div>
                        </div>
                    </div>
                </header>
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin mx-auto"></div>
                        <p className="mt-3 text-gray-600 text-sm font-light">Loading dashboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="border-b border-gray-200 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-[52px] sm:h-[66px]">
                    <div className="h-full flex items-center justify-between">
                        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                            <h1 className="text-sm sm:text-base font-medium text-gray-900">Student Dashboard</h1>
                        </div>
                        <Link href="/" className="absolute left-1/2 transform -translate-x-1/2 flex items-center sm:hidden">
                            <img src="/images/logo.svg" alt="Student Portal" className="h-6 w-auto" />
                        </Link>
                        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                            <div className="hidden sm:flex items-center gap-2 sm:gap-3">
                                <img src="/images/dulanchathuranga.png" alt="Profile" className="h-8 sm:h-10 w-auto rounded-lg" />
                                <img src="/images/logo.svg" alt="ICTBYDULAN.COM" className="h-6 sm:h-8 w-auto" />
                            </div>
                            <img src="/images/dulanchathuranga.png" alt="Profile" className="sm:hidden h-8 w-auto rounded-lg" />
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
                                    variants={{ rest: { x: 0 }, hover: { x: 4 } }}
                                    transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </motion.svg>
                            </motion.button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="py-6">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
                    {/* Welcome Header */}
                    <div className="border-b border-gray-200 pb-4">
                        <h1 className="text-lg sm:text-xl font-medium text-gray-900 mb-1">
                            Welcome back, {currentUser?.name}
                        </h1>
                        <p className="text-sm text-gray-500 font-light">Student ID: {currentUser?.id}</p>
                    </div>

                    {/* Information Card */}
                    <div className="border border-red-300 bg-red-50 rounded-lg p-4 sm:p-6 max-w-2xl">
                        <h3 className="font-medium text-red-900 mb-3">Exam Guidelines - පිළිතුරු සැපයීමේදී සැළකිලිමත් වන්න!</h3>
                        <ul className="text-red-700 text-sm font-light space-y-1">
                            <li>• ශක්තිමත් අන්තර්ජාල සම්බන්ධතාවයක් ඇති බවට සහතික වන්න.</li>
                            <li>• ප්‍රශ්න නිවැරදිව කියවා බැලීමෙන් පසු පිළිතුරු සපයන්න.</li>
                            <li>• Submit කිරීමට පෙර පිළිතුරු නැවත කියවා බලන්න.</li>
                            <li>• එක් වරක් Submit කළ පසු නැවත පිළිතුරු සැපයිය නොහැක.</li>
                            <li>• පරීක්ෂණය අතරතුර විභාග පිටුවේ පමණක් සිටින්න - ඔබගේ වෙබ් පිටුවෙන් ඉවත් වුවහොත් එය සටහන් වෙනු ලැබේ.</li>
                            <li>• ඔබගේ කාලය අවසන් වූ පසු ස්වයංක්‍රීයව Submit වීම සිදුවේ.</li>
                        </ul>
                    </div>

                    {/* Main Content */}
                    <div className="max-w-2xl">
                        {/* Exam Status Card */}
                        <div className="border border-gray-300 bg-white rounded-lg p-6">
                            <h2 className="text-base font-medium text-gray-900 mb-4">Exam Status</h2>
                            {getExamStatusContent()}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
