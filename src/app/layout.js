import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '../context/AuthContext'
import ClientLayout from '../components/layout/ClientLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'MCQ Exam System - DCICT Online Papers',
  description: 'Digital multiple choice examination platform for Department of Computer & Information Communication Technology',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        <AuthProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </AuthProvider>
      </body>
    </html>
  )
}
