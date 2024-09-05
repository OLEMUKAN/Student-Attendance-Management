'use client'

import { useState, useEffect,useCallback  } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { MapPin, Loader2 } from 'lucide-react'
import { auth, db } from '../firebase'
import { doc, setDoc, serverTimestamp, query, collection, where, getDocs, addDoc } from 'firebase/firestore'

type Lecture = {
  id: string
  course: string
  lecturer: string
  room: string
  location: {
    latitude: number
    longitude: number
  }
}

type TimeSlot = {
  start: string
  end: string
  lectures: Lecture[]
}

type DaySchedule = {
  [key: string]: TimeSlot[]
}

const ALLOWED_DISTANCE = 100 // meters

const schedule: DaySchedule = {
  'MONDAY': [],
  'TUESDAY': [
    {
      start: '08:00',
      end: '11:00',
      lectures: [
        {
          id: 'TUE_0800_BIT3101',
          course: 'BIT /BCS 3101/BSE 3101 User Interface & Programming with Visual Basic',
          lecturer: 'Mr. Bukoli Herbert son',
          room: 'Maini Lab-SC',
          location: { latitude: 0.6124352, longitude: 32.4762159 }
        }
      ]
    },
    {
      start: '11:00',
      end: '14:00',
      lectures: [
        {
          id: 'TUE_1100_BIT3102',
          course: 'BIT 3102- Human Computer Interaction',
          lecturer: 'Mr. Bazeketta Datsun',
          room: 'Main Lab - Lady Irene',
          location: { latitude: 0.6124352, longitude: 32.4762159 }
        }
      ]
    }
  ],
  'WEDNESDAY': [],
  'THURSDAY': [
    {
      start: '08:00',
      end: '11:00',
      lectures: [
        {
          id: 'THU_0800_BIT3104',
          course: 'BIT 3104/BCS 3108 Business Intelligence & Data Warehousing',
          lecturer: 'Mr. Jude Iyke Nicholars',
          room: 'Room 8-Level 3-SC',
          location: { latitude: 0.6124352, longitude: 32.4762159 }
        }
      ]
    },
    {
      start: '11:00',
      end: '14:00',
      lectures: [
        {
          id: 'THU_1100_BIT3108',
          course: 'BIT 3108/BCS 3103- Network Design & Administration',
          lecturer: 'Ms. Nantege Hellen',
          room: 'Room 8-Level 3-SC',
          location: { latitude: 0.6124352, longitude: 32.4762159 }
        }
      ]
    },
    {
      start: '14:00',
      end: '17:00',
      lectures: [
        {
          id: 'THU_1400_BIT3103',
          course: 'BIT 3103 & YR. 4104 I.T Project Planning & Management',
          lecturer: 'Mr. Onyango Laban',
          room: 'Room 1-Level 3-SC',
          location: { latitude: 0.6124352, longitude: 32.4762159 }
        }
      ]
    }
  ],
  'FRIDAY': [
    {
      start: '08:00',
      end: '11:00',
      lectures: [
        {
          id: 'FRI_0800_BIT3105',
          course: 'BIT/BCS 3105 Systems Administration',
          lecturer: 'Mr. Muchake Brian',
          room: 'Room: D1-1 Lab (Block D)',
          location: { latitude: 0.6124352, longitude: 32.4762159 }
        }
      ]
    }
  ]
}

export default function AttendanceCheckIn() {
  const [currentDay, setCurrentDay] = useState<string>('')
  const [currentTime, setCurrentTime] = useState<string>('')
  const [availableLectures, setAvailableLectures] = useState<Lecture[]>([])
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null)
  const [location, setLocation] = useState<GeolocationCoordinates | null>(null)
  const [distance, setDistance] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasCheckedIn, setHasCheckedIn] = useState(false)

  const checkExistingCheckIn = useCallback(async () => {
    if (!auth.currentUser || !selectedLecture) return

    const q = query(
      collection(db, 'attendance'),
      where('userId', '==', auth.currentUser.uid),
      where('lectureId', '==', selectedLecture.id)
    )

    const querySnapshot = await getDocs(q)
    setHasCheckedIn(!querySnapshot.empty)
  }, [selectedLecture])

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()
      const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
      setCurrentDay(days[now.getDay()])
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }))
    }

    updateDateTime()
    const timer = setInterval(updateDateTime, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const daySchedule = schedule[currentDay] || []
    const currentTimeSlot = daySchedule.find(slot => 
      currentTime >= slot.start && currentTime < slot.end
    )

    setAvailableLectures(currentTimeSlot?.lectures || [])
    setSelectedLecture(null)
  }, [currentDay, currentTime])

  useEffect(() => {
    if ('geolocation' in navigator && selectedLecture) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(position.coords)
          const calculatedDistance = calculateDistance(
            position.coords.latitude,
            position.coords.longitude,
            selectedLecture.location.latitude,
            selectedLecture.location.longitude
          )
          setDistance(calculatedDistance)
        },
        (error) => {
          setError('Unable to retrieve your location')
        }
      )
    } else if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported by your browser')
    }
  }, [selectedLecture])

  useEffect(() => {
    if (selectedLecture && auth.currentUser) {
      checkExistingCheckIn()
    }
  }, [selectedLecture, checkExistingCheckIn])

  useEffect(() => {
    const uploadScheduleToFirestore = async () => {
      try {
        const scheduleRef = collection(db, 'schedule')
        for (const [day, timeSlots] of Object.entries(schedule)) {
          for (const timeSlot of timeSlots) {
            for (const lecture of timeSlot.lectures) {
              await addDoc(scheduleRef, {
                day,
                startTime: timeSlot.start,
                endTime: timeSlot.end,
                ...lecture
              })
            }
          }
        }
        console.log('Schedule uploaded to Firestore')
      } catch (error) {
        console.error('Error uploading schedule to Firestore:', error)
      }
    }

    uploadScheduleToFirestore()
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

  const handleLectureSelect = (lectureId: string) => {
    const lecture = availableLectures.find(l => l.id === lectureId)
    setSelectedLecture(lecture || null)
    setIsCheckedIn(false)
    setHasCheckedIn(false)
  }

  const handleCheckIn = async () => {
    if (!auth.currentUser) {
      setError('You must be logged in to check in')
      return
    }

    if (!selectedLecture) {
      setError('Please select a lecture to check in')
      return
    }

    if (distance === null || distance > ALLOWED_DISTANCE) {
      setError('You are not within range to check in')
      return
    }

    if (hasCheckedIn) {
      setError('You have already checked in for this lecture')
      return
    }

    setIsLoading(true)
    try {
      await setDoc(doc(db, 'attendance', `${selectedLecture.id}_${auth.currentUser.uid}`), {
        userId: auth.currentUser.uid,
        lectureId: selectedLecture.id,
        timestamp: serverTimestamp(),
        location: {
          latitude: location?.latitude,
          longitude: location?.longitude
        }
      })
      setIsCheckedIn(true)
      setHasCheckedIn(true)
    } catch (error) {
      setError('Failed to check in. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Lecture Attendance</CardTitle>
        <CardDescription>Select your lecture and check in</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium">Current Day: {currentDay}</p>
          <p className="text-sm font-medium">Current Time: {currentTime}</p>
        </div>
        {availableLectures.length > 0 ? (
          <>
            <Select onValueChange={handleLectureSelect} value={selectedLecture?.id || ''}>
              <SelectTrigger>
                <SelectValue placeholder="Select a lecture" />
              </SelectTrigger>
              <SelectContent>
                {availableLectures.map((lecture) => (
                  <SelectItem key={lecture.id} value={lecture.id}>
                    {lecture.course} - {lecture.lecturer}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedLecture && (
              <div className="text-sm">
                <p><strong>Course:</strong> {selectedLecture.course}</p>
                <p><strong>Lecturer:</strong> {selectedLecture.lecturer}</p>
                <p><strong>Room:</strong> {selectedLecture.room}</p>
                {hasCheckedIn && <p className="text-green-500 font-medium">You have already checked in for this lecture.</p>}
              </div>
            )}
            {error && <p className="text-red-500">{error}</p>}
            {location && distance !== null && (
              <p>
                You are approximately {Math.round(distance)} meters from the class location.
              </p>
            )}
          </>
        ) : (
          <p>No lectures available at this time.</p>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleCheckIn}
          disabled={isCheckedIn || isLoading || !selectedLecture || !location || (distance !== null && distance > ALLOWED_DISTANCE) || hasCheckedIn}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking In...
            </>
          ) : isCheckedIn || hasCheckedIn ? (
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