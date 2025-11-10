'use client';

import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Student Layout Component
 * Provides layout and navigation for student pages with authentication checks
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Student layout component
 */
export default function StudentLayout({ children }) {
    const { currentUser, isStudent, isAuthenticated, logout, loading } = useAuth();
    const router = useRouter();

    // Authentication check
    useEffect(() => {
        if (!loading) {
            if (!isAuthenticated() || !isStudent()) {
                router.push('/');
            }
        }
    }, [loading, isAuthenticated, isStudent, router]);

    const handleLogout = () => {
        const success = logout();
        if (success) {
            router.push('/');
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white">
                <div className="text-center">
                    <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin mx-auto"></div>
                    <p className="mt-3 text-gray-600 text-sm">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated() || !isStudent()) {
        return null;
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="border-b border-gray-200 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                   
                </div>
            </header>

            {/* Main Content */}
            <main className="py-6">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
