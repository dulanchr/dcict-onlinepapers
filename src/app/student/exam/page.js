'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { getAllQuestions } from '../../../lib/questions';
import { getStudentSubmissions, saveSubmission } from '../../../lib/storage';
import { getExamSchedule, isExamAvailable, hasExamEnded, getTimeRemainingSeconds, getTimeRemainingFormatted } from '../../../lib/examSettings';
import QuestionCard from '../../../components/cards/QuestionCard';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

/**
 * Student Exam Page
 * Displays exam questions, tracks answers, and handles submission
 * @returns {JSX.Element} Exam page component
 */
export default function StudentExam() {
    const { currentUser, loading: authLoading, logout } = useAuth();
    const router = useRouter();
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    
    // Timer states
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [showTimeWarning, setShowTimeWarning] = useState(false);
    const [timeExpired, setTimeExpired] = useState(false);
    
    // Cheat detection states
    const [cheatLog, setCheatLog] = useState([]);
    const [showCheatWarning, setShowCheatWarning] = useState(false);
    const [hasShownFirstWarning, setHasShownFirstWarning] = useState(false);

    // Initialize exam data and check availability
    useEffect(() => {
        console.log('Exam page useEffect triggered');
        console.log('Auth loading:', authLoading);
        console.log('Current user:', currentUser);

        // Don't proceed if auth is still loading
        if (authLoading) {
            console.log('Auth still loading, waiting...');
            return;
        }

        // Redirect if no user
        if (!currentUser) {
            console.log('No current user, redirecting to login');
            router.push('/');
            return;
        }

        // Redirect if not a student
        if (currentUser.role !== 'student') {
            console.log('User is not a student, redirecting');
            router.push('/');
            return;
        }

        const initializeExam = async () => {
            try {
                console.log('Initializing exam...');
                
                // Check exam availability first
                const examSettings = getExamSchedule();
                console.log('Exam settings:', examSettings);
                
                if (!isExamAvailable()) {
                    console.log('Exam not available, redirecting to dashboard');
                    router.push('/student');
                    return;
                }
                
                // Load questions
                const allQuestions = getAllQuestions();
                console.log('Questions loaded:', allQuestions.length);
                setQuestions(allQuestions);

                // Check for existing submissions
                const studentId = currentUser.id;
                console.log('Checking submissions for student ID:', studentId);
                
                const submissions = getStudentSubmissions(studentId);
                console.log('Found submissions:', submissions.length);
                
                if (submissions.length > 0) {
                    console.log('Student has already submitted, redirecting to dashboard');
                    router.push('/student');
                    return;
                }

                console.log('No existing submissions, exam ready');
                setLoading(false);
            } catch (error) {
                console.error('Error initializing exam:', error);
                setLoading(false);
            }
        };

        initializeExam();
    }, [authLoading, currentUser, router]);

    // Timer effect
    useEffect(() => {
        if (loading || authLoading) return;

        const updateTimer = () => {
            const seconds = getTimeRemainingSeconds();
            setTimeRemaining(seconds);
            
            // Check if time expired
            if (hasExamEnded() && !timeExpired) {
                console.log('Time expired, auto-submitting...');
                setTimeExpired(true);
                handleAutoSubmit();
                return;
            }
            
            // Show warning when less than 5 minutes remain
            if (seconds <= 300 && seconds > 0 && !showTimeWarning) {
                setShowTimeWarning(true);
            }
        };

        // Update immediately
        updateTimer();

        // Set up interval
        const timerInterval = setInterval(updateTimer, 1000);

        return () => clearInterval(timerInterval);
    }, [loading, authLoading, showTimeWarning, timeExpired]);

    // Auto-submit when time expires
    const handleAutoSubmit = async () => {
        console.log('Auto-submitting due to time expiry...');
        setIsSubmitting(true);
        
        try {
            let score = 0;
            questions.forEach(question => {
                if (answers[question.id] === question.correctAnswer) {
                    score++;
                }
            });

            const submission = {
                studentId: currentUser.id,
                studentName: currentUser.name,
                studentEmail: currentUser.email,
                answers: answers,
                score: score,
                totalQuestions: questions.length,
                cheatLog: cheatLog,
                violationCount: cheatLog.length,
                autoSubmitted: true, // Flag to indicate auto-submission
                timestamp: new Date().toISOString()
            };

            console.log('Auto-saving submission:', submission);
            const success = saveSubmission(submission);
            
            if (success) {
                console.log('Auto-submission saved successfully, redirecting...');
                router.push('/student');
            } else {
                console.error('Auto-submission failed');
            }
        } catch (error) {
            console.error('Auto-submission error:', error);
        }
    };

    // Cheat detection event listeners
    useEffect(() => {
        if (loading || authLoading) return;

        const logViolation = (type) => {
            const violation = {
                type,
                timestamp: Date.now()
            };
            
            setCheatLog(prev => [...prev, violation]);
            
            // Show warning modal on first violation
            if (!hasShownFirstWarning) {
                setShowCheatWarning(true);
                setHasShownFirstWarning(true);
            }
        };

        // Mouse leaving the window/viewport
        const handleMouseLeave = (e) => {
            if (e.clientY <= 0 || e.clientX <= 0 || 
                e.clientX >= window.innerWidth || e.clientY >= window.innerHeight) {
                logViolation('mouse_left');
            }
        };

        // Tab switching / window blur
        const handleVisibilityChange = () => {
            if (document.hidden) {
                logViolation('tab_switch');
            }
        };

        const handleWindowBlur = () => {
            logViolation('window_blur');
        };

        // Right-click detection
        const handleContextMenu = (e) => {
            logViolation('right_click');
            e.preventDefault(); // Optionally disable right-click
            return false;
        };

        // Developer tools detection (basic resize detection)
        let windowHeight = window.innerHeight;
        let windowWidth = window.innerWidth;
        
        const handleResize = () => {
            const heightDiff = Math.abs(window.innerHeight - windowHeight);
            const widthDiff = Math.abs(window.innerWidth - windowWidth);
            
            // Detect significant resize that might indicate dev tools opening
            if (heightDiff > 100 || widthDiff > 100) {
                logViolation('dev_tools_suspected');
            }
            
            windowHeight = window.innerHeight;
            windowWidth = window.innerWidth;
        };

        // Key combination detection for dev tools
        const handleKeyDown = (e) => {
            // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
            if (e.key === 'F12' || 
                (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
                (e.ctrlKey && e.key === 'u')) {
                logViolation('dev_tools_attempt');
                e.preventDefault();
            }
        };

        // Add event listeners
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleWindowBlur);
        document.addEventListener('contextmenu', handleContextMenu);
        window.addEventListener('resize', handleResize);
        document.addEventListener('keydown', handleKeyDown);

        // Cleanup event listeners
        return () => {
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleWindowBlur);
            document.removeEventListener('contextmenu', handleContextMenu);
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [loading, authLoading, hasShownFirstWarning]);

    /**
     * Handles answer selection for a question
     * @param {number} questionId - ID of the question
     * @param {string} selectedAnswer - Selected answer (A, B, C, or D)
     */
    const handleAnswerChange = (questionId, selectedAnswer) => {
        console.log('Answer changed for question', questionId, ':', selectedAnswer);
        setAnswers(prev => ({
            ...prev,
            [questionId]: selectedAnswer
        }));
    };

    /**
     * Handles exam submission without showing score to student
     */
    const handleSubmit = async () => {
        console.log('Starting exam submission...');
        setIsSubmitting(true);
        
        try {
            // Calculate score for teacher review (not shown to student)
            let score = 0;
            questions.forEach(question => {
                if (answers[question.id] === question.correctAnswer) {
                    score++;
                }
            });

            console.log('Calculated score:', score, '/', questions.length);

            const submission = {
                studentId: currentUser.id,
                studentName: currentUser.name,
                studentEmail: currentUser.email,
                answers: answers,
                score: score,
                totalQuestions: questions.length,
                cheatLog: cheatLog, // Include cheat detection log
                violationCount: cheatLog.length,
                autoSubmitted: false,
                timestamp: new Date().toISOString()
            };

            console.log('Saving submission:', submission);
            const success = saveSubmission(submission);
            
            if (success) {
                console.log('Submission saved successfully, redirecting...');
                router.push('/student');
            } else {
                throw new Error('Failed to save submission');
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert('Failed to submit exam. Please try again.');
        } finally {
            setIsSubmitting(false);
            setShowConfirmDialog(false);
        }
    };

    // Logout handler
    const handleLogout = () => {
        const success = logout();
        if (success) {
            router.push('/');
        }
    };

    // Calculate progress
    const answeredCount = Object.keys(answers).length;
    const progressPercentage = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;
    const allAnswered = answeredCount === questions.length;

    // Show loading while auth is loading or exam is initializing
    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-white">
                {/* Header */}
                <header className="border-b border-gray-200 bg-white">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 h-[52px] sm:h-[66px]">
                        <div className="h-full flex items-center justify-between">
                            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                                <h1 className="text-sm sm:text-base font-medium text-gray-900">Student Exam</h1>
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
                        <p className="mt-3 text-gray-600 text-sm font-light">
                            {authLoading ? 'Loading user...' : 'Loading exam...'}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Show error if no questions loaded
    if (questions.length === 0) {
        return (
            <div className="min-h-screen bg-white">
                {/* Header */}
                <header className="border-b border-gray-200 bg-white">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 h-[52px] sm:h-[66px]">
                        <div className="h-full flex items-center justify-between">
                            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                                <h1 className="text-sm sm:text-base font-medium text-gray-900">Student Exam</h1>
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
                        <p className="text-gray-600 font-light">No exam questions available.</p>
                        <motion.button
                            onClick={() => router.push('/student')}
                            whileHover="hover"
                            initial="rest"
                            className="mt-4 px-4 py-2.5 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 transition-all duration-200 inline-flex items-center gap-2"
                        >
                            <span>Back to Dashboard</span>
                            <motion.svg 
                                className="w-4 h-4" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                                variants={{
                                    rest: { x: 0 },
                                    hover: { x: 4 }
                                }}
                                transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </motion.svg>
                        </motion.button>
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
                            <h1 className="text-sm sm:text-base font-medium text-gray-900">Student Exam</h1>
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
                <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6 pb-20">
                    {/* Timer Warning */}
                    {timeRemaining <= 300 && timeRemaining > 0 && (
                        <div className="border border-red-300 bg-red-50 rounded-lg p-4">
                            <div className="flex items-center justify-center">
                                <span className="text-red-700 text-sm font-light">
                                    ⚠ Warning: Less than 5 minutes remaining!
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Exam Header with Timer */}
                    <div className="border border-gray-300 bg-white rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h1 className="text-base font-medium text-gray-900">Programming Fundamentals Exam</h1>
                                <p className="text-gray-600 text-sm font-light">Answer all questions to complete the exam</p>
                                
                                <div className="mt-2">
                                    <span className={`text-sm font-light ${timeRemaining <= 300 ? 'text-red-600' : 'text-gray-700'}`}>
                                        Time Remaining: {getTimeRemainingFormatted()}
                                    </span>
                                </div>
                                
                                {cheatLog.length > 0 && (
                                    <div className="mt-1">
                                        <span className="text-red-600 text-xs font-light">
                                            ⚠ Violations: {cheatLog.length}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-gray-500 font-light">Student:</div>
                                <div className="font-medium text-gray-900 text-sm">{currentUser?.name}</div>
                                <div className="text-xs text-gray-500 font-light">ID: {currentUser?.id}</div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 font-light">Progress</span>
                                <span className="font-medium text-gray-900">
                                    {answeredCount} of {questions.length} answered
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 h-2 rounded-full">
                                <div 
                                    className="bg-gray-700 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${progressPercentage}%` }}
                                ></div>
                            </div>
                            <div className="text-xs text-gray-500 font-light">
                                {allAnswered ? 'All questions answered' : 'Please answer all questions to submit'}
                            </div>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="border border-gray-300 bg-gray-50 rounded-lg p-4">
                        <h3 className="text-gray-900 font-medium mb-2">Exam Instructions</h3>
                        <ul className="text-gray-700 text-sm font-light space-y-1">
                            <li>• Select one answer for each question</li>
                            <li>• You can change your answers before submitting</li>
                            <li>• Make sure to answer all questions before submitting</li>
                            <li>• Once submitted, you cannot retake the exam</li>
                            <li>• <span className="text-red-600">Stay on this page - leaving will be tracked</span></li>
                            <li>• <span className="text-red-600">The exam will auto-submit when time expires</span></li>
                        </ul>
                    </div>

                    {/* Questions */}
                    <div className="space-y-6">
                        {questions.map((question, index) => (
                            <QuestionCard
                                key={question.id}
                                question={question}
                                questionNumber={index + 1}
                                selectedAnswer={answers[question.id] || null}
                                onAnswerChange={handleAnswerChange}
                            />
                        ))}
                    </div>

                    {/* Sticky Submit Section */}
                    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
                        <div className="max-w-4xl mx-auto p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="text-sm text-gray-600 font-light">
                                        Progress: <span className="font-medium text-gray-900">{answeredCount}/{questions.length}</span>
                                    </div>
                                    <div className="w-24 bg-gray-200 h-1.5 rounded-full">
                                        <div 
                                            className="bg-gray-700 h-1.5 rounded-full transition-all duration-300"
                                            style={{ width: `${progressPercentage}%` }}
                                        ></div>
                                    </div>
                                    {cheatLog.length > 0 && (
                                        <div className="text-xs text-red-600 font-light">
                                            Violations: {cheatLog.length}
                                        </div>
                                    )}
                                    <div className={`text-xs font-light ${timeRemaining <= 300 ? 'text-red-600' : 'text-gray-600'}`}>
                                        Time: {getTimeRemainingFormatted()}
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-3">
                                    <motion.button
                                        onClick={() => router.push('/student')}
                                        whileHover="hover"
                                        initial="rest"
                                        className="px-4 py-2 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 transition-all duration-200 flex items-center gap-2"
                                    >
                                        <span>Back to Dashboard</span>
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
                                    <motion.button
                                        onClick={() => setShowConfirmDialog(true)}
                                        disabled={!allAnswered || isSubmitting}
                                        whileHover={!allAnswered || isSubmitting ? {} : "hover"}
                                        initial="rest"
                                        className="px-6 py-2 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>
                                                <span>Submitting...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Submit Exam</span>
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
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Confirmation Dialog */}
                    <AnimatePresence>
                        {showConfirmDialog && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                                onClick={() => setShowConfirmDialog(false)}
                            >
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                    transition={{ duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="bg-white border border-gray-300 rounded-lg max-w-md w-full p-6"
                                >
                                    <div className="text-center mb-6">
                                        <h3 className="text-base font-medium text-gray-900 mb-2">Submit Exam?</h3>
                                        <p className="text-gray-600 text-sm font-light">
                                            Are you sure you want to submit your exam? You won't be able to change your answers after submission.
                                        </p>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 font-light">Questions Answered:</span>
                                            <span className="font-medium">{answeredCount}/{questions.length}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 font-light">Completion:</span>
                                            <span className="font-medium text-gray-900">{Math.round(progressPercentage)}%</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 font-light">Time Remaining:</span>
                                            <span className="font-medium text-gray-900">{getTimeRemainingFormatted()}</span>
                                        </div>
                                        {cheatLog.length > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-red-600 font-light">Violations:</span>
                                                <span className="font-medium text-red-600">{cheatLog.length}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-3">
                                        <motion.button
                                            onClick={() => setShowConfirmDialog(false)}
                                            disabled={isSubmitting}
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.99 }}
                                            className="flex-1 px-4 py-2.5 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 transition-all duration-200 disabled:opacity-50"
                                        >
                                            Cancel
                                        </motion.button>
                                        <motion.button
                                            onClick={handleSubmit}
                                            disabled={isSubmitting}
                                            whileHover={!isSubmitting ? { scale: 1.01 } : {}}
                                            whileTap={!isSubmitting ? { scale: 0.99 } : {}}
                                            className="flex-1 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium text-white transition-all duration-200 disabled:opacity-50"
                                        >
                                            {isSubmitting ? 'Submitting...' : 'Yes, Submit'}
                                        </motion.button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Cheat Warning Modal */}
                    <AnimatePresence>
                        {showCheatWarning && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                            >
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                    transition={{ duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }}
                                    className="bg-white border border-gray-300 rounded-lg max-w-md w-full p-6"
                                >
                                    <div className="text-center mb-6">
                                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-base font-medium text-gray-900 mb-2">Warning: Suspicious Activity Detected</h3>
                                        <p className="text-gray-600 text-sm font-light">
                                            Your actions are being monitored. Leaving this page, switching tabs, or using developer tools during the exam is not allowed and will be reported.
                                        </p>
                                    </div>

                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                                        <p className="text-red-800 text-sm font-light">
                                            All violations are logged and will be reviewed by your instructor. Continued violations may result in exam disqualification.
                                        </p>
                                    </div>

                                    <motion.button
                                        onClick={() => setShowCheatWarning(false)}
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        className="w-full px-4 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium text-white transition-all duration-200"
                                    >
                                        I Understand
                                    </motion.button>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
