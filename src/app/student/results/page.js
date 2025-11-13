'use client';

import { useAuth } from '../../../context/AuthContext';
import { getStudentSubmissions } from '../../../lib/storage';
import { getAllQuestions } from '../../../lib/questions';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

/**
 * Student Results Page
 * Shows detailed results of student's exam submission
 * @returns {JSX.Element} Student results component
 */
export default function StudentResults() {
    const { currentUser, logout } = useAuth();
    const router = useRouter();
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState([]);

    // Load student submissions and questions
    useEffect(() => {
        if (currentUser?.studentId) {
            try {
                const studentSubmissions = getStudentSubmissions(currentUser.studentId);
                setSubmissions(studentSubmissions);
                setQuestions(getAllQuestions());
            } catch (error) {
                console.error('Error loading results:', error);
            } finally {
                setLoading(false);
            }
        }
    }, [currentUser]);

    const handleBackToDashboard = () => {
        router.push('/student');
    };

    const handleLogout = () => {
        const success = logout();
        if (success) {
            router.push('/');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                {/* Header */}
                <header className="border-b border-gray-200 bg-white">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 h-[52px] sm:h-[66px]">
                        <div className="h-full flex items-center justify-between">
                            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                                <h1 className="text-sm sm:text-base font-medium text-gray-900">Exam Results</h1>
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
                        <p className="mt-3 text-gray-600 text-sm font-light">Loading your results...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (submissions.length === 0) {
        return (
            <div className="min-h-screen bg-white">
                {/* Header */}
                <header className="border-b border-gray-200 bg-white">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 h-[52px] sm:h-[66px]">
                        <div className="h-full flex items-center justify-between">
                            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                                <h1 className="text-sm sm:text-base font-medium text-gray-900">Exam Results</h1>
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
                                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 transition-all duration-200 flex items-center gap-1.5 sm:gap-2"
                                >
                                    <span>Sign Out</span>
                                    <motion.svg 
                                        className="w-3.5 h-3.5 sm:w-4 sm:h-4" 
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
                    <div className="max-w-4xl mx-auto px-4 sm:px-6">
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            
                            <h2 className="text-xl font-medium text-gray-900 mb-2">No Results Available</h2>
                            <p className="text-gray-600 text-sm font-light mb-6 max-w-md mx-auto">
                                You haven't taken the exam yet. Take the exam to see your results here.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
                                <motion.button
                                    onClick={() => router.push('/student/exam')}
                                    whileHover="hover"
                                    initial="rest"
                                    className="px-6 py-2.5 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 transition-all duration-200 flex items-center gap-2"
                                >
                                    <span>Take Exam Now</span>
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
                                    onClick={handleBackToDashboard}
                                    whileHover="hover"
                                    initial="rest"
                                    className="px-6 py-2.5 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 transition-all duration-200 flex items-center gap-2"
                                >
                                    <motion.svg 
                                        className="w-4 h-4 rotate-180" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                        variants={{ rest: { x: 0 }, hover: { x: 4 } }}
                                        transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </motion.svg>
                                    <span>Back to Dashboard</span>
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    const latestSubmission = submissions[submissions.length - 1];
    const totalQuestions = questions.length;

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="border-b border-gray-200 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-[52px] sm:h-[66px]">
                    <div className="h-full flex items-center justify-between">
                        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                            <h1 className="text-sm sm:text-base font-medium text-gray-900">Exam Results</h1>
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
                                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 transition-all duration-200 flex items-center gap-1.5 sm:gap-2"
                            >
                                <span>Sign Out</span>
                                <motion.svg 
                                    className="w-3.5 h-3.5 sm:w-4 sm:h-4" 
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
                <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
                    {/* Back Button */}
                    <motion.button
                        onClick={handleBackToDashboard}
                        whileHover="hover"
                        initial="rest"
                        className="px-4 py-2 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 transition-all duration-200 flex items-center gap-2"
                    >
                        <motion.svg 
                            className="w-4 h-4 rotate-180" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            variants={{ rest: { x: 0 }, hover: { x: 4 } }}
                            transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </motion.svg>
                        Back to Dashboard
                    </motion.button>

                    {/* Results Header */}
                    <div className="bg-gray-800 rounded-lg border border-gray-300 p-6 sm:p-8 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 sm:space-x-6">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-lg flex items-center justify-center border border-white/20">
                                    <span className="text-2xl sm:text-3xl font-bold">
                                        {currentUser?.name?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-medium mb-1">
                                        Exam Results
                                    </h1>
                                    <p className="text-gray-300 text-sm sm:text-base font-light">
                                        👤 {currentUser?.name} ({currentUser?.studentId})
                                    </p>
                                    <p className="text-gray-300 text-xs sm:text-sm font-light mt-1">
                                        Completed: {new Date(latestSubmission.timestamp).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="text-right">
                                <div className="bg-white/10 border border-white/20 rounded-lg p-4 sm:p-6">
                                    <div className="text-3xl sm:text-5xl font-bold mb-1">
                                        {latestSubmission.score}<span className="text-xl sm:text-2xl">/{totalQuestions}</span>
                                    </div>
                                    <div className="text-xl sm:text-2xl font-medium mb-1">
                                        {latestSubmission.percentage}%
                                    </div>
                                    <div className="text-gray-300 text-xs sm:text-sm font-light">
                                        Your Score
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Score Summary Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-white border border-gray-300 rounded-lg p-4 sm:p-6">
                            <div className="text-center">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
                                    <span className="text-green-600 text-xl sm:text-2xl">✅</span>
                                </div>
                                <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Correct</p>
                                <p className="text-xl sm:text-2xl font-bold text-green-600">{latestSubmission.score}</p>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-300 rounded-lg p-4 sm:p-6">
                            <div className="text-center">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
                                    <span className="text-red-600 text-xl sm:text-2xl">❌</span>
                                </div>
                                <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Incorrect</p>
                                <p className="text-xl sm:text-2xl font-bold text-red-600">{totalQuestions - latestSubmission.score}</p>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-300 rounded-lg p-4 sm:p-6">
                            <div className="text-center">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
                                    <span className="text-blue-600 text-xl sm:text-2xl">📊</span>
                                </div>
                                <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Grade</p>
                                <p className="text-xl sm:text-2xl font-bold text-blue-600">
                                    {latestSubmission.percentage >= 90 ? 'A+' : 
                                     latestSubmission.percentage >= 80 ? 'A' : 
                                     latestSubmission.percentage >= 70 ? 'B' : 
                                     latestSubmission.percentage >= 60 ? 'C' : 
                                     latestSubmission.percentage >= 50 ? 'D' : 'F'}
                                </p>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-300 rounded-lg p-4 sm:p-6">
                            <div className="text-center">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
                                    <span className="text-purple-600 text-xl sm:text-2xl">🏆</span>
                                </div>
                                <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Percentage</p>
                                <p className="text-xl sm:text-2xl font-bold text-purple-600">{latestSubmission.percentage}%</p>
                            </div>
                        </div>
                    </div>

                    {/* Questions Review */}
                    <div className="space-y-6">
                        <div className="text-center">
                            <h2 className="text-2xl sm:text-3xl font-medium text-gray-900 mb-2">Question Review</h2>
                            <p className="text-gray-600 text-sm font-light">Review your answers for each question</p>
                        </div>
                        
                        {questions.map((question, index) => {
                            const studentAnswer = latestSubmission.answers?.[question.id];
                            const correctAnswer = question.correctAnswer;
                            const isCorrect = studentAnswer === correctAnswer;

                            return (
                                <div key={question.id} className="bg-white border border-gray-300 rounded-lg p-6 sm:p-8">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-start space-x-4 flex-1">
                                            <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 text-white rounded-lg flex items-center justify-center font-bold">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg sm:text-xl font-medium text-gray-900 leading-relaxed">
                                                    {question.question}
                                                </h3>
                                            </div>
                                        </div>
                                        
                                        <div className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center ${
                                            isCorrect ? 'bg-green-100' : 'bg-red-100'
                                        }`}>
                                            {isCorrect ? (
                                                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            ) : (
                                                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {question.options.map((option, optionIndex) => {
                                            const optionLetter = ['A', 'B', 'C', 'D'][optionIndex];
                                            const isStudentAnswer = studentAnswer === optionLetter;
                                            const isCorrectAnswer = correctAnswer === optionLetter;
                                            
                                            let optionClass = 'border-gray-200 bg-white';
                                            let badgeClass = 'bg-gray-100 text-gray-600';
                                            let textClass = 'text-gray-700';
                                            
                                            if (isCorrectAnswer) {
                                                optionClass = 'border-green-300 bg-green-50';
                                                badgeClass = 'bg-green-600 text-white';
                                                textClass = 'text-green-900';
                                            } else if (isStudentAnswer && !isCorrect) {
                                                optionClass = 'border-red-300 bg-red-50';
                                                badgeClass = 'bg-red-600 text-white';
                                                textClass = 'text-red-900';
                                            }

                                            return (
                                                <div
                                                    key={optionLetter}
                                                    className={`border-2 rounded-lg p-3 sm:p-4 ${optionClass}`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
                                                            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-bold ${badgeClass}`}>
                                                                {optionLetter}
                                                            </div>
                                                            <span className={`text-sm sm:text-base font-medium ${textClass}`}>
                                                                {option}
                                                            </span>
                                                        </div>
                                                        
                                                        <div className="flex items-center space-x-2">
                                                            {isStudentAnswer && (
                                                                <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full">
                                                                    Your Answer
                                                                </span>
                                                            )}
                                                            {isCorrectAnswer && (
                                                                <span className="text-xs font-medium bg-green-100 text-green-800 px-2 sm:px-3 py-1 rounded-full">
                                                                    Correct
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <div className={`flex items-center text-sm font-light p-3 sm:p-4 rounded-lg ${
                                            isCorrect ? 'text-green-700 bg-green-50 border border-green-200' : 'text-red-700 bg-red-50 border border-red-200'
                                        }`}>
                                            {isCorrect ? (
                                                <span>✅ Correct! You selected the right answer.</span>
                                            ) : (
                                                <span>❌ Your answer was incorrect. The correct answer is {correctAnswer}.</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-center py-6">
                        <motion.button
                            onClick={handleBackToDashboard}
                            whileHover="hover"
                            initial="rest"
                            className="px-10 py-3 sm:py-4 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 transition-all duration-200 flex items-center gap-2"
                        >
                            <motion.svg 
                                className="w-4 h-4 rotate-180" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                                variants={{ rest: { x: 0 }, hover: { x: 4 } }}
                                transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </motion.svg>
                            Return to Dashboard
                        </motion.button>
                    </div>
                </div>
            </main>
        </div>
    );
}
