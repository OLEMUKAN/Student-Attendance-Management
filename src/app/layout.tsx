"use client"
import { Inter } from 'next/font/google'
import './globals.css'
import { useState, useEffect } from 'react'
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
import { User as UserIcon, Home, Calendar, Bell } from 'lucide-react'
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
      <body className={`${inter.className} flex flex-col min-h-screen bg-gray-100`}>
        <header className="sticky top-0 z-40 w-full border-b bg-background">
          <div className="container flex h-16 items-center justify-between px-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">Student Attendance System</h1>
              {user && (
                <nav className="hidden md:flex space-x-4">
                  <Link href="/" className="flex items-center space-x-1 text-sm font-medium hover:text-primary">
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </Link>
                  <Link href="/dashboard" className="flex items-center space-x-1 text-sm font-medium hover:text-primary">
                    <UserIcon className="h-4 w-4" />
                    <span>Attend</span>
                  </Link>
                  <Link href="/timetable" className="flex items-center space-x-1 text-sm font-medium hover:text-primary">
                    <Calendar className="h-4 w-4" />
                    <span>Timetable</span>
                  </Link>
                </nav>
              )}
            </div>
            {user ? (
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="sr-only">Notifications</span>
                  <div className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></div>
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
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <LogoutButton />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="space-x-2">
                <Button asChild variant="ghost">
                  <Link href="/login">Log In</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Register</Link>
                </Button>
              </div>
            )}
          </div>
        </header>
        <main className="flex-grow container mx-auto p-4 bg-white shadow-lg rounded-lg mt-4">
          {children}
        </main>
        <footer className="bg-blue-600 text-white p-4 text-center mt-4">
          <p>&copy; 2023 Student Attendance System. All rights reserved.</p>
        </footer>
      </body>
    </html>
  )
}