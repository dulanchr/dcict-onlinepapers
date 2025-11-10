'use client';

import { useAuth } from '../../../context/AuthContext';
import { getStudentSubmissions } from '../../../lib/storage';
import { getAllQuestions } from '../../../lib/questions';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * Student Results Page
 * Shows detailed results of student's exam submission
 * @returns {JSX.Element} Student results component
 */
export default function StudentResults() {
    const { currentUser } = useAuth();
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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent mx-auto"></div>
                    <p className="mt-4 text-gray-600 font-medium">Loading your results...</p>
                    <p className="mt-2 text-sm text-gray-500">Please wait while we fetch your exam data</p>
                </div>
            </div>
        );
    }

    if (submissions.length === 0) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="text-center">
                    {/* Empty State Illustration */}
                    <div className="w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-8">
                        <svg className="w-16 h-16 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">No Results Available</h2>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                        You haven't taken the exam yet. Take the exam to see your results here.
                    </p>
                    
                    <div className="space-y-4">
                        <button
                            onClick={() => router.push('/student/exam')}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 focus:ring-4 focus:ring-indigo-200 shadow-lg"
                        >
                            🚀 Take Exam Now
                        </button>
                        <br />
                        <button
                            onClick={handleBackToDashboard}
                            className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
                        >
                            ← Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const latestSubmission = submissions[submissions.length - 1];
    const totalQuestions = questions.length;

    return (
        <div className="max-w-5xl mx-auto space-y-8 px-4 py-6">
            {/* Header */}
            <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <button
                    onClick={handleBackToDashboard}
                    className="flex items-center text-indigo-600 hover:text-indigo-700 font-medium transition-all duration-200 hover:bg-indigo-50 px-3 py-2 rounded-lg"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Dashboard
                </button>
                <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                    📊 Your Results
                </div>
            </div>

            {/* Results Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full transform translate-x-16 -translate-y-16"></div>
                
                <div className="relative flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
                            <span className="text-3xl font-bold">
                                {currentUser?.name?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-1">
                                Exam Results
                            </h1>
                            <p className="text-indigo-100 text-lg">
                                👤 {currentUser?.name} ({currentUser?.studentId})
                            </p>
                            <p className="text-indigo-100 text-sm mt-1 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Completed: {new Date(latestSubmission.timestamp).toLocaleString()}
                            </p>
                        </div>
                    </div>
                    
                    {/* Score Display */}
                    <div className="text-right">
                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                            <div className="text-5xl font-bold mb-2">
                                {latestSubmission.score}<span className="text-2xl">/{totalQuestions}</span>
                            </div>
                            <div className="text-2xl font-semibold mb-1">
                                {latestSubmission.percentage}%
                            </div>
                            <div className="text-indigo-100 text-sm">
                                Your Score
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Score Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 transition-all duration-300 hover:shadow-xl hover:scale-105">
                    <div className="text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <span className="text-green-600 text-2xl">✅</span>
                        </div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Correct</p>
                        <p className="text-2xl font-bold text-green-600">{latestSubmission.score}</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 transition-all duration-300 hover:shadow-xl hover:scale-105">
                    <div className="text-center">
                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <span className="text-red-600 text-2xl">❌</span>
                        </div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Incorrect</p>
                        <p className="text-2xl font-bold text-red-600">{totalQuestions - latestSubmission.score}</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 transition-all duration-300 hover:shadow-xl hover:scale-105">
                    <div className="text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <span className="text-blue-600 text-2xl">📊</span>
                        </div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Grade</p>
                        <p className="text-2xl font-bold text-blue-600">
                            {latestSubmission.percentage >= 90 ? 'A+' : 
                             latestSubmission.percentage >= 80 ? 'A' : 
                             latestSubmission.percentage >= 70 ? 'B' : 
                             latestSubmission.percentage >= 60 ? 'C' : 
                             latestSubmission.percentage >= 50 ? 'D' : 'F'}
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 transition-all duration-300 hover:shadow-xl hover:scale-105">
                    <div className="text-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <span className="text-purple-600 text-2xl">🏆</span>
                        </div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Percentage</p>
                        <p className="text-2xl font-bold text-purple-600">{latestSubmission.percentage}%</p>
                    </div>
                </div>
            </div>

            {/* Questions Review */}
            <div className="space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Question Review</h2>
                    <p className="text-gray-600">Review your answers for each question</p>
                </div>
                
                {questions.map((question, index) => {
                    const studentAnswer = latestSubmission.answers?.[question.id];
                    const correctAnswer = question.correctAnswer;
                    const isCorrect = studentAnswer === correctAnswer;

                    return (
                        <div key={question.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 transition-all duration-300 hover:shadow-xl">
                            {/* Question Header */}
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
                                
                                {/* Result Icon */}
                                <div className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                                    isCorrect ? 'bg-green-100' : 'bg-red-100'
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

                            {/* Answer Options */}
                            <div className="space-y-4">
                                {question.options.map((option, optionIndex) => {
                                    const optionLetter = ['A', 'B', 'C', 'D'][optionIndex];
                                    const isStudentAnswer = studentAnswer === optionLetter;
                                    const isCorrectAnswer = correctAnswer === optionLetter;
                                    
                                    let optionClass = 'border-gray-200 bg-white';
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
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${badgeClass}`}>
                                                        {optionLetter}
                                                    </div>
                                                    <span className={`text-sm md:text-base font-medium ${textClass}`}>
                                                        {option}
                                                    </span>
                                                </div>
                                                
                                                <div className="flex items-center space-x-2">
                                                    {isStudentAnswer && (
                                                        <span className="text-xs font-medium bg-blue-100 text-blue-800 px-3 py-1 rounded-full shadow-sm">
                                                            Your Answer
                                                        </span>
                                                    )}
                                                    {isCorrectAnswer && (
                                                        <span className="text-xs font-medium bg-green-100 text-green-800 px-3 py-1 rounded-full shadow-sm">
                                                            Correct
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Result Summary */}
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <div className={`flex items-center text-sm font-medium p-4 rounded-xl ${
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
            <div className="flex justify-center py-8">
                <button
                    onClick={handleBackToDashboard}
                    className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-10 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 focus:ring-4 focus:ring-indigo-200"
                >
                    ← Return to Dashboard
                </button>
            </div>
        </div>
    );
}
