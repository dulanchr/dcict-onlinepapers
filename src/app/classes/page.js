'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Navigation from '../../components/landing/Navigation';
import Footer from '../../components/common/Footer';

export default function Classes() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    setIsLoaded(true);
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  const classes = [
    {
      id: 1,
      title: 'ICT Theory',
      grade: 'Grade 12 & 13',
      description: 'Comprehensive theory classes covering the complete O/L and A/L ICT syllabus',
      icon: '📚',
    },
    {
      id: 2,
      title: 'Practical Sessions',
      grade: 'Grade 12 & 13',
      description: 'Hands-on practical sessions for programming and database management',
      icon: '💻',
    },
    {
      id: 3,
      title: 'Past Papers',
      grade: 'All Grades',
      description: 'Access to extensive collection of past papers with answers and explanations',
      icon: '📝',
    },
    {
      id: 4,
      title: 'Revision Classes',
      grade: 'Grade 13',
      description: 'Intensive revision classes before major examinations',
      icon: '🎯',
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="pt-24 pb-12 lg:pt-32 lg:pb-16">
          <div className="max-w-6xl mx-auto px-4">
            {/* Animated Hero Content */}
            <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="text-center max-w-4xl mx-auto">
                <img 
                  src="/images/logo-full.svg" 
                  alt="ICTBYDULAN.COM" 
                  className="h-7 lg:h-10 w-auto mx-auto mb-3 lg:mb-4"
                />
                <h1 className="text-3xl lg:text-5xl font-light tracking-tight text-black mb-4">
                  Our Classes
                </h1>
                <p className="text-lg lg:text-xl text-gray-600 font-light">
                  Explore our comprehensive ICT learning programs
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Classes Grid Section */}
        <section className="py-12 lg:py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {classes.map((classItem, index) => (
                <div
                  key={classItem.id}
                  className={`transition-all duration-1000 delay-${index * 150} ${
                    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                >
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 lg:p-8 hover:shadow-lg transition-shadow duration-300">
                    <div className="text-4xl mb-4">{classItem.icon}</div>
                    <h3 className="text-2xl font-light text-black mb-2">
                      {classItem.title}
                    </h3>
                    <p className="text-sm text-blue-600 mb-3 font-medium">
                      {classItem.grade}
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                      {classItem.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 lg:py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className={`transition-all duration-1000 delay-600 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <h2 className="text-2xl lg:text-3xl font-light text-black mb-4">
                Ready to Start Learning?
              </h2>
              <p className="text-gray-600 mb-6 lg:mb-8">
                Join our classes and excel in your ICT studies
              </p>
              <button
                onClick={() => router.push('/login')}
                className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors duration-300 font-medium"
              >
                Get Started
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
