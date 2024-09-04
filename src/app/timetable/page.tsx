'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type Lecture = {
  course: string
  lecturer: string
  room: string
  start: string
  end: string
}

type DaySchedule = {
  [key: string]: Lecture[]
}

const timetable: DaySchedule = {
  'MONDAY': [],
  'TUESDAY': [
    {
      course: 'BIT /BCS 3101/BSE 3101 User Interface & Programming with Visual Basic',
      lecturer: 'Mr. Bukoli Herbert son',
      room: 'Maini Lab-SC',
      start: '08:00',
      end: '11:00'
    },
    {
      course: 'BIT 3102- Human Computer Interaction',
      lecturer: 'Mr. Bazeketta Datsun',
      room: 'Main Lab - Lady Irene',
      start: '11:00',
      end: '14:00'
    }
  ],
  'WEDNESDAY': [],
  'THURSDAY': [
    {
      course: 'BIT 3104/BCS 3108 Business Intelligence & Data Warehousing',
      lecturer: 'Mr. Jude Iyke Nicholars',
      room: 'Room 8-Level 3-SC',
      start: '08:00',
      end: '11:00'
    },
    {
      course: 'BIT 3108/BCS 3103- Network Design & Administration',
      lecturer: 'Ms. Nantege Hellen',
      room: 'Room 8-Level 3-SC',
      start: '11:00',
      end: '14:00'
    },
    {
      course: 'BIT 3103 & YR. 4104 I.T Project Planning & Management',
      lecturer: 'Mr. Onyango Laban',
      room: 'Room 1-Level 3-SC',
      start: '14:00',
      end: '17:00'
    }
  ],
  'FRIDAY': [
    {
      course: 'BIT/BCS 3105 Systems Administration',
      lecturer: 'Mr. Muchake Brian',
      room: 'Room: D1-1 Lab (Block D)',
      start: '08:00',
      end: '11:00'
    }
  ]
}

export default function TimetablePage() {
  const [selectedDay, setSelectedDay] = useState<string>('MONDAY')

  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Timetable</h1>
      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select onValueChange={setSelectedDay} value={selectedDay}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a day" />
              </SelectTrigger>
              <SelectContent>
                {days.map((day) => (
                  <SelectItem key={day} value={day}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Lecturer</TableHead>
                <TableHead>Room</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timetable[selectedDay].length > 0 ? (
                timetable[selectedDay].map((lecture, index) => (
                  <TableRow key={index}>
                    <TableCell>{`${lecture.start} - ${lecture.end}`}</TableCell>
                    <TableCell>{lecture.course}</TableCell>
                    <TableCell>{lecture.lecturer}</TableCell>
                    <TableCell>{lecture.room}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">No lectures scheduled for this day</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}