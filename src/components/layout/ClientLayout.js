'use client';

import { useAuth } from '../../context/AuthContext'
import { useRouter, usePathname } from 'next/navigation'

/**
 * Client Layout Component
 * Handles the client-side layout logic
 */
export default function ClientLayout({ children }) {
  const pathname = usePathname();
  
  return (
    <div className="min-h-screen bg-white">
      <main className="relative">
        {children}
      </main>
    </div>
  );
}
