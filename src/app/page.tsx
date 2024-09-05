'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { ClipboardList, UserPlus, LogIn, CheckCircle, Clock, Bell } from 'lucide-react'
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

  const cardVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
        yoyo: Infinity,
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Welcome to Your Attendance Hub</h1>
          <p className="text-xl text-white">Track, Manage, and Excel in Your Academic Journey</p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <motion.div
            variants={cardVariants}
            whileHover="hover"
          >
            <Card className="bg-white/90 backdrop-blur-lg shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-purple-600">Smart Attendance</CardTitle>
                <CardDescription>Effortless tracking for your success</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Our cutting-edge system ensures accurate attendance records, helping you stay on top of your academic performance.
                </p>
              </CardContent>
              <CardFooter>
                <ClipboardList className="h-8 w-8 text-purple-500" />
              </CardFooter>
            </Card>
          </motion.div>

          {!user && (
            <>
              <motion.div
                variants={cardVariants}
                whileHover="hover"
              >
                <Card className="bg-white/90 backdrop-blur-lg shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-pink-600">Join the Community</CardTitle>
                    <CardDescription>Start your journey with us</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Create an account to unlock all features and take control of your attendance like never before!
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                      <Link href="/register">
                        <UserPlus className="mr-2 h-4 w-4" /> Register Now
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>

              <motion.div
                variants={cardVariants}
                whileHover="hover"
              >
                <Card className="bg-white/90 backdrop-blur-lg shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-red-600">Welcome Back</CardTitle>
                    <CardDescription>Access your personalized dashboard</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Already part of our community? Log in to view your attendance, check your timetable, and more.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full border-red-500 text-red-500 hover:bg-red-50">
                      <Link href="/login">
                        <LogIn className="mr-2 h-4 w-4" /> Log In
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-8">Why Choose Our System?</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 flex flex-col items-center">
              <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Accurate Tracking</h3>
              <p className="text-center text-gray-600">Real-time attendance monitoring for precise records</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 flex flex-col items-center">
              <Clock className="h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Time-Saving</h3>
              <p className="text-center text-gray-600">Quick and easy attendance marking process</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 flex flex-col items-center">
              <Bell className="h-12 w-12 text-yellow-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Instant Notifications</h3>
              <p className="text-center text-gray-600">Stay updated with attendance alerts and reminders</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}