'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { MapPin, Loader2 } from 'lucide-react'
import { auth, db } from '../firebase'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'

const ALLOWED_DISTANCE = 100 // meters
const CLASS_LOCATION = { latitude: 0.6124352, longitude: 32.4762159 } // Updated with actual class coordinates

interface AttendanceCheckInProps {
  classId: string
}

export default function AttendanceCheckIn({ classId }: AttendanceCheckInProps) {
  const [location, setLocation] = useState<GeolocationCoordinates | null>(null)
  const [distance, setDistance] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(position.coords)
          const calculatedDistance = calculateDistance(
            position.coords.latitude,
            position.coords.longitude,
            CLASS_LOCATION.latitude,
            CLASS_LOCATION.longitude
          )
          setDistance(calculatedDistance)
        },
        (error) => {
          setError('Unable to retrieve your location')
        }
      )
    } else {
      setError('Geolocation is not supported by your browser')
    }
  }, [])

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3 // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180
    const φ2 = lat2 * Math.PI / 180
    const Δφ = (lat2 - lat1) * Math.PI / 180
    const Δλ = (lon2 - lon1) * Math.PI / 180

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
  }

  const handleCheckIn = async () => {
    if (!auth.currentUser) {
      setError('You must be logged in to check in')
      return
    }

    if (distance === null || distance > ALLOWED_DISTANCE) {
      setError('You are not within range to check in')
      return
    }

    setIsLoading(true)
    try {
      await setDoc(doc(db, 'attendance', `${classId}_${auth.currentUser.uid}`), {
        userId: auth.currentUser.uid,
        classId: classId,
        timestamp: serverTimestamp(),
        location: {
          latitude: location?.latitude,
          longitude: location?.longitude
        }
      })
      setIsCheckedIn(true)
    } catch (error) {
      setError('Failed to check in. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Attendance Check-In</CardTitle>
        <CardDescription>Check in for your class</CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : location ? (
          <div>
            <p>Your current location has been detected.</p>
            {distance !== null && (
              <p>
                You are approximately {Math.round(distance)} meters from the class location.
              </p>
            )}
          </div>
        ) : (
          <p>Detecting your location...</p>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleCheckIn}
          disabled={isCheckedIn || isLoading || !location || (distance !== null && distance > ALLOWED_DISTANCE)}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking In...
            </>
          ) : isCheckedIn ? (
            <>
              <MapPin className="mr-2 h-4 w-4" />
              Checked In
            </>
          ) : (
            <>
              <MapPin className="mr-2 h-4 w-4" />
              Check In
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}