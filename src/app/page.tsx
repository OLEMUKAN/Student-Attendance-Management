"use client"

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { ClipboardList, UserPlus, LogIn } from 'lucide-react'
import { auth } from './firebase' // Adjust the import path as necessary
import { User } from 'firebase/auth'

export default function Home() {
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
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Welcome</CardTitle>
              <CardDescription>Manage your attendance with ease</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Our Student Attendance System helps you keep track of your class attendance, view your timetable, and stay updated with important notifications.
              </p>
            </CardContent>
            <CardFooter>
              <ClipboardList className="h-6 w-6 text-primary" />
            </CardFooter>
          </Card>

          {!user && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>New User?</CardTitle>
                  <CardDescription>Create an account to get started</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Register now to access all features of the Student Attendance System. It&apos;s quick and easy!
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href="/register">
                      <UserPlus className="mr-2 h-4 w-4" /> Register
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Returning User?</CardTitle>
                  <CardDescription>Log in to your account</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Already have an account? Log in to view your attendance, check your timetable, and more.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/login">
                      <LogIn className="mr-2 h-4 w-4" /> Log In
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
