'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function GlowHoverSimple({ children, className = '' }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ isolation: 'isolate' }}
    >
      {/* Animated gradient glow background only */}
      <motion.div
        className="absolute rounded-lg opacity-0 blur-xl"
        style={{
          background: 'linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899, #f59e0b)',
          backgroundSize: '400% 400%',
          zIndex: -1,
          inset: 0,
        }}
        animate={{
          opacity: isHovered ? 0.1 : 0,
          scale: isHovered ? 1.05 : 1,
          backgroundPosition: isHovered
            ? ['0% 0%', '100% 100%', '0% 0%']
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

      {/* Content */}
      {children}
    </motion.div>
  );
}
