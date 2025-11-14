'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function FeaturesSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    // Delay the animation to start after hero content
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 600); // Start after hero animation (1000ms - 400ms buffer)

    return () => clearTimeout(timer);
  }, []);

  const papers = [
    {
      title: 'MCQ Paper #1',
      location: 'Student Portal',
      paper: 'MCQ Paper #1',
      link: '/login'
    },
    {
      title: 'Practice Tests',
      location: 'Student Portal',
      paper: 'Theory Paper #2',
      link: '/login'
    },
  ];

  return (
    <section 
      ref={sectionRef}
      className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto"
      aria-label="Available papers"
    >
      {papers.map((paper, index) => (
        <Link
          key={index}
          href={paper.link}
          className={`bg-[#ffffff00] border border-gray-300 p-4 rounded-sm flex flex-col gap-9 w-full transform transition-all duration-700 cursor-pointer hover:bg-black group ${
            isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-4'
          }`}
          style={{
            transitionDelay: isVisible ? '0ms' : `${index * 200}ms`
          }}
        >
          <div className="flex items-center justify-between w-full">
            <p className="text-[16px] font-semibold text-black tracking-normal group-hover:text-white transition-colors duration-300">
              {paper.title}
            </p>
            <div className="flex items-center justify-center">
              <img 
                src="/images/arrow.svg" 
                alt="" 
                className="w-3 h-auto transition-all duration-300 group-hover:brightness-0 group-hover:invert"
              />
            </div>
          </div>
          <div className="flex items-center justify-between w-full text-[12px] text-black tracking-normal group-hover:text-white transition-colors duration-300">
            <p>{paper.location}</p>
            <p>{paper.paper}</p>
          </div>
        </Link>
      ))}
    </section>
  );
}
