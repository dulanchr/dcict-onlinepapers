'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, setCurrentUser, clearCurrentUser } from '../lib/storage';
import { validateUser } from '../lib/users';

/**
 * Authentication Context
 * @typedef {Object} AuthContextType
 * @property {Object|null} currentUser - Current logged-in user
 * @property {boolean} loading - Loading state
 * @property {string|null} error - Current error message
 * @property {Function} login - Login function
 * @property {Function} logout - Logout function
 * @property {Function} isStudent - Check if current user is a student
 * @property {Function} isTeacher - Check if current user is a teacher
 * @property {Function} clearError - Clear current error
 */

/**
 * Authentication Context
 */
const AuthContext = createContext(null);

/**
 * Custom hook to use the authentication context
 * @returns {AuthContextType} Authentication context value
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

/**
 * Authentication Provider Component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Provider component
 */
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUserState] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * Load current user from localStorage on component mount
     */
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                setLoading(true);
                // Add a small delay to show loading state
                await new Promise(resolve => setTimeout(resolve, 500));
                
                const user = getCurrentUser();
                if (user) {
                    setCurrentUserState(user);
                }
            } catch (error) {
                console.error('Error loading current user:', error);
                setError('Failed to load user session. Please try refreshing the page.');
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    /**
     * Clear current error
     */
    const clearError = () => {
        setError(null);
    };

    /**
     * Login function - validates against predefined users only
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise<boolean>} Success status
     */
    const login = async (email, password) => {
        try {
            setError(null);
            setLoading(true);

            // Validate inputs
            if (!email || !password) {
                throw new Error('Email and password are required');
            }

            // Add a small delay to show loading state
            await new Promise(resolve => setTimeout(resolve, 800));

            // Validate against predefined users
            const user = validateUser(email, password);
            
            if (!user) {
                throw new Error('Invalid email or password');
            }

            // Set current user in localStorage and state
            const success = setCurrentUser(user);
            if (success) {
                setCurrentUserState(user);
                return true;
            } else {
                throw new Error('Failed to save user session. Please try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError(error.message || 'Login failed. Please try again.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Logout function - clears user session with confirmation
     * @returns {Promise<boolean>} Success status
     */
    const logout = async () => {
        try {
            setLoading(true);
            setError(null);

            // Add a small delay for better UX
            await new Promise(resolve => setTimeout(resolve, 300));

            const success = clearCurrentUser();
            if (success) {
                setCurrentUserState(null);
                return true;
            } else {
                throw new Error('Failed to clear user session');
            }
        } catch (error) {
            console.error('Logout error:', error);
            setError('Failed to logout. Please try again.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Check if current user is a student
     * @returns {boolean} True if current user is a student
     */
    const isStudent = () => {
        return currentUser?.role === 'student';
    };

    /**
     * Check if current user is a teacher
     * @returns {boolean} True if current user is a teacher
     */
    const isTeacher = () => {
        return currentUser?.role === 'teacher';
    };

    /**
     * Check if user is authenticated
     * @returns {boolean} True if user is logged in
     */
    const isAuthenticated = () => {
        return currentUser !== null;
    };

    /**
     * Get user display name with fallback
     * @returns {string} User display name
     */
    const getUserDisplayName = () => {
        return currentUser?.name || 'User';
    };

    /**
     * Get user initials for avatar
     * @returns {string} User initials
     */
    const getUserInitials = () => {
        if (!currentUser?.name) return '?';
        return currentUser.name
            .split(' ')
            .map(name => name.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const value = {
        currentUser,
        loading,
        error,
        login,
        logout,
        isStudent,
        isTeacher,
        isAuthenticated,
        getUserDisplayName,
        getUserInitials,
        clearError
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
