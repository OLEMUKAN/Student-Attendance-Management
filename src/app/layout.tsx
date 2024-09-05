"use client"
import { Inter } from 'next/font/google'
import './globals.css'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { auth } from './firebase' 
import { User } from 'firebase/auth'
import LogoutButton from './components/LogoutButton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User as UserIcon, Home, Calendar, Bell, BookOpen, Settings } from 'lucide-react'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user)
      } else {
        setUser(null)
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
                  <NavLink href="/" icon={<Home className="h-4 w-4" />} label="Home" />
                  <NavLink href="/dashboard" icon={<UserIcon className="h-4 w-4" />} label="Attend" />
                  <NavLink href="/timetable" icon={<Calendar className="h-4 w-4" />} label="Timetable" />
                  <NavLink href="/attendance" icon={<BookOpen className="h-4 w-4" />} label="Records" />
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
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="sr-only">Notifications</span>
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                </Button>
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
                      <Link href="/settings" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
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
          </div>
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

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link 
      href={href} 
      className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-primary transition-colors"
    >
      {icon}
      <span>{label}</span>
    </Link>
  )
}