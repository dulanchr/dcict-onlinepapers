'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAllSubmissions } from '../../../lib/storage';
import { getAllQuestions } from '../../../lib/questions';
import { motion } from 'framer-motion';

/**
 * Teacher Review Page
 * Displays detailed review of a student's submission with question-by-question analysis
 * @returns {JSX.Element} Review page component
 */
export default function TeacherReview() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const studentId = searchParams.get('studentId');
    
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
            setError('Failed to load submission data');
        } finally {
            setLoading(false);
        }
    }, [studentId]);

    const handleBackToDashboard = () => {
        router.push('/teacher');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin mx-auto"></div>
                    <p className="mt-3 text-gray-600 text-sm font-light">Loading submission...</p>
                </div>
            </div>
        );
    }

    if (error || !submission) {
        return (
            <div className="space-y-6">
                <div className="border border-red-300 bg-red-50 rounded-lg p-6 text-center">
                    <p className="text-red-600 font-light mb-4">{error}</p>
                    <motion.button
                        onClick={handleBackToDashboard}
                        whileHover="hover"
                        initial="rest"
                        className="px-4 py-2.5 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 transition-all duration-200 inline-flex items-center gap-2"
                    >
                        <motion.svg 
                            className="w-4 h-4" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            variants={{
                                rest: { x: 0 },
                                hover: { x: -4 }
                            }}
                            transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </motion.svg>
                        <span>Back to Dashboard</span>
                    </motion.button>
                </div>
            </div>
        );
    }

    // Calculate score details
    const correctCount = submission.score || 0;
    const totalQuestions = questions.length;
    const percentage = Math.round((correctCount / totalQuestions) * 100);

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
        <div className="space-y-6">
            {/* Header */}
            <div className="border border-gray-300 bg-white rounded-lg p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-base font-medium text-gray-900">Submission Review</h1>
                        <p className="text-gray-600 text-sm font-light mt-1">Detailed analysis of student answers</p>
                    </div>
                    <motion.button
                        onClick={handleBackToDashboard}
                        whileHover="hover"
                        initial="rest"
                        className="px-4 py-2.5 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 transition-all duration-200 flex items-center gap-2"
                    >
                        <motion.svg 
                            className="w-4 h-4" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            variants={{
                                rest: { x: 0 },
                                hover: { x: -4 }
                            }}
                            transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </motion.svg>
                        <span>Back to Dashboard</span>
                    </motion.button>
                </div>
            </div>

            {/* Student Information */}
            <div className="border border-gray-300 bg-white rounded-lg p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-base font-medium text-gray-900">{submission.studentName}</h2>
                        <p className="text-gray-600 text-sm font-light">Student ID: {submission.studentId}</p>
                        {submission.studentEmail && (
                            <p className="text-gray-600 text-sm font-light">{submission.studentEmail}</p>
                        )}
                        <p className="text-gray-500 text-xs font-light mt-1">
                            Submitted: {new Date(submission.timestamp).toLocaleString()}
                        </p>
                        {submission.autoSubmitted && (
                            <p className="text-red-600 text-xs font-light mt-1">
                                ⚠ Auto-submitted (time expired)
                            </p>
                        )}
                    </div>
                    <div className="text-left sm:text-right">
                        <div className="text-2xl font-medium text-gray-900">{correctCount}/{totalQuestions}</div>
                        <div className="text-base text-gray-600 font-light">{percentage}%</div>
                    </div>
                </div>
            </div>

            {/* Suspicious Activity Section */}
            <div className="border border-gray-300 bg-white rounded-lg">
                <div className="border-b border-gray-200 px-6 py-4">
                    <h3 className="text-base font-medium text-gray-900">Suspicious Activity</h3>
                    <p className="text-sm text-gray-500 font-light mt-1">Monitor exam integrity violations</p>
                </div>
                
                <div className="p-6">
                    {violationCount === 0 ? (
                        <div className="border border-green-300 bg-green-50 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-green-800 text-sm font-light">No suspicious activity detected</span>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="border border-red-300 bg-red-50 rounded-lg p-4">
                                <div className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <span className="text-red-800 text-sm font-medium">
                                        {violationCount} violation{violationCount !== 1 ? 's' : ''} detected
                                    </span>
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                {cheatLog.map((violation, index) => (
                                    <div key={index} className="border border-gray-300 bg-gray-50 rounded-lg p-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-700 text-sm font-light">
                                                {getViolationType(violation.type)}
                                            </span>
                                            <span className="text-gray-500 text-xs font-light">
                                                {formatTime(violation.timestamp)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Score Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-gray-300 bg-white rounded-lg p-6">
                    <div className="text-sm text-gray-600 font-light">Correct Answers</div>
                    <div className="text-2xl font-medium text-gray-900 mt-1">{correctCount}</div>
                </div>
                <div className="border border-gray-300 bg-white rounded-lg p-6">
                    <div className="text-sm text-gray-600 font-light">Incorrect Answers</div>
                    <div className="text-2xl font-medium text-gray-900 mt-1">{totalQuestions - correctCount}</div>
                </div>
                <div className="border border-gray-300 bg-white rounded-lg p-6">
                    <div className="text-sm text-gray-600 font-light">Grade</div>
                    <div className="text-2xl font-medium text-gray-900 mt-1">
                        {percentage >= 80 ? 'A' : percentage >= 70 ? 'B' : percentage >= 60 ? 'C' : percentage >= 50 ? 'D' : 'F'}
                    </div>
                </div>
            </div>

            {/* Questions Review */}
            <div className="border border-gray-300 bg-white rounded-lg">
                <div className="border-b border-gray-200 px-6 py-4">
                    <h3 className="text-base font-medium text-gray-900">Question Review</h3>
                    <p className="text-sm text-gray-500 font-light mt-1">Detailed breakdown of each question</p>
                </div>
                
                <div className="p-6 space-y-6">
                    {questions.map((question, index) => {
                        const studentAnswer = submission.answers?.[question.id];
                        const correctAnswer = question.correctAnswer;
                        const isCorrect = studentAnswer === correctAnswer;

                        return (
                            <div key={question.id} className="border border-gray-300 bg-white rounded-lg p-6">
                                {/* Question Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-start space-x-3 flex-1">
                                        <div className="w-8 h-8 bg-gray-700 text-white text-sm font-medium rounded-lg flex items-center justify-center flex-shrink-0">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-gray-900 font-light">{question.question}</p>
                                        </div>
                                    </div>
                                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ml-4 ${
                                        isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                        {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                                    </span>
                                </div>

                                {/* Answer Options */}
                                <div className="space-y-2">
                                    {question.options.map((option, optionIndex) => {
                                        const optionLetter = ['A', 'B', 'C', 'D'][optionIndex];
                                        const isStudentAnswer = studentAnswer === optionLetter;
                                        const isCorrectAnswer = correctAnswer === optionLetter;
                                        
                                        let bgClass = 'bg-white';
                                        let borderClass = 'border-gray-300';
                                        
                                        if (isCorrectAnswer) {
                                            bgClass = 'bg-green-50';
                                            borderClass = 'border-green-300';
                                        } else if (isStudentAnswer && !isCorrect) {
                                            bgClass = 'bg-red-50';
                                            borderClass = 'border-red-300';
                                        }

                                        return (
                                            <div
                                                key={optionLetter}
                                                className={`border ${borderClass} ${bgClass} rounded-lg p-3`}
                                            >
                                                <div className="flex items-center justify-between gap-3">
                                                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                                                        <span className="w-6 h-6 bg-gray-100 text-gray-700 text-xs font-medium rounded flex items-center justify-center flex-shrink-0">
                                                            {optionLetter}
                                                        </span>
                                                        <span className="text-sm text-gray-700 font-light">{option}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-shrink-0">
                                                        {isStudentAnswer && (
                                                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium whitespace-nowrap">
                                                                Student
                                                            </span>
                                                        )}
                                                        {isCorrectAnswer && (
                                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-medium whitespace-nowrap">
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
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className={`text-sm font-light ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                                        {isCorrect 
                                            ? '✓ Student selected the correct answer.' 
                                            : `✗ Student selected ${studentAnswer || 'No Answer'}, correct answer is ${correctAnswer}.`
                                        }
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
