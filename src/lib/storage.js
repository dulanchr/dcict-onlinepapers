/**
 * Local Storage Utility Module
 * Manages student accounts, user sessions, and submissions
 */

// Storage keys
const STORAGE_KEYS = {
    STUDENTS: 'dcict_students',
    CURRENT_USER: 'dcict_current_user',
    SUBMISSIONS: 'dcict_submissions'
};

/**
 * Saves a student account to localStorage
 * @param {Object} student - Student object containing id, name, email, etc.
 * @returns {boolean} - Success status
 */
export function saveStudent(student) {
    try {
        if (!student || !student.id) {
            throw new Error('Student object must have an id');
        }
        
        const students = getAllStudents();
        students[student.id] = student;
        
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
        return true;
    } catch (error) {
        console.error('Error saving student:', error);
        return false;
    }
}

/**
 * Retrieves a student by ID from localStorage
 * @param {string} studentId - Student ID to retrieve
 * @returns {Object|null} - Student object or null if not found
 */
export function getStudent(studentId) {
    try {
        if (!studentId) {
            throw new Error('Student ID is required');
        }
        
        const students = getAllStudents();
        return students[studentId] || null;
    } catch (error) {
        console.error('Error retrieving student:', error);
        return null;
    }
}

/**
 * Gets all students from localStorage
 * @returns {Object} - Object containing all students indexed by ID
 */
function getAllStudents() {
    try {
        const studentsData = localStorage.getItem(STORAGE_KEYS.STUDENTS);
        return studentsData ? JSON.parse(studentsData) : {};
    } catch (error) {
        console.error('Error parsing students data:', error);
        return {};
    }
}

/**
 * Checks if a student exists in localStorage
 * @param {string} studentId - Student ID to check
 * @returns {boolean} - True if student exists, false otherwise
 */
export function studentExists(studentId) {
    try {
        const student = getStudent(studentId);
        return student !== null;
    } catch (error) {
        console.error('Error checking student existence:', error);
        return false;
    }
}

/**
 * Sets the current logged-in user
 * @param {Object} user - User object to set as current
 * @returns {boolean} - Success status
 */
export function setCurrentUser(user) {
    try {
        if (!user || !user.id) {
            throw new Error('User object must have an id');
        }
        
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
        return true;
    } catch (error) {
        console.error('Error setting current user:', error);
        return false;
    }
}

/**
 * Gets the current logged-in user
 * @returns {Object|null} - Current user object or null if not logged in
 */
export function getCurrentUser() {
    try {
        const userData = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error('Error retrieving current user:', error);
        return null;
    }
}

/**
 * Clears the current user session
 * @returns {boolean} - Success status
 */
export function clearCurrentUser() {
    try {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        return true;
    } catch (error) {
        console.error('Error clearing current user:', error);
        return false;
    }
}

/**
 * Saves a student submission to localStorage
 * @param {Object} submission - Submission object containing studentId, answers, timestamp, etc.
 * @returns {boolean} - Success status
 */
export function saveSubmission(submission) {
    try {
        if (!submission || !submission.studentId) {
            throw new Error('Submission must have a studentId');
        }
        
        const submissions = getAllSubmissions();
        const submissionId = `${submission.studentId}_${Date.now()}`;
        submission.id = submissionId;
        submission.timestamp = submission.timestamp || new Date().toISOString();
        
        submissions[submissionId] = submission;
        
        localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
        return true;
    } catch (error) {
        console.error('Error saving submission:', error);
        return false;
    }
}

/**
 * Gets all submissions from localStorage
 * @returns {Object} - Object containing all submissions indexed by ID
 */
export function getAllSubmissions() {
    try {
        const submissionsData = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
        return submissionsData ? JSON.parse(submissionsData) : {};
    } catch (error) {
        console.error('Error parsing submissions data:', error);
        return {};
    }
}

/**
 * Gets submissions for a specific student
 * @param {string} studentId - Student ID to get submissions for
 * @returns {Array} - Array of submissions for the student
 */
export function getStudentSubmissions(studentId) {
    try {
        if (!studentId) {
            throw new Error('Student ID is required');
        }
        
        const allSubmissions = getAllSubmissions();
        return Object.values(allSubmissions).filter(
            submission => submission.studentId === studentId
        );
    } catch (error) {
        console.error('Error retrieving student submissions:', error);
        return [];
    }
}

/**
 * Deletes a specific submission by ID
 * @param {string} submissionId - Submission ID to delete
 * @returns {boolean} - Success status
 */
export function deleteSubmission(submissionId) {
    try {
        if (!submissionId) {
            throw new Error('Submission ID is required');
        }
        
        const submissions = getAllSubmissions();
        if (submissions[submissionId]) {
            delete submissions[submissionId];
            localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
            return true;
        }
        
        return false;
    } catch (error) {
        console.error('Error deleting submission:', error);
        return false;
    }
}

/**
 * Deletes all submissions for a specific student
 * @param {string} studentId - Student ID to delete submissions for
 * @returns {boolean} - Success status
 */
export function deleteStudentSubmissions(studentId) {
    try {
        if (!studentId) {
            throw new Error('Student ID is required');
        }
        
        const allSubmissions = getAllSubmissions();
        const filteredSubmissions = {};
        
        // Keep only submissions that don't belong to this student
        Object.entries(allSubmissions).forEach(([id, submission]) => {
            if (submission.studentId !== studentId) {
                filteredSubmissions[id] = submission;
            }
        });
        
        localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(filteredSubmissions));
        return true;
    } catch (error) {
        console.error('Error deleting student submissions:', error);
        return false;
    }
}

/**
 * Clears all stored data (for testing or reset purposes)
 * @returns {boolean} - Success status
 */
export function clearAllData() {
    try {
        Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
        return true;
    } catch (error) {
        console.error('Error clearing all data:', error);
        return false;
    }
}
