'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { getAllQuestions } from '../../../lib/questions';
import { getStudentSubmissions, saveSubmission } from '../../../lib/storage';
import { getExamSchedule, isExamAvailable, hasExamEnded, getTimeRemainingSeconds, getTimeRemainingFormatted } from '../../../lib/examSettings';
import QuestionCard from '../../../components/student/QuestionCard';

/**
 * Student Exam Page
 * Displays exam questions, tracks answers, and handles submission
 * @returns {JSX.Element} Exam page component
 */
export default function StudentExam() {
    const { currentUser, loading: authLoading } = useAuth();
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

    // Calculate progress
    const answeredCount = Object.keys(answers).length;
    const progressPercentage = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;
    const allAnswered = answeredCount === questions.length;

    // Show loading while auth is loading or exam is initializing
    if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin mx-auto"></div>
                    <p className="mt-3 text-gray-600 text-sm">
                        {authLoading ? 'Loading user...' : 'Loading exam...'}
                    </p>
                </div>
            </div>
        );
    }

    // Show error if no questions loaded
    if (questions.length === 0) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <p className="text-gray-600">No exam questions available.</p>
                    <button
                        onClick={() => router.push('/student')}
                        className="mt-4 bg-gray-800 text-white px-4 py-2 text-sm hover:bg-gray-700"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            {/* Timer Warning */}
            {timeRemaining <= 300 && timeRemaining > 0 && (
                <div className="border border-red-200 bg-red-50 p-4">
                    <div className="flex items-center justify-center">
                        <span className="text-red-700 text-sm font-normal">
                            ⚠ Warning: Less than 5 minutes remaining!
                        </span>
                    </div>
                </div>
            )}

            {/* Exam Header with Timer */}
            <div className="border border-gray-200 bg-white p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-lg font-normal text-gray-900">Programming Fundamentals Exam</h1>
                        <p className="text-gray-600 text-sm">Answer all questions to complete the exam</p>
                        
                        {/* Timer Display */}
                        <div className="mt-2">
                            <span className={`text-sm font-normal ${timeRemaining <= 300 ? 'text-red-600' : 'text-gray-700'}`}>
                                Time Remaining: {getTimeRemainingFormatted()}
                            </span>
                        </div>
                        
                        {/* Violation Counter */}
                        {cheatLog.length > 0 && (
                            <div className="mt-1">
                                <span className="text-red-600 text-xs font-normal">
                                    ⚠ Violations: {cheatLog.length}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-500">Student:</div>
                        <div className="font-normal text-gray-900 text-sm">{currentUser?.name}</div>
                        <div className="text-xs text-gray-500">ID: {currentUser?.id}</div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-normal text-gray-900">
                            {answeredCount} of {questions.length} answered
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 h-2">
                        <div 
                            className="bg-gray-700 h-2 transition-all duration-300"
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                    <div className="text-xs text-gray-500">
                        {allAnswered ? 'All questions answered' : 'Please answer all questions to submit'}
                    </div>
                </div>
            </div>

            {/* Instructions */}
            <div className="border border-gray-200 bg-gray-50 p-4">
                <h3 className="text-gray-900 font-normal mb-2">Exam Instructions</h3>
                <ul className="text-gray-700 text-sm space-y-1">
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
                            <div className="text-sm text-gray-600">
                                Progress: <span className="font-normal text-gray-900">{answeredCount}/{questions.length}</span>
                            </div>
                            <div className="w-24 bg-gray-200 h-1.5">
                                <div 
                                    className="bg-gray-700 h-1.5 transition-all duration-300"
                                    style={{ width: `${progressPercentage}%` }}
                                ></div>
                            </div>
                            {cheatLog.length > 0 && (
                                <div className="text-xs text-red-600">
                                    Violations: {cheatLog.length}
                                </div>
                            )}
                            <div className={`text-xs ${timeRemaining <= 300 ? 'text-red-600' : 'text-gray-600'}`}>
                                Time: {getTimeRemainingFormatted()}
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => router.push('/student')}
                                className="border border-gray-300 text-gray-700 px-4 py-2 text-sm font-normal hover:bg-gray-50 transition-colors"
                            >
                                Back to Dashboard
                            </button>
                            <button
                                onClick={() => setShowConfirmDialog(true)}
                                disabled={!allAnswered || isSubmitting}
                                className="bg-gray-800 text-white px-6 py-2 text-sm font-normal hover:bg-gray-700 focus:outline-none focus:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Exam'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Dialog */}
            {showConfirmDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white border border-gray-200 max-w-md w-full p-6">
                        <div className="text-center mb-6">
                            <h3 className="text-base font-normal text-gray-900 mb-2">Submit Exam?</h3>
                            <p className="text-gray-600 text-sm">
                                Are you sure you want to submit your exam? You won't be able to change your answers after submission.
                            </p>
                        </div>

                        <div className="bg-gray-50 p-4 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Questions Answered:</span>
                                <span className="font-normal">{answeredCount}/{questions.length}</span>
                            </div>
                            <div className="flex justify-between text-sm mt-1">
                                <span className="text-gray-600">Completion:</span>
                                <span className="font-normal text-gray-900">{Math.round(progressPercentage)}%</span>
                            </div>
                            <div className="flex justify-between text-sm mt-1">
                                <span className="text-gray-600">Time Remaining:</span>
                                <span className="font-normal text-gray-900">{getTimeRemainingFormatted()}</span>
                            </div>
                            {cheatLog.length > 0 && (
                                <div className="flex justify-between text-sm mt-1">
                                    <span className="text-red-600">Violations:</span>
                                    <span className="font-normal text-red-600">{cheatLog.length}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={() => setShowConfirmDialog(false)}
                                className="flex-1 border border-gray-300 text-gray-700 py-2 text-sm font-normal hover:bg-gray-50 transition-colors"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="flex-1 bg-gray-800 text-white py-2 text-sm font-normal hover:bg-gray-700 transition-colors disabled:opacity-50"
                            >
                                {isSubmitting ? 'Submitting...' : 'Yes, Submit'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cheat Warning Modal */}
            {showCheatWarning && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white border border-gray-200 max-w-md w-full p-6">
                        <div className="text-center mb-6">
                            <h3 className="text-base font- text-red-600 mb-2">⚠ Warning: Suspicious Activity Detected</h3>
                            <p className="text-gray-600 text-sm">
                                කරුණාකර මෙම පිටුවේ රැඳී සිට ඔබේ විභාගය කෙරෙහි අවධානය යොමු කරන්න. සියලුම ක්‍රියාකාරකම් ලොග් වෙමින් පවතී.
                            </p>
                        </div>

                        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                            <div className="text-sm text-red-700">
                                <p className="font-medium">Activities that are monitored:</p>
                                <ul className="mt-1 list-disc list-inside space-y-1">
                                    <li>Switching tabs or windows</li>
                                    <li>Right-clicking or using developer tools</li>
                                    <li>Leaving the exam page</li>
                                    <li>Minimizing the browser window</li>
                                </ul>
                            </div>
                        </div>

                        <div className="text-center">
                            <button
                                onClick={() => setShowCheatWarning(false)}
                                className="bg-red-600 text-white px-6 py-2 text-sm font-normal hover:bg-red-700 transition-colors"
                            >
                                I Understand - Continue Exam
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
