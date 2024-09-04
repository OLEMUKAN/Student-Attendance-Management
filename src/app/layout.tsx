import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Student Attendance System',
  description: 'Manage student attendance and activities',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-primary text-white p-4">
          <h1 className="text-2xl font-bold">Student Attendance System</h1>
        </header>
        <main className="container mx-auto p-4">
          {children}
        </main>
        <footer className="bg-gray-200 p-4 text-center">
          <p>&copy; 2023 Student Attendance System</p>
        </footer>
      </body>
    </html>
  )
}