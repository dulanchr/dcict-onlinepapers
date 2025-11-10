'use client';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

/**
 * LoginForm Component
 * Provides user authentication with form validation and accessibility
 * @returns {JSX.Element} Login form component
 */
export default function LoginForm() {
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    /**
     * Validates email format
     * @param {string} email - Email to validate
     * @returns {boolean} True if email is valid
     */
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    /**
     * Validates form data
     * @returns {Object} Validation errors object
     */
    const validateForm = () => {
        const newErrors = {};

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!isValidEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        return newErrors;
    };

    /**
     * Handles input field changes
     * @param {Event} e - Input change event
     */
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    /**
     * Handles form submission
     * @param {Event} e - Form submit event
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        try {
            const success = await login(
                formData.email.trim(),
                formData.password
            );

            if (!success) {
                setErrors({ submit: 'Invalid email or password' });
            }
        } catch (error) {
            setErrors({ submit: error.message || 'An unexpected error occurred' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-3" noValidate>
                {/* General error message */}
                {errors.submit && (
                    <div 
                        className="border border-red-300 bg-red-50 p-3 text-red-600 text-sm"
                        role="alert"
                        aria-live="polite"
                    >
                        {errors.submit}
                    </div>
                )}

                {/* Email Field */}
                <div>
                    <label 
                        htmlFor="email" 
                        className="block text-sm font-normal text-gray-700 mb-2"
                    >
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border text-sm focus:outline-none transition-colors ${
                            errors.email
                                ? 'border-red-300 focus:border-red-500'
                                : 'border-gray-300 focus:border-gray-800'
                        }`}
                        placeholder="Enter your email address"
                        aria-describedby={errors.email ? "email-error" : undefined}
                        aria-invalid={errors.email ? "true" : "false"}
                        required
                    />
                    {errors.email && (
                        <p 
                            id="email-error" 
                            className="mt-1 text-sm text-red-600"
                            role="alert"
                        >
                            {errors.email}
                        </p>
                    )}
                </div>

                {/* Password Field */}
                <div>
                    <label 
                        htmlFor="password" 
                        className="block text-sm font-normal text-gray-700 mb-2"
                    >
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border text-sm focus:outline-none transition-colors ${
                            errors.password
                                ? 'border-red-300 focus:border-red-500'
                                : 'border-gray-300 focus:border-gray-800'
                        }`}
                        placeholder="Enter your password"
                        aria-describedby={errors.password ? "password-error" : undefined}
                        aria-invalid={errors.password ? "true" : "false"}
                        required
                    />
                    {errors.password && (
                        <p 
                            id="password-error" 
                            className="mt-1 text-sm text-red-600"
                            role="alert"
                        >
                            {errors.password}
                        </p>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gray-800 text-white py-2.5 text-sm font-normal hover:bg-gray-700 focus:outline-none focus:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-describedby="submit-help"
                >
                    {isSubmitting ? 'Signing In...' : 'Sign In'}
                </button>
                
                {isSubmitting && (
                    <p 
                        id="submit-help" 
                        className="text-xs text-gray-500 text-center"
                        aria-live="polite"
                    >
                        Please wait while we authenticate your credentials...
                    </p>
                )}
            </form>

            {/* Test Credentials
            <div className="border-t border-gray-200 pt-4">
                <p className="text-xs font-normal text-gray-700 mb-2">Test Accounts:</p>
                <div className="text-xs text-gray-600 space-y-1">
                    <div>Teacher: teacher@email.com / teacher123</div>
                    <div>Students: student1@email.com / pass123</div>
                </div>
            </div> */}
        </div>
    );
}
