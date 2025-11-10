'use client';

import { useAuth } from '../../context/AuthContext';
import { getStudentSubmissions } from '../../lib/storage';
import { getAllQuestions } from '../../lib/questions';
import { getExamSchedule, isExamAvailable, hasExamEnded, hasExamNotStarted, getTimeRemainingMinutes } from '../../lib/examSettings';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * Student Dashboard Page
 * Shows welcome message, exam status, and relevant actions
 * @returns {JSX.Element} Student dashboard component
 */
export default function StudentDashboard() {
    const { currentUser } = useAuth();
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
                    <div className="border border-green-200 bg-green-50 p-4">
                        <h3 className="font-normal text-green-900 mb-1">Exam Submitted</h3>
                        <p className="text-green-700 text-sm">
                            You have successfully submitted your exam.
                        </p>
                    </div>

                    <div className="bg-gray-50 p-4 space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 text-sm">Submitted:</span>
                            <span className="text-sm text-gray-900">
                                {latestSubmission?.timestamp ? 
                                    new Date(latestSubmission.timestamp).toLocaleString() : 
                                    'Unknown'
                                }
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 text-sm">Status:</span>
                            <span className="text-sm text-green-700 font-normal">
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
                    <div className="border border-gray-200 bg-gray-50 p-4">
                        <h3 className="font-normal text-gray-700 mb-1">No Exam Scheduled</h3>
                        <p className="text-gray-600 text-sm">
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
                    <div className="border border-blue-200 bg-blue-50 p-4">
                        <h3 className="font-normal text-blue-900 mb-1">Exam Scheduled</h3>
                        <p className="text-blue-700 text-sm">
                            The exam will be available from {start.toLocaleString()}
                        </p>
                    </div>

                    <div className="bg-gray-50 p-4 space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 text-sm">Starts in:</span>
                            <span className="text-sm text-gray-900 font-normal">
                                {hours}h {minutes}m
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 text-sm">Total Questions:</span>
                            <span className="text-sm text-gray-900">{totalQuestions}</span>
                        </div>
                    </div>
                </div>
            );
        }

        if (hasExamEnded()) {
            // Exam has ended
            return (
                <div className="space-y-4">
                    <div className="border border-red-200 bg-red-50 p-4">
                        <h3 className="font-normal text-red-900 mb-1">Exam Period Ended</h3>
                        <p className="text-red-700 text-sm">
                            The exam period has ended. You can no longer take the exam.
                        </p>
                    </div>

                    <div className="bg-gray-50 p-4 space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 text-sm">Ended:</span>
                            <span className="text-sm text-gray-900">
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
                    <div className="border border-green-200 bg-green-50 p-4">
                        <h3 className="font-normal text-green-900 mb-1">Exam Available</h3>
                        <p className="text-green-700 text-sm">
                            පිළිතුරු සැපයීම ආරම්භ කිරීමට පහත බොත්තම ක්ලික් කරන්න.
                        </p>
                    </div>

                    <div className="bg-gray-50 p-4 space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 text-sm">ඉතිරිව ඇති කාලය:</span>
                            <span className="text-sm text-green-700 font-normal">
                                {timeRemaining} minutes
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 text-sm">මුළු ප්‍රශ්න ගණන:</span>
                            <span className="text-sm text-gray-900">{totalQuestions}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 text-sm">ආකෘතිය:</span>
                            <span className="text-sm text-gray-900">බහුවරණ</span>
                        </div>
                    </div>

                    <button
                        onClick={handleStartExam}
                        className="w-full bg-gray-800 text-white py-2.5 text-sm font-normal hover:bg-gray-700 transition-colors"
                    >
                        Start Exam
                    </button>
                </div>
            );
        }

        return null;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin mx-auto"></div>
                    <p className="mt-3 text-gray-600 text-sm">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div className="border-b border-gray-200 pb-6">
                <h1 className="text-xl font-normal text-gray-900 mb-2">
                    Welcome back, {currentUser?.name}
                </h1>
            </div>
{/* Information Card */}
            <div className="border border-red-200 bg-red-50 p-6 max-w-2xl">
                <h3 className="font-bold text-gray-900 mb-3">Exam Guidelines - පිළිතුරු සැපයීමේදී සැළකිලිමත් වන්න!</h3>
                <ul className="text-red-700 text-sm space-y-1">
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
                <div className="border border-gray-200 bg-white p-6">
                    <h2 className="text-base font-bold text-gray-900 mb-4">Exam Status</h2>
                    {getExamStatusContent()}
                </div>
            </div>

            
        </div>
    );
}
