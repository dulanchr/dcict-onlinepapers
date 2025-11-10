'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAllSubmissions, deleteStudentSubmissions } from '../../lib/storage';
import { getExamSchedule, setExamSchedule, clearExamSchedule } from '../../lib/examSettings';

export default function TeacherDashboard() {
    const router = useRouter();
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Exam scheduling states
    const [examSettings, setExamSettings] = useState({ startTime: null, endTime: null, isActive: false });
    const [startDateTime, setStartDateTime] = useState('');
    const [endDateTime, setEndDateTime] = useState('');
    const [isSettingSchedule, setIsSettingSchedule] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        // Load submissions
        try {
            const allSubmissions = getAllSubmissions();
            const submissionsArray = Object.values(allSubmissions);
            
            // Sort by timestamp (newest first)
            const sortedSubmissions = submissionsArray.sort((a, b) => 
                new Date(b.timestamp) - new Date(a.timestamp)
            );
            
            setSubmissions(sortedSubmissions);
        } catch (error) {
            console.error('Error loading submissions:', error);
        }

        // Load exam settings
        const settings = getExamSchedule();
        setExamSettings(settings);
        
        // Set form values if schedule exists
        if (settings.startTime) {
            setStartDateTime(new Date(settings.startTime).toISOString().slice(0, 16));
        }
        if (settings.endTime) {
            setEndDateTime(new Date(settings.endTime).toISOString().slice(0, 16));
        }

        setLoading(false);

        // Update current time every second for countdown
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleSetSchedule = async () => {
        if (!startDateTime || !endDateTime) {
            alert('Please set both start and end times');
            return;
        }

        if (new Date(startDateTime) >= new Date(endDateTime)) {
            alert('End time must be after start time');
            return;
        }

        setIsSettingSchedule(true);
        try {
            const success = setExamSchedule(
                new Date(startDateTime).toISOString(),
                new Date(endDateTime).toISOString()
            );
            
            if (success) {
                const updatedSettings = getExamSchedule();
                setExamSettings(updatedSettings);
                alert('Exam schedule set successfully');
            } else {
                alert('Failed to set exam schedule');
            }
        } catch (error) {
            console.error('Error setting schedule:', error);
            alert('Failed to set exam schedule');
        } finally {
            setIsSettingSchedule(false);
        }
    };

    const handleClearSchedule = async () => {
        const confirm = window.confirm('Are you sure you want to clear the exam schedule?');
        if (!confirm) return;

        try {
            const success = clearExamSchedule();
            if (success) {
                setExamSettings({ startTime: null, endTime: null, isActive: false });
                setStartDateTime('');
                setEndDateTime('');
                alert('Exam schedule cleared');
            } else {
                alert('Failed to clear exam schedule');
            }
        } catch (error) {
            console.error('Error clearing schedule:', error);
            alert('Failed to clear exam schedule');
        }
    };

    const getCountdownText = () => {
        if (!examSettings.isActive) return null;
        
        const now = currentTime;
        const start = new Date(examSettings.startTime);
        const end = new Date(examSettings.endTime);

        if (now < start) {
            const diffMs = start - now;
            const hours = Math.floor(diffMs / (1000 * 60 * 60));
            const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
            return `Starts in: ${hours}h ${minutes}m`;
        } else if (now >= start && now <= end) {
            const diffMs = end - now;
            const hours = Math.floor(diffMs / (1000 * 60 * 60));
            const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
            return `Ends in: ${hours}h ${minutes}m`;
        } else {
            return 'Exam period ended';
        }
    };

    const handleReviewSubmission = (studentId) => {
        router.push(`/teacher/review?studentId=${studentId}`);
    };

    const handleDeleteSubmission = (submission) => {
        setSelectedSubmission(submission);
        setShowDeleteDialog(true);
    };

    const confirmDelete = async () => {
        if (!selectedSubmission) return;
        
        setIsDeleting(true);
        try {
            const success = deleteStudentSubmissions(selectedSubmission.studentId);
            if (success) {
                // Refresh submissions list
                const allSubmissions = getAllSubmissions();
                const submissionsArray = Object.values(allSubmissions);
                const sortedSubmissions = submissionsArray.sort((a, b) => 
                    new Date(b.timestamp) - new Date(a.timestamp)
                );
                setSubmissions(sortedSubmissions);
                
                setShowDeleteDialog(false);
                setSelectedSubmission(null);
            } else {
                alert('Failed to delete submission. Please try again.');
            }
        } catch (error) {
            console.error('Error deleting submission:', error);
            alert('Failed to delete submission. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    const cancelDelete = () => {
        setShowDeleteDialog(false);
        setSelectedSubmission(null);
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
            {/* Header */}
            <div className="border-b border-gray-200 pb-6">
                <h1 className="text-xl font-normal text-gray-900">Teacher Dashboard</h1>
                <p className="text-gray-600 text-sm mt-1">Manage exam schedule and review student submissions</p>
            </div>

            {/* Exam Scheduling Section */}
            <div className="border border-gray-200 bg-white p-6">
                <h2 className="text-base font-normal text-gray-900 mb-4">Exam Schedule</h2>
                
                {examSettings.isActive ? (
                    <div className="space-y-4">
                        <div className="border border-green-200 bg-green-50 p-4">
                            <h3 className="font-normal text-green-900 mb-2">Current Schedule</h3>
                            <div className="space-y-1 text-sm text-green-700">
                                <div>Start: {new Date(examSettings.startTime).toLocaleString()}</div>
                                <div>End: {new Date(examSettings.endTime).toLocaleString()}</div>
                                <div className="font-normal">{getCountdownText()}</div>
                            </div>
                        </div>
                        
                        <button
                            onClick={handleClearSchedule}
                            className="border border-red-300 text-red-600 px-4 py-2 text-sm font-normal hover:bg-red-50 transition-colors"
                        >
                            Clear Schedule
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Start Date & Time</label>
                                <input
                                    type="datetime-local"
                                    value={startDateTime}
                                    onChange={(e) => setStartDateTime(e.target.value)}
                                    className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">End Date & Time</label>
                                <input
                                    type="datetime-local"
                                    value={endDateTime}
                                    onChange={(e) => setEndDateTime(e.target.value)}
                                    className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
                                />
                            </div>
                        </div>
                        
                        <button
                            onClick={handleSetSchedule}
                            disabled={isSettingSchedule}
                            className="bg-gray-800 text-white px-4 py-2 text-sm font-normal hover:bg-gray-700 transition-colors disabled:opacity-50"
                        >
                            {isSettingSchedule ? 'Setting Schedule...' : 'Set Schedule'}
                        </button>
                    </div>
                )}
            </div>

            {/* Submissions List */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-base font-normal text-gray-900">Student Submissions</h2>
                    <div className="text-sm text-gray-500">
                        {submissions.length} submission{submissions.length !== 1 ? 's' : ''}
                    </div>
                </div>

                {submissions.length === 0 ? (
                    <div className="border border-gray-200 bg-gray-50 p-8 text-center">
                        <p className="text-gray-600">No submissions yet</p>
                        <p className="text-gray-500 text-sm mt-1">Student submissions will appear here</p>
                    </div>
                ) : (
                    <div className="border border-gray-200 bg-white">
                        {/* Table Header */}
                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm font-normal text-gray-700">
                                <div>Student</div>
                                <div className="hidden md:block">Email</div>
                                <div className="hidden md:block">Submitted</div>
                                <div className="hidden md:block">Score</div>
                                <div>Actions</div>
                            </div>
                        </div>

                        {/* Table Body */}
                        <div className="divide-y divide-gray-200">
                            {submissions.map((submission) => (
                                <div key={submission.id} className="px-6 py-4">
                                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                                        <div>
                                            <div className="font-normal text-gray-900">
                                                {submission.studentName}
                                            </div>
                                            <div className="text-sm text-gray-500 md:hidden">
                                                {submission.studentEmail}
                                            </div>
                                            <div className="text-sm text-gray-500 md:hidden">
                                                {new Date(submission.timestamp).toLocaleDateString()}
                                            </div>
                                            <div className="text-sm text-gray-500 md:hidden">
                                                Score: {submission.score || 0}/{submission.totalQuestions || 0}
                                            </div>
                                        </div>
                                        
                                        <div className="hidden md:block text-sm text-gray-600">
                                            {submission.studentEmail}
                                        </div>
                                        
                                        <div className="hidden md:block text-sm text-gray-600">
                                            {new Date(submission.timestamp).toLocaleString()}
                                        </div>

                                        <div className="hidden md:block text-sm text-gray-600">
                                            {submission.score || 0}/{submission.totalQuestions || 0}
                                        </div>
                                        
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleReviewSubmission(submission.studentId)}
                                                className="bg-gray-800 text-white px-3 py-1.5 text-sm font-normal hover:bg-gray-700 transition-colors"
                                            >
                                                Review
                                            </button>
                                            <button
                                                onClick={() => handleDeleteSubmission(submission)}
                                                className="border border-red-300 text-red-600 px-3 py-1.5 text-sm font-normal hover:bg-red-50 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            {showDeleteDialog && selectedSubmission && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white border border-gray-200 max-w-md w-full p-6">
                        <div className="text-center mb-6">
                            <h3 className="text-base font-normal text-gray-900 mb-2">Delete Submission?</h3>
                            <p className="text-gray-600 text-sm mb-4">
                                Are you sure you want to delete the submission from <strong>{selectedSubmission.studentName}</strong>?
                            </p>
                            <p className="text-gray-500 text-xs">
                                This will allow the student to retake the exam. This action cannot be undone.
                            </p>
                        </div>

                        <div className="bg-gray-50 p-4 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Student:</span>
                                <span className="font-normal">{selectedSubmission.studentName}</span>
                            </div>
                            <div className="flex justify-between text-sm mt-1">
                                <span className="text-gray-600">Score:</span>
                                <span className="font-normal">{selectedSubmission.score || 0}/{selectedSubmission.totalQuestions || 0}</span>
                            </div>
                            <div className="flex justify-between text-sm mt-1">
                                <span className="text-gray-600">Submitted:</span>
                                <span className="font-normal text-xs">{new Date(selectedSubmission.timestamp).toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={cancelDelete}
                                className="flex-1 border border-gray-300 text-gray-700 py-2 text-sm font-normal hover:bg-gray-50 transition-colors"
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={isDeleting}
                                className="flex-1 bg-red-600 text-white py-2 text-sm font-normal hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
