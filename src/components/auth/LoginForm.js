'use client';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

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
    const [showSignUpInfo, setShowSignUpInfo] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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
        <div className="space-y-4 sm:space-y-6">
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4" noValidate>
                {/* General error message */}
                {errors.submit && (
                    <div 
                        className="border border-red-300 bg-red-50 p-2.5 sm:p-3 rounded-lg text-red-600 text-xs sm:text-sm font-light"
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
                        className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2"
                    >
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 border rounded-lg text-xs sm:text-sm font-light focus:outline-none transition-all duration-200 ${
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
                            className="mt-1 sm:mt-1.5 text-xs text-red-600 font-light"
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
                        className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2"
                    >
                        Password
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 ${formData.password ? 'pr-9' : 'pr-3 sm:pr-4'} border rounded-lg text-xs sm:text-sm font-light focus:outline-none transition-all duration-200 ${
                                errors.password
                                    ? 'border-red-300 focus:border-red-500'
                                    : 'border-gray-300 focus:border-gray-800'
                            }`}
                            placeholder="Enter your password"
                            aria-describedby={errors.password ? "password-error" : undefined}
                            aria-invalid={errors.password ? "true" : "false"}
                            required
                        />
                        <AnimatePresence>
                            {formData.password && (
                                <motion.button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors p-1"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    {showPassword ? (
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        </svg>
                                    ) : (
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    )}
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>
                    {errors.password && (
                        <p 
                            id="password-error" 
                            className="mt-1 sm:mt-1.5 text-xs text-red-600 font-light"
                            role="alert"
                        >
                            {errors.password}
                        </p>
                    )}
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-3 mt-4 sm:mt-6">
                    {/* Sign In Button - Now First */}
                    <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full px-4 py-2.5 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[44px]"
                        aria-describedby="submit-help"
                        whileHover="hover"
                        initial="rest"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>
                                <span className="whitespace-nowrap">Signing In...</span>
                            </>
                        ) : (
                            <>
                                <span className="whitespace-nowrap">Sign In</span>
                                <motion.svg 
                                    className="w-4 h-4 flex-shrink-0" 
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

                    {/* Sign Up Button - Now Second */}
                    <motion.button
                        type="button"
                        onClick={() => setShowSignUpInfo(!showSignUpInfo)}
                        className="w-full px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 transition-all duration-200 flex items-center justify-center gap-2 min-h-[44px]"
                        whileHover="hover"
                        initial="rest"
                    >
                        <span className="whitespace-nowrap">New here? Create Account</span>
                        <motion.svg 
                            className="w-4 h-4 flex-shrink-0"
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            variants={{
                                rest: { y: 0 },
                                hover: { y: 4 }
                            }}
                            transition={{
                                duration: 0.3,
                                ease: [0.4, 0.0, 0.2, 1]
                            }}
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M19 9l-7 7-7-7"
                            />
                        </motion.svg>
                    </motion.button>
                </div>
                
                {isSubmitting && (
                    <p 
                        id="submit-help" 
                        className="text-xs text-gray-500 text-center font-light"
                        aria-live="polite"
                    >
                        Please wait while we authenticate your credentials...
                    </p>
                )}
            </form>

            {/* Sign Up Information Card */}
            <AnimatePresence>
                {showSignUpInfo && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ 
                            duration: 0.5,
                            ease: [0.4, 0.0, 0.2, 1],
                            height: {
                                duration: 0.4,
                                ease: [0.4, 0.0, 0.2, 1]
                            },
                            opacity: {
                                duration: 0.3,
                                ease: [0.4, 0.0, 0.2, 1]
                            }
                        }}
                        className="overflow-hidden"
                    >
                        <motion.div 
                            className="border border-gray-300 bg-white p-4 sm:p-6 rounded-lg mt-3 sm:mt-4"
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -10, opacity: 0 }}
                            transition={{ 
                                duration: 0.4,
                                ease: [0.4, 0.0, 0.2, 1],
                                delay: 0.1
                            }}
                        >
                            <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-2 sm:mb-3">
                                Become a Member
                            </h3>
                            <p className="text-xs sm:text-sm font-light text-gray-600 mb-3 sm:mb-4">
                                To create an account and access our online examination platform, 
                                please contact the administration team. We'll help you get set up 
                                with your student credentials.
                            </p>
                            <div className="space-y-2 sm:space-y-3">
                                <div className="flex items-start gap-2 sm:gap-3">
                                    <svg 
                                        className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 mt-0.5 flex-shrink-0" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <div>
                                        <p className="text-xs sm:text-sm font-medium text-gray-700">Email</p>
                                        <p className="text-xs sm:text-sm font-light text-gray-600 break-all">support@ictbydulan.com</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2 sm:gap-3">
                                    <svg 
                                        className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 mt-0.5 flex-shrink-0" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <div>
                                        <p className="text-xs sm:text-sm font-medium text-gray-700">Phone</p>
                                        <p className="text-xs sm:text-sm font-light text-gray-600">+94 76 023 8281</p>
                                    </div>
                                </div>
                            </div>
                            <Link 
                                href="/contact"
                                className="mt-4 sm:mt-6 px-4 sm:px-6 py-2.5 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 transition-all duration-200 flex items-center justify-center gap-2 w-full min-h-[44px]"
                            >
                                Visit Contact Page
                                <svg 
                                    className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
