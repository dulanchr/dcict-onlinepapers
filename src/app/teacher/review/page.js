'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAllSubmissions } from '../../../lib/storage';
import { getAllQuestions } from '../../../lib/questions';

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
                    <p className="mt-3 text-gray-600 text-sm">Loading submission...</p>
                </div>
            </div>
        );
    }

    if (error || !submission) {
        return (
            <div className="space-y-6">
                <div className="border border-red-200 bg-red-50 p-6 text-center">
                    <p className="text-red-600 font-normal mb-4">{error}</p>
                    <button
                        onClick={handleBackToDashboard}
                        className="bg-gray-800 text-white px-4 py-2 text-sm font-normal hover:bg-gray-700 transition-colors"
                    >
                        Back to Dashboard
                    </button>
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
        <div className="space-y-8">
            {/* Header */}
            <div className="border-b border-gray-200 pb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-normal text-gray-900">Submission Review</h1>
                        <p className="text-gray-600 text-sm mt-1">Detailed analysis of student answers</p>
                    </div>
                    <button
                        onClick={handleBackToDashboard}
                        className="bg-gray-800 text-white px-4 py-2 text-sm font-normal hover:bg-gray-700 transition-colors"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>

            {/* Student Information */}
            <div className="border border-gray-200 bg-white p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-normal text-gray-900">{submission.studentName}</h2>
                        <p className="text-gray-600 text-sm">Student ID: {submission.studentId}</p>
                        {submission.studentEmail && (
                            <p className="text-gray-600 text-sm">{submission.studentEmail}</p>
                        )}
                        <p className="text-gray-500 text-xs mt-1">
                            Submitted: {new Date(submission.timestamp).toLocaleString()}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-normal text-gray-900">{correctCount}/{totalQuestions}</div>
                        <div className="text-lg text-gray-600">{percentage}%</div>
                    </div>
                </div>
            </div>

            {/* Suspicious Activity Section */}
            <div className="border border-gray-200 bg-white p-6">
                <h3 className="text-base font-normal text-gray-900 mb-4">Suspicious Activity</h3>
                
                {violationCount === 0 ? (
                    <div className="text-green-600 text-sm">
                        ✓ No suspicious activity detected
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="text-red-600 text-sm font-normal">
                            ⚠ {violationCount} violation{violationCount !== 1 ? 's' : ''} detected
                        </div>
                        
                        <div className="space-y-2">
                            {cheatLog.map((violation, index) => (
                                <div key={index} className="border border-gray-200 bg-gray-50 p-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600 text-sm">
                                            {getViolationType(violation.type)}
                                        </span>
                                        <span className="text-gray-500 text-xs">
                                            {formatTime(violation.timestamp)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Score Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-gray-200 bg-white p-4">
                    <div className="text-sm text-gray-600">Correct Answers</div>
                    <div className="text-xl font-normal text-gray-900">{correctCount}</div>
                </div>
                <div className="border border-gray-200 bg-white p-4">
                    <div className="text-sm text-gray-600">Incorrect Answers</div>
                    <div className="text-xl font-normal text-gray-900">{totalQuestions - correctCount}</div>
                </div>
                <div className="border border-gray-200 bg-white p-4">
                    <div className="text-sm text-gray-600">Grade</div>
                    <div className="text-xl font-normal text-gray-900">
                        {percentage >= 80 ? 'A' : percentage >= 70 ? 'B' : percentage >= 60 ? 'C' : percentage >= 50 ? 'D' : 'F'}
                    </div>
                </div>
            </div>

            {/* Questions Review */}
            <div className="space-y-6">
                <h3 className="text-base font-normal text-gray-900">Question Review</h3>
                
                {questions.map((question, index) => {
                    const studentAnswer = submission.answers?.[question.id];
                    const correctAnswer = question.correctAnswer;
                    const isCorrect = studentAnswer === correctAnswer;

                    return (
                        <div key={question.id} className="border border-gray-200 bg-white p-6">
                            {/* Question Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start space-x-3 flex-1">
                                    <div className="w-8 h-8 bg-gray-600 text-white text-sm font-normal flex items-center justify-center">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-gray-900 font-normal">{question.question}</p>
                                    </div>
                                </div>
                                <div className={`text-sm font-normal px-2 py-1 ${
                                    isCorrect ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                }`}>
                                    {isCorrect ? 'Correct' : 'Incorrect'}
                                </div>
                            </div>

                            {/* Answer Options */}
                            <div className="space-y-2">
                                {question.options.map((option, optionIndex) => {
                                    const optionLetter = ['A', 'B', 'C', 'D'][optionIndex];
                                    const isStudentAnswer = studentAnswer === optionLetter;
                                    const isCorrectAnswer = correctAnswer === optionLetter;
                                    
                                    let bgClass = 'bg-white';
                                    let borderClass = 'border-gray-200';
                                    
                                    if (isCorrectAnswer) {
                                        bgClass = 'bg-green-50';
                                        borderClass = 'border-green-200';
                                    } else if (isStudentAnswer && !isCorrect) {
                                        bgClass = 'bg-red-50';
                                        borderClass = 'border-red-200';
                                    }

                                    return (
                                        <div
                                            key={optionLetter}
                                            className={`border ${borderClass} ${bgClass} p-3`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <span className="w-6 h-6 bg-gray-100 text-gray-600 text-xs font-normal flex items-center justify-center">
                                                        {optionLetter}
                                                    </span>
                                                    <span className="text-sm text-gray-700">{option}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    {isStudentAnswer && (
                                                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1">
                                                            Student Answer
                                                        </span>
                                                    )}
                                                    {isCorrectAnswer && (
                                                        <span className="text-xs bg-green-100 text-green-600 px-2 py-1">
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
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <p className={`text-sm ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                    {isCorrect 
                                        ? 'Student selected the correct answer.' 
                                        : `Student selected ${studentAnswer || 'No Answer'}, correct answer is ${correctAnswer}.`
                                    }
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
