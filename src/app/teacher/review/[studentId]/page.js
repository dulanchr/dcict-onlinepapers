'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAllSubmissions } from '../../../../lib/storage';
import { getAllQuestions } from '../../../../lib/questions';

/**
 * Teacher Review Page (Dynamic Route)
 * Displays detailed review of a student's submission with question-by-question analysis
 * @returns {JSX.Element} Review page component
 */
export default function TeacherReview() {
    const params = useParams();
    const router = useRouter();
    const studentId = params.studentId;
    
    const [submission, setSubmission] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!studentId) {
            setError('Student ID is required');
            setLoading(false);
            return;
        }

        try {
            // Load all submissions and find the one for this student
            const allSubmissions = getAllSubmissions();
            const studentSubmissions = Object.values(allSubmissions).filter(
                sub => sub.studentId === studentId
            );

            if (studentSubmissions.length === 0) {
                setError('No submission found for this student');
                setLoading(false);
                return;
            }

            // Get the latest submission
            const latestSubmission = studentSubmissions[studentSubmissions.length - 1];
            setSubmission(latestSubmission);

            // Load questions
            const allQuestions = getAllQuestions();
            setQuestions(allQuestions);
        } catch (err) {
            console.error('Error loading submission:', err);
            setError('Failed to load submission data. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [studentId]);

    const handleBackToDashboard = () => {
        router.push('/teacher');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-600 border-t-transparent mx-auto"></div>
                    <p className="mt-4 text-gray-600 font-medium">Loading submission details...</p>
                    <p className="mt-2 text-sm text-gray-500">Please wait while we fetch the data</p>
                </div>
            </div>
        );
    }

    if (error || !submission) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center shadow-lg">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-red-900 mb-3">Unable to Load Submission</h2>
                    <p className="text-red-700 mb-6">{error}</p>
                    <div className="space-y-3">
                        <button
                            onClick={handleBackToDashboard}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 focus:ring-4 focus:ring-emerald-200"
                        >
                            ← Back to Dashboard
                        </button>
                        <p className="text-sm text-red-600">
                            If this problem persists, please contact technical support.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Calculate score details
    const correctCount = submission.score || 0;
    const totalQuestions = questions.length;
    const percentage = submission.percentage || Math.round((correctCount / totalQuestions) * 100);

    // Process cheat detection data
    const cheatLog = submission.cheatLog || [];
    const violationCount = submission.violationCount || cheatLog.length;

    // Violation type mapping
    const getViolationType = (type) => {
        switch (type) {
            case 'mouse_left': return 'Left exam page';
            case 'tab_switch': return 'Switched tabs';
            case 'window_blur': return 'Switched tabs';
            case 'right_click': return 'Right-clicked';
            case 'dev_tools_suspected': return 'Developer tools suspected';
            case 'dev_tools_attempt': return 'Attempted developer tools';
            default: return type;
        }
    };

    // Format timestamp
    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString();
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 px-4 py-6">
            {/* Enhanced Header with Back Button */}
            <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <button
                    onClick={handleBackToDashboard}
                    className="flex items-center text-emerald-600 hover:text-emerald-700 font-medium transition-all duration-200 hover:bg-emerald-50 px-3 py-2 rounded-lg"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Dashboard
                </button>
                <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                    📋 Submission Review
                </div>
            </div>

            {/* Enhanced Student Information Card */}
            <div className="bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-600 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full transform translate-x-16 -translate-y-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full transform -translate-x-12 translate-y-12"></div>
                
                <div className="relative flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
                            <span className="text-3xl font-bold">
                                {submission.studentName?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-1">
                                {submission.studentName}
                            </h1>
                            <p className="text-emerald-100 text-lg">
                                📋 Student ID: {submission.studentId}
                            </p>
                            <p className="text-emerald-100 text-sm mt-1 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Submitted: {new Date(submission.timestamp).toLocaleString()}
                            </p>
                        </div>
                    </div>
                    
                    {/* Enhanced Score Display */}
                    <div className="text-right">
                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                            <div className="text-5xl font-bold mb-2">
                                {correctCount}<span className="text-2xl">/{totalQuestions}</span>
                            </div>
                            <div className="text-2xl font-semibold mb-1">
                                {percentage}%
                            </div>
                            <div className="text-emerald-100 text-sm">
                                Final Score
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Suspicious Activity Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <svg className="w-6 h-6 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 0h12a2 2 0 002-2v-4a2 2 0 00-2-2H6a2 2 0 00-2 2v4a2 2 0 002 2z" />
                    </svg>
                    Suspicious Activity
                </h3>
                
                {violationCount === 0 ? (
                    <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-xl">
                        <svg className="w-6 h-6 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-green-600 font-medium">
                            No suspicious activity detected
                        </span>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-xl">
                            <svg className="w-6 h-6 text-red-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span className="text-red-600 font-medium">
                                {violationCount} violation{violationCount !== 1 ? 's' : ''} detected
                            </span>
                        </div>
                        
                        <div className="space-y-3">
                            {cheatLog.map((violation, index) => (
                                <div key={index} className="border border-gray-200 bg-gray-50 rounded-xl p-4 transition-all duration-200 hover:bg-gray-100">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                                                <span className="text-red-600 text-sm font-bold">!</span>
                                            </div>
                                            <span className="text-gray-600 font-medium">
                                                {getViolationType(violation.type)}
                                            </span>
                                        </div>
                                        <span className="text-gray-500 text-sm bg-white px-3 py-1 rounded-full">
                                            {formatTime(violation.timestamp)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Enhanced Score Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 transition-all duration-300 hover:shadow-xl hover:scale-105">
                    <div className="flex items-center">
                        <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                            <span className="text-green-600 text-2xl">✅</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Correct Answers</p>
                            <p className="text-3xl font-bold text-green-600">{correctCount}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 transition-all duration-300 hover:shadow-xl hover:scale-105">
                    <div className="flex items-center">
                        <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mr-4">
                            <span className="text-red-600 text-2xl">❌</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Incorrect Answers</p>
                            <p className="text-3xl font-bold text-red-600">{totalQuestions - correctCount}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 transition-all duration-300 hover:shadow-xl hover:scale-105">
                    <div className="flex items-center">
                        <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                            <span className="text-blue-600 text-2xl">📊</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Grade</p>
                            <p className="text-3xl font-bold text-blue-600">
                                {percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : percentage >= 70 ? 'B' : percentage >= 60 ? 'C' : percentage >= 50 ? 'D' : 'F'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Questions Review */}
            <div className="space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Question-by-Question Review</h2>
                    <p className="text-gray-600">Detailed analysis of each question and answer</p>
                </div>
                
                {questions.map((question, index) => {
                    const studentAnswer = submission.answers?.[question.id];
                    const correctAnswer = question.correctAnswer;
                    const isCorrect = studentAnswer === correctAnswer;

                    return (
                        <div key={question.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 transition-all duration-300 hover:shadow-xl">
                            {/* Enhanced Question Header */}
                            <div className="flex items-start justify-between mb-8">
                                <div className="flex items-start space-x-4 flex-1">
                                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl flex items-center justify-center font-bold shadow-lg">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl md:text-2xl font-semibold text-gray-900 leading-relaxed">
                                            {question.question}
                                        </h3>
                                    </div>
                                </div>
                                
                                {/* Enhanced Result Icon */}
                                <div className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${
                                    isCorrect ? 'bg-green-100 hover:bg-green-200' : 'bg-red-100 hover:bg-red-200'
                                }`}>
                                    {isCorrect ? (
                                        <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                            </div>

                            {/* Enhanced Answer Options */}
                            <div className="space-y-4">
                                {question.options.map((option, optionIndex) => {
                                    const optionLetter = ['A', 'B', 'C', 'D'][optionIndex];
                                    const isStudentAnswer = studentAnswer === optionLetter;
                                    const isCorrectAnswer = correctAnswer === optionLetter;
                                    
                                    let optionClass = 'border-gray-200 bg-white hover:bg-gray-50';
                                    let badgeClass = 'bg-gray-100 text-gray-600';
                                    let textClass = 'text-gray-700';
                                    
                                    if (isCorrectAnswer) {
                                        optionClass = 'border-green-300 bg-green-50 shadow-sm';
                                        badgeClass = 'bg-green-600 text-white shadow-sm';
                                        textClass = 'text-green-900';
                                    } else if (isStudentAnswer && !isCorrect) {
                                        optionClass = 'border-red-300 bg-red-50 shadow-sm';
                                        badgeClass = 'bg-red-600 text-white shadow-sm';
                                        textClass = 'text-red-900';
                                    }

                                    return (
                                        <div
                                            key={optionLetter}
                                            className={`border-2 rounded-xl p-4 transition-all duration-300 ${optionClass}`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4 flex-1">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${badgeClass}`}>
                                                        {optionLetter}
                                                    </div>
                                                    <span className={`text-sm md:text-base font-medium ${textClass}`}>
                                                        {option}
                                                    </span>
                                                </div>
                                                
                                                {/* Enhanced Answer Indicators */}
                                                <div className="flex items-center space-x-2">
                                                    {isStudentAnswer && (
                                                        <span className="text-xs font-medium bg-blue-100 text-blue-800 px-3 py-1 rounded-full shadow-sm">
                                                            👤 Student's Choice
                                                        </span>
                                                    )}
                                                    {isCorrectAnswer && (
                                                        <span className="text-xs font-medium bg-green-100 text-green-800 px-3 py-1 rounded-full shadow-sm">
                                                            ✅ Correct Answer
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Enhanced Question Result Summary */}
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <div className={`flex items-center text-sm font-medium p-4 rounded-xl ${
                                    isCorrect ? 'text-green-700 bg-green-50 border border-green-200' : 'text-red-700 bg-red-50 border border-red-200'
                                }`}>
                                    {isCorrect ? (
                                        <>
                                            <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span>✨ Excellent! The student selected the correct answer.</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                            <span>
                                                ❌ Incorrect. Student selected <strong>{studentAnswer || 'No Answer'}</strong>, 
                                                but the correct answer is <strong>{correctAnswer}</strong>.
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Enhanced Footer Actions */}
            <div className="flex justify-center py-8">
                <button
                    onClick={handleBackToDashboard}
                    className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-10 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 focus:ring-4 focus:ring-emerald-200"
                >
                    ← Return to Dashboard
                </button>
            </div>
        </div>
    );
}
