'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAllSubmissions, deleteStudentSubmissions } from '../../lib/storage';
import { getExamSchedule, setExamSchedule, clearExamSchedule } from '../../lib/examSettings';
import { motion, AnimatePresence } from 'framer-motion';

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

    // Toast/Alert states
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });
    const [scheduleErrors, setScheduleErrors] = useState({});

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

    // Show alert message
    const showAlert = (type, message) => {
        setAlert({ show: true, type, message });
        setTimeout(() => {
            setAlert({ show: false, type: '', message: '' });
        }, 5000);
    };

    const validateSchedule = () => {
        const errors = {};

        if (!startDateTime) {
            errors.startDateTime = 'Start date and time is required';
        }

        if (!endDateTime) {
            errors.endDateTime = 'End date and time is required';
        }

        if (startDateTime && endDateTime) {
            const start = new Date(startDateTime);
            const end = new Date(endDateTime);
            const now = new Date();

            if (start < now) {
                errors.startDateTime = 'Start time cannot be in the past';
            }

            if (start >= end) {
                errors.endDateTime = 'End time must be after start time';
            }

            const duration = (end - start) / (1000 * 60); // minutes
            if (duration < 15) {
                errors.endDateTime = 'Exam duration must be at least 15 minutes';
            }
        }

        return errors;
    };

    const handleSetSchedule = async () => {
        const errors = validateSchedule();
        
        if (Object.keys(errors).length > 0) {
            setScheduleErrors(errors);
            return;
        }

        setScheduleErrors({});
        setIsSettingSchedule(true);
        
        try {
            const success = setExamSchedule(
                new Date(startDateTime).toISOString(),
                new Date(endDateTime).toISOString()
            );
            
            if (success) {
                const updatedSettings = getExamSchedule();
                setExamSettings(updatedSettings);
                showAlert('success', 'Exam schedule set successfully');
            } else {
                showAlert('error', 'Failed to set exam schedule');
            }
        } catch (error) {
            console.error('Error setting schedule:', error);
            showAlert('error', 'Failed to set exam schedule');
        } finally {
            setIsSettingSchedule(false);
        }
    };

    const handleClearSchedule = async () => {
        setShowDeleteDialog(false);
        try {
            const success = clearExamSchedule();
            if (success) {
                setExamSettings({ startTime: null, endTime: null, isActive: false });
                setStartDateTime('');
                setEndDateTime('');
                setScheduleErrors({});
                showAlert('success', 'Exam schedule cleared successfully');
            } else {
                showAlert('error', 'Failed to clear exam schedule');
            }
        } catch (error) {
            console.error('Error clearing schedule:', error);
            showAlert('error', 'Failed to clear exam schedule');
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
                const allSubmissions = getAllSubmissions();
                const submissionsArray = Object.values(allSubmissions);
                const sortedSubmissions = submissionsArray.sort((a, b) => 
                    new Date(b.timestamp) - new Date(a.timestamp)
                );
                setSubmissions(sortedSubmissions);
                
                setShowDeleteDialog(false);
                setSelectedSubmission(null);
                showAlert('success', 'Submission deleted successfully');
            } else {
                showAlert('error', 'Failed to delete submission');
            }
        } catch (error) {
            console.error('Error deleting submission:', error);
            showAlert('error', 'Failed to delete submission');
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
                    <p className="mt-3 text-gray-600 text-sm font-light">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Alert Toast */}
            <AnimatePresence>
                {alert.show && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
                        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4"
                    >
                        <div className={`border rounded-lg p-3 sm:p-4 ${
                            alert.type === 'success' 
                                ? 'bg-green-50 border-green-200' 
                                : 'bg-red-50 border-red-200'
                        }`}>
                            <div className="flex items-center gap-3">
                                {alert.type === 'success' ? (
                                    <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                )}
                                <p className={`text-sm font-light flex-1 ${
                                    alert.type === 'success' ? 'text-green-800' : 'text-red-800'
                                }`}>
                                    {alert.message}
                                </p>
                                <button
                                    onClick={() => setAlert({ show: false, type: '', message: '' })}
                                    className={`${
                                        alert.type === 'success' ? 'text-green-600 hover:text-green-800' : 'text-red-600 hover:text-red-800'
                                    } transition-colors`}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Exam Scheduling Section */}
            <div className="border border-gray-300 bg-white rounded-lg">
                <div className="border-b border-gray-200 px-6 py-4">
                    <h2 className="text-base font-medium text-gray-900">Exam Schedule Management</h2>
                    <p className="text-sm text-gray-500 font-light mt-1">Set the exam availability window for students</p>
                </div>
                
                <div className="p-6">
                    {examSettings.isActive ? (
                        <div className="space-y-4">
                            <div className="border border-green-300 bg-green-50 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-green-900 mb-2">Active Schedule</h3>
                                        <div className="space-y-1.5 text-sm text-green-800 font-light">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>Start: {new Date(examSettings.startTime).toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>End: {new Date(examSettings.endTime).toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2 font-medium pt-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                                <span>{getCountdownText()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <motion.button
                                onClick={handleClearSchedule}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                className="px-4 py-2.5 bg-white hover:bg-red-50 border border-red-300 rounded-lg text-sm font-medium text-red-600 transition-all duration-200 flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Clear Schedule
                            </motion.button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Start Date & Time
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={startDateTime}
                                        onChange={(e) => {
                                            setStartDateTime(e.target.value);
                                            if (scheduleErrors.startDateTime) {
                                                setScheduleErrors(prev => ({ ...prev, startDateTime: '' }));
                                            }
                                        }}
                                        className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 border rounded-lg text-sm font-light focus:outline-none transition-all duration-200 ${
                                            scheduleErrors.startDateTime
                                                ? 'border-red-300 focus:border-red-500'
                                                : 'border-gray-300 focus:border-gray-800'
                                        }`}
                                    />
                                    {scheduleErrors.startDateTime && (
                                        <p className="mt-1.5 text-xs text-red-600 font-light">
                                            {scheduleErrors.startDateTime}
                                        </p>
                                    )}
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        End Date & Time
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={endDateTime}
                                        onChange={(e) => {
                                            setEndDateTime(e.target.value);
                                            if (scheduleErrors.endDateTime) {
                                                setScheduleErrors(prev => ({ ...prev, endDateTime: '' }));
                                            }
                                        }}
                                        className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 border rounded-lg text-sm font-light focus:outline-none transition-all duration-200 ${
                                            scheduleErrors.endDateTime
                                                ? 'border-red-300 focus:border-red-500'
                                                : 'border-gray-300 focus:border-gray-800'
                                        }`}
                                    />
                                    {scheduleErrors.endDateTime && (
                                        <p className="mt-1.5 text-xs text-red-600 font-light">
                                            {scheduleErrors.endDateTime}
                                        </p>
                                    )}
                                </div>
                            </div>
                            
                            <motion.button
                                onClick={handleSetSchedule}
                                disabled={isSettingSchedule}
                                whileHover={!isSettingSchedule ? "hover" : "rest"}
                                initial="rest"
                                className="px-4 py-2.5 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isSettingSchedule ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>
                                        <span>Setting Schedule...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Set Schedule</span>
                                        <motion.svg 
                                            className="w-4 h-4" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                            variants={{
                                                rest: { x: 0 },
                                                hover: { x: 4 }
                                            }}
                                            transition={{
                                                duration: 0.3,
                                                ease: [0.4, 0.0, 0.2, 1]
                                            }}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </motion.svg>
                                    </>
                                )}
                            </motion.button>
                        </div>
                    )}
                </div>
            </div>

            {/* Submissions List */}
            <div className="border border-gray-300 bg-white rounded-lg">
                <div className="border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-medium text-gray-900">Student Submissions</h2>
                            <p className="text-sm text-gray-500 font-light mt-1">Review and manage student exam submissions</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="font-medium">{submissions.length}</span>
                            <span className="font-light">submission{submissions.length !== 1 ? 's' : ''}</span>
                        </div>
                    </div>
                </div>

                {submissions.length === 0 ? (
                    <div className="p-12 text-center">
                        <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-gray-600 font-light">No submissions yet</p>
                        <p className="text-gray-500 text-sm font-light mt-1">Student submissions will appear here once they complete the exam</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        {/* Desktop Table */}
                        <table className="hidden md:table w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Student</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Submitted</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Score</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {submissions.map((submission) => (
                                    <tr key={submission.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-gray-900">{submission.studentName}</div>
                                            <div className="text-sm text-gray-500 font-light">ID: {submission.studentId}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-light">
                                            {submission.studentEmail}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-light">
                                            {new Date(submission.timestamp).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                                {submission.score || 0}/{submission.totalQuestions || 0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="flex items-center gap-2">
                                                <motion.button
                                                    onClick={() => handleReviewSubmission(submission.studentId)}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="px-3 py-1.5 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 transition-all duration-200 flex items-center gap-1.5"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    Review
                                                </motion.button>
                                                <motion.button
                                                    onClick={() => handleDeleteSubmission(submission)}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="px-3 py-1.5 bg-white hover:bg-red-50 border border-red-300 rounded-lg text-sm font-medium text-red-600 transition-all duration-200 flex items-center gap-1.5"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    Delete
                                                </motion.button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Mobile Cards */}
                        <div className="md:hidden divide-y divide-gray-200">
                            {submissions.map((submission) => (
                                <div key={submission.id} className="p-4 space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="font-medium text-gray-900">{submission.studentName}</div>
                                            <div className="text-sm text-gray-500 font-light">{submission.studentEmail}</div>
                                            <div className="text-xs text-gray-500 font-light mt-1">ID: {submission.studentId}</div>
                                        </div>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {submission.score || 0}/{submission.totalQuestions || 0}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-500 font-light">
                                        Submitted: {new Date(submission.timestamp).toLocaleString()}
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <motion.button
                                            onClick={() => handleReviewSubmission(submission.studentId)}
                                            whileTap={{ scale: 0.98 }}
                                            className="flex-1 px-3 py-2 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 transition-all duration-200 flex items-center justify-center gap-1.5"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            Review
                                        </motion.button>
                                        <motion.button
                                            onClick={() => handleDeleteSubmission(submission)}
                                            whileTap={{ scale: 0.98 }}
                                            className="flex-1 px-3 py-2 bg-white hover:bg-red-50 border border-red-300 rounded-lg text-sm font-medium text-red-600 transition-all duration-200 flex items-center justify-center gap-1.5"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Delete
                                        </motion.button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <AnimatePresence>
                {showDeleteDialog && selectedSubmission && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                        onClick={cancelDelete}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white border border-gray-300 rounded-lg max-w-md w-full"
                        >
                            <div className="p-6">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-medium text-gray-900 mb-1">Delete Submission</h3>
                                        <p className="text-sm text-gray-600 font-light">
                                            Are you sure you want to delete <strong className="font-medium">{selectedSubmission.studentName}'s</strong> submission? This will allow them to retake the exam.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 font-light">Student:</span>
                                        <span className="font-medium text-gray-900">{selectedSubmission.studentName}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 font-light">Score:</span>
                                        <span className="font-medium text-gray-900">{selectedSubmission.score || 0}/{selectedSubmission.totalQuestions || 0}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 font-light">Submitted:</span>
                                        <span className="font-medium text-gray-900 text-xs">{new Date(selectedSubmission.timestamp).toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <motion.button
                                        onClick={cancelDelete}
                                        disabled={isDeleting}
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        className="flex-1 px-4 py-2.5 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 transition-all duration-200 disabled:opacity-50"
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        onClick={confirmDelete}
                                        disabled={isDeleting}
                                        whileHover={!isDeleting ? { scale: 1.01 } : {}}
                                        whileTap={!isDeleting ? { scale: 0.99 } : {}}
                                        className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium text-white transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isDeleting ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span>Deleting...</span>
                                            </>
                                        ) : (
                                            'Delete Submission'
                                        )}
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
