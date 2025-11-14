'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function ClassCard() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    // Delay the animation to start after hero content
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  const classes = [
    {
      title: 'ICT Theory',
      grade: 'Grade 12 & 13',
      description: 'Complete O/L and A/L ICT syllabus',
      link: '/login',
      image: '/images/dulanchathuranga.png'
    },
    {
      title: 'Practical Sessions',
      grade: 'Grade 12 & 13',
      description: 'Programming and database management',
      link: '/login',
      image: '/images/dulanchathuranga.png'
    },
    {
      title: 'Past Papers',
      grade: 'All Grades',
      description: 'Past papers with answers',
      link: '/login',
      image: '/images/dulanchathuranga.png'
    },
    {
      title: 'Revision Classes',
      grade: 'Grade 13',
      description: 'Intensive revision before exams',
      link: '/login',
      image: '/images/dulanchathuranga.png'
    },
  ];

  return (
    <section 
      ref={sectionRef}
      className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto"
      aria-label="Available classes"
    >
      {classes.map((classItem, index) => (
        <Link
          key={index}
          href={classItem.link}
          className={`bg-[#ffffff00] border border-gray-300 p-4 rounded-sm flex gap-4 w-full transform transition-all duration-700 cursor-pointer hover:bg-black group ${
            isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-4'
          }`}
          style={{
            transitionDelay: isVisible ? '0ms' : `${index * 200}ms`
          }}
        >
          <div className="w-[20%] aspect-square flex-shrink-0 overflow-hidden rounded-sm">
            <img 
              src={classItem.image} 
              alt={classItem.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 flex flex-col gap-9">
            <div className="flex items-center justify-between w-full">
              <p className="text-[16px] font-semibold text-black tracking-normal group-hover:text-white transition-colors duration-300">
                {classItem.title}
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
              <p>{classItem.grade}</p>
              <p>{classItem.description}</p>
            </div>
          </div>
        </Link>
      ))}
    </section>
  );
}
