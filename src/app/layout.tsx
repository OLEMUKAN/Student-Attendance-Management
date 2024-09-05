"use client"
import { Inter } from 'next/font/google'
import './globals.css'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import NavLink from "./components/NavLink" // Updated import
import { auth, db } from './firebase' 
import { User } from 'firebase/auth'
import LogoutButton from './components/LogoutButton'
import Notification from './components/notification'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User as UserIcon, Home, Calendar, Bell, BookOpen, Settings, Menu, ChartBar, Users } from 'lucide-react'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { doc, getDoc } from 'firebase/firestore'
import Notifications from './components/notification'


const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user)
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role)
        }
      } else {
        setUser(null)
        setUserRole(null)
      }
    })

    return () => unsubscribe()
  }, [])

  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-red-100`}>
        <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-md">
          <div className="container flex h-16 items-center justify-between px-4">
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link href="/" className="flex items-center space-x-2 hover:text-primary transition-colors">
                <BookOpen className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                  Student Attendance System
                </h1>
              </Link>
              {user && (
                <nav className="hidden md:flex space-x-4">
                  <NavLink href="/" icon={Home} label="Home" />
                  <NavLink href="/dashboard" icon={UserIcon} label="Attend" />
                  <NavLink href="/timetable" icon={Calendar} label="Timetable" />
                  <NavLink href="/attendance" icon={BookOpen} label="Records" />
                  {userRole === 'admin' && (
                    <>
                      <NavLink href="/admin/dashboard" icon={ChartBar} label="Admin Dashboard" />
                      <NavLink href="/admin/verifications" icon={Users} label="Verifications" />
                    </>
                  )}
                </nav>
              )}
            </motion.div>
            {user ? (
              <motion.div 
                className="flex items-center space-x-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Notifications/>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User avatar"} />
                        <AvatarFallback>{user.displayName?.[0] || <UserIcon className="h-4 w-4" />}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.displayName}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center">
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/password" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Password</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <LogoutButton />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            ) : (
              <motion.div 
                className="space-x-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Button asChild variant="ghost">
                  <Link href="/login">Log In</Link>
                </Button>
                <Button asChild className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <Link href="/register">Register</Link>
                </Button>
              </motion.div>
            )}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
          {mobileMenuOpen && user && (
            <nav className="md:hidden bg-white border-t p-4">
              <div className="flex flex-col space-y-4">
                <NavLink href="/" icon={Home} label="Home" />
                <NavLink href="/dashboard" icon={UserIcon} label="Attend" />
                <NavLink href="/timetable" icon={Calendar} label="Timetable" />
                <NavLink href="/attendance" icon={BookOpen} label="Records" />
                <NavLink href="/profile" icon={UserIcon} label="Profile" />
                <NavLink href="/password" icon={Settings} label="Password" />
                <button onClick={() => auth.signOut()} className="flex items-center text-gray-700 hover:text-primary">
                  <LogoutButton />
                </button>
              </div>
            </nav>
          )}
        </header>
        <main className="flex-grow container mx-auto p-4 mt-4">
          {children}
        </main>
        <footer className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 text-center mt-4">
          <p>&copy; 2024 Student Attendance System. All rights reserved.</p>
        </footer>
      </body>
    </html>
  )
}