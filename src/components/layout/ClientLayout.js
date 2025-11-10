'use client';

import { useAuth } from '../../context/AuthContext'
import { useRouter } from 'next/navigation'

/**
 * Navigation Header Component
 * Shows app title and conditional logout button
 */
function NavigationHeader() {
  const { currentUser, isAuthenticated, logout, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      router.push('/');
    }
  };

  // Don't show header on loading or when no user is authenticated
  if (loading || !isAuthenticated()) {
    return null;
  }

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-14">
          {/* App Title */}
          <div className="flex items-center">
            <h1 className="text-lg font-normal text-gray-900">
              MCQ Exam System
            </h1>
          </div>

          {/* User Info and Logout */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2">
              <div className="w-7 h-7 bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-700 font-normal text-sm">
                  {currentUser?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="text-sm">
                <div className="font-normal text-gray-900">{currentUser?.name}</div>
                <div className="text-gray-500 text-xs">
                  {currentUser?.role === 'teacher' ? 'Teacher' : `ID: ${currentUser?.studentId}`}
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-normal text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors"
            >
              <span className="hidden sm:inline">Logout</span>
              <span className="sm:hidden">Exit</span>
            </button>
          </div>
        </div>

        {/* Mobile User Info */}
        <div className="sm:hidden pb-2 border-t border-gray-100 mt-2 pt-2">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-700 font-normal text-xs">
                {currentUser?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="font-normal text-gray-900 text-sm">{currentUser?.name}</div>
              <div className="text-xs text-gray-500">
                {currentUser?.role === 'teacher' ? 'Teacher' : `ID: ${currentUser?.studentId}`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

/**
 * Client Layout Component
 * Handles the client-side layout logic
 */
export default function ClientLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />
      <main className="relative">
        {children}
      </main>
    </div>
  );
}
