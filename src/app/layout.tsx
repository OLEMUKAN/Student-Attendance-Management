"use client"

import { Inter } from 'next/font/google'
import './globals.css'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import NavLink from "./components/NavLink"
import { auth, db } from './firebase'
import { User } from 'firebase/auth'
import LogoutButton from './components/LogoutButton'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User as UserIcon, Home, Calendar, Bell, BookOpen, Settings, Menu, ChevronDown, ChartBar, Users } from 'lucide-react'
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
  const [dropdownOpen, setDropdownOpen] = useState(false)
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

  const closeDropdown = () => {
    setDropdownOpen(false)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  const NavItems = () => (
    <>
      <NavLink href="/" icon={Home} label="Home" onClick={closeMobileMenu} />
      <NavLink href="/dashboard" icon={UserIcon} label="Attend" onClick={closeMobileMenu} />
      <NavLink href="/timetable" icon={Calendar} label="Timetable" onClick={closeMobileMenu} />
      <NavLink href="/attendance" icon={BookOpen} label="Records" onClick={closeMobileMenu} />
      {userRole === 'admin' && (
        <>
          <NavLink href="/admin/dashboard" icon={ChartBar} label="Admin Dashboard" onClick={closeMobileMenu} />
          <NavLink href="/admin/verifications" icon={Users} label="Verifications" onClick={closeMobileMenu} />
        </>
      )}
    </>
  )

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
                <h1 className="hidden md:block text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                  Student Attendance System
                </h1>
              </Link>
            </motion.div>
            {user ? (
              <motion.div 
                className="flex items-center space-x-2 md:space-x-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <nav className="hidden md:flex space-x-4">
                  <NavItems />
                </nav>
                <Notifications />
                <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
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
                    <DropdownMenuItem asChild onClick={closeDropdown}>
                      <Link href="/profile" className="flex items-center">
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild onClick={closeDropdown}>
                      <Link href="/password" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Password</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={closeDropdown}>
                      <LogoutButton />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </motion.div>
            ) : (
              <motion.div 
                className="flex space-x-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Button asChild variant="ghost" className="px-3 py-1 text-sm">
                  <Link href="/login">Log In</Link>
                </Button>
                <Button asChild className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 text-sm">
                  <Link href="/register">Register</Link>
                </Button>
              </motion.div>
            )}
          </div>
          <AnimatePresence>
            {user && mobileMenuOpen && (
              <motion.nav
                className="md:hidden bg-white border-t"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="container py-2 flex flex-col space-y-2">
                  <NavItems />
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </header>
        <main className="flex-grow container mx-auto p-4 mt-4">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
        <footer className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 text-center mt-4">
          <p>&copy; 2024 Student Attendance System. All rights reserved.</p>
        </footer>
      </body>
    </html>
  )
}