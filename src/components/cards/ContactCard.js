'use client';

import { useState, useEffect, useRef } from 'react';

export default function ContactCard() {
  const [isVisible, setIsVisible] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    // Delay the animation to start after hero content
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  const copyToClipboard = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const contactMethods = [
    {
      title: 'Email',
      info: 'support@ictbydulan.com',
      description: 'Send us an email anytime',
      copyable: true
    },
    {
      title: 'Phone',
      info: '+94 76 023 8281',
      description: 'Call us during office hours',
      copyable: true
    },
    {
      title: 'Address',
      info: 'Colombo, Sri Lanka',
      description: 'Visit us at our office',
      copyable: false
    },
    {
      title: 'Office Hours',
      info: 'Mon - Fri: 9AM - 5PM',
      description: 'We\'re available to help',
      copyable: false
    },
  ];

  return (
    <section 
      ref={sectionRef}
      className="grid grid-cols-1 gap-6"
      aria-label="Contact methods"
    >
      {contactMethods.map((method, index) => (
        <div
          key={index}
          className={`bg-white border border-gray-300 p-6 rounded-lg flex gap-4 w-full transform transition-all duration-200 hover:bg-gray-100 group ${
            isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-4'
          }`}
          style={{
            transitionDelay: isVisible ? '0ms' : `${index * 200}ms`
          }}
        >
          <div className="flex-1 flex flex-col gap-6">
            <div className="flex items-center justify-between w-full">
              <p className="text-sm font-medium text-gray-700 tracking-normal transition-colors duration-200">
                {method.title}
              </p>
              {copiedIndex === index && (
                <span className="text-xs text-green-600 font-medium">
                  Copied!
                </span>
              )}
            </div>
            <div className="flex items-center justify-between w-full text-sm text-gray-700 tracking-normal transition-colors duration-200">
              <p 
                className={`font-light ${method.copyable ? 'cursor-pointer hover:text-gray-900 active:scale-95 transition-all' : ''}`}
                onClick={() => method.copyable && copyToClipboard(method.info, index)}
                role={method.copyable ? 'button' : undefined}
                aria-label={method.copyable ? `Click to copy ${method.title}` : undefined}
              >
                {method.info}
              </p>
              <p className="font-light text-gray-600">{method.description}</p>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
