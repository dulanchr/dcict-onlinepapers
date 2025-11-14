'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function GlowHover({ children, className = '' }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ isolation: 'isolate' }}
    >
      {/* Animated gradient glow background */}
      <motion.div
        className="absolute rounded-lg opacity-0 blur-xl"
        style={{
          background: 'linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899, #f59e0b)',
          backgroundSize: '400% 400%',
          zIndex: -1,
          inset: 0,
        }}
        animate={{
          opacity: isHovered ? 0.4 : 0,
          scale: isHovered ? 1.05 : 1,
          backgroundPosition: isHovered
            ? ['0% 0%', '0% 0%', '0% 0%']
            : '0% 0%',
        }}
        transition={{
          opacity: { duration: 0.3 },
          scale: { duration: 0.3 },
          backgroundPosition: {
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          },
        }}
      />

      {/* Inner glow ring */}
      <motion.div
        className="absolute rounded-lg"
        style={{
          background: 'linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899, #f59e0b)',
          backgroundSize: '400% 400%',
          zIndex: -1,
          inset: 0,
        }}
        animate={{
          opacity: isHovered ? 0.1 : 1,
          scaleX: isHovered ? 1.02 : 0,
          scaleY: isHovered ? 1.1 : 0,
          backgroundPosition: isHovered
            ? ['0% 0%', '0% 0%', '0% 0%']
            : '0% 0%',
        }}
        transition={{
          opacity: { duration: 0.3 },
          scaleX: { duration: 0.3 },
          scaleY: { duration: 0.3 },
          backgroundPosition: {
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          },
        }}
      />

      {/* Content */}
      {children}
    </motion.div>
  );
}
