/**
 * Exam Settings Management
 * Handles exam scheduling and availability checks
 */

// Storage key for exam settings
const EXAM_SETTINGS_KEY = 'dcict_exam_settings';

// Mutable exam settings object
export let examSettings = {
    startTime: null, // ISO string or null
    endTime: null,   // ISO string or null
    isActive: false
};

/**
 * Sets the exam schedule and saves to localStorage
 * @param {string} start - ISO string for start time
 * @param {string} end - ISO string for end time
 * @returns {boolean} - Success status
 */
export const setExamSchedule = (start, end) => {
    try {
        examSettings.startTime = start;
        examSettings.endTime = end;
        examSettings.isActive = true;
        
        // Save to localStorage
        if (typeof window !== 'undefined') {
            localStorage.setItem(EXAM_SETTINGS_KEY, JSON.stringify(examSettings));
        }
        return true;
    } catch (error) {
        console.error('Error saving exam schedule:', error);
        return false;
    }
};

/**
 * Gets the current exam schedule from localStorage
 * @returns {Object} - Current exam settings
 */
export const getExamSchedule = () => {
    try {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(EXAM_SETTINGS_KEY);
            if (stored) {
                const parsedSettings = JSON.parse(stored);
                // Update the mutable object
                examSettings.startTime = parsedSettings.startTime;
                examSettings.endTime = parsedSettings.endTime;
                examSettings.isActive = parsedSettings.isActive;
            }
        }
        return examSettings;
    } catch (error) {
        console.error('Error loading exam schedule:', error);
        return examSettings;
    }
};

/**
 * Checks if exam is currently available
 * @returns {boolean} - True if exam is available now
 */
export const isExamAvailable = () => {
    if (!examSettings.isActive) return false;
    if (!examSettings.startTime || !examSettings.endTime) return false;
    
    const now = new Date();
    const start = new Date(examSettings.startTime);
    const end = new Date(examSettings.endTime);
    
    return now >= start && now <= end;
};

/**
 * Checks if exam period has ended
 * @returns {boolean} - True if exam has ended
 */
export const hasExamEnded = () => {
    if (!examSettings.isActive) return false;
    if (!examSettings.endTime) return false;
    
    const now = new Date();
    const end = new Date(examSettings.endTime);
    
    return now > end;
};

/**
 * Checks if exam hasn't started yet
 * @returns {boolean} - True if exam hasn't started
 */
export const hasExamNotStarted = () => {
    if (!examSettings.isActive) return true;
    if (!examSettings.startTime) return true;
    
    const now = new Date();
    const start = new Date(examSettings.startTime);
    
    return now < start;
};

/**
 * Gets time remaining until exam ends (in minutes)
 * @returns {number} - Minutes remaining, or 0 if ended/not active
 */
export const getTimeRemainingMinutes = () => {
    if (!isExamAvailable()) return 0;
    
    const now = new Date();
    const end = new Date(examSettings.endTime);
    const diffMs = end - now;
    
    return Math.max(0, Math.floor(diffMs / (1000 * 60)));
};

/**
 * Gets time remaining until exam ends (in seconds)
 * @returns {number} - Seconds remaining, or 0 if ended/not active
 */
export const getTimeRemainingSeconds = () => {
    if (!isExamAvailable()) return 0;
    
    const now = new Date();
    const end = new Date(examSettings.endTime);
    const diffMs = end - now;
    
    return Math.max(0, Math.floor(diffMs / 1000));
};

/**
 * Formats time remaining as MM:SS
 * @returns {string} - Formatted time string
 */
export const getTimeRemainingFormatted = () => {
    const totalSeconds = getTimeRemainingSeconds();
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Clears the exam schedule and removes from localStorage
 * @returns {boolean} - Success status
 */
export const clearExamSchedule = () => {
    try {
        examSettings.isActive = false;
        examSettings.startTime = null;
        examSettings.endTime = null;
        
        // Clear from localStorage
        if (typeof window !== 'undefined') {
            localStorage.removeItem(EXAM_SETTINGS_KEY);
        }
        return true;
    } catch (error) {
        console.error('Error clearing exam schedule:', error);
        return false;
    }
};