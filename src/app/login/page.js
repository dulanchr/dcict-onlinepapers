'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';
import LoginForm from '../../components/auth/LoginForm';

export default function LoginPage() {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && currentUser) {
      if (currentUser.role === 'teacher') {
        router.push('/teacher');
      } else if (currentUser.role === 'student') {
        router.push('/student');
      }
    }
  }, [currentUser, loading, router]);

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

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-normal text-gray-900 mb-2">
              Online Examination 1 - MCQ
            </h1>
            <p className="text-base text-gray-600 max-w-xl mx-auto">
              2025 November - ICT by Dulan Chathuranga
            </p>
          </div>
        </div>
      </div>

      {/* Login Form Section */}
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="border border-gray-200 bg-white p-8">
          <div className="text-center mb-8">
            <h2 className="text-lg font-normal text-gray-900 mb-1">Welcome</h2>
            <p className="text-gray-600 text-sm">Sign in to start your exam</p>
          </div>

          <LoginForm />
        </div>

        {/* Features */}
        <div className="mt-12 text-center">
          <h3 className="text-base font-normal text-gray-900 mb-6">ICT by Dulan Chathuranga</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-gray-200 bg-white p-4">
              <h4 className="font-normal text-gray-900 mb-1">Online Examinations</h4>
              <p className="text-sm text-gray-600">Take exams digitally with instant submission</p>
            </div>
            <div className="border border-gray-200 bg-white p-4">
              <h4 className="font-normal text-gray-900 mb-1">Real-time Results</h4>
              <p className="text-sm text-gray-600">Get immediate feedback and scores</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
