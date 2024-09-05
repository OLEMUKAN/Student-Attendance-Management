'use client'

import { useState, useEffect, useCallback } from 'react'
import { auth, db } from '../firebase'
import { collection, query, where, getDocs, Timestamp, onSnapshot } from 'firebase/firestore'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, addWeeks, eachDayOfInterval } from 'date-fns'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

type AttendanceRecord = {
  id: string
  lectureId: string
  timestamp: Timestamp
  course: string
  lecturer: string
}

type ScheduleItem = {
  id: string
  day: string
  startTime: string
  endTime: string
  course: string
  lecturer: string
  room: string
}

export default function StudentAttendance() {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<AttendanceRecord[]>([])
  const [filterType, setFilterType] = useState<'daily' | 'weekly' | 'monthly'>('weekly')
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [attendanceFilter, setAttendanceFilter] = useState<'all' | 'attended' | 'missed'>('all')
  const [schedule, setSchedule] = useState<ScheduleItem[]>([])
  const [attendanceData, setAttendanceData] = useState<{ date: string; count: number }[]>([])

  const filterRecords = useCallback(() => {
    let filtered = [...attendanceRecords]

    // Apply date filter
    switch (filterType) {
      case 'daily':
        filtered = filtered.filter(record => 
          format(record.timestamp.toDate(), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
        )
        break
      case 'weekly':
        const weekStart = startOfWeek(selectedDate)
        const weekEnd = endOfWeek(selectedDate)
        filtered = filtered.filter(record => 
          isWithinInterval(record.timestamp.toDate(), { start: weekStart, end: weekEnd })
        )
        break
      case 'monthly':
        const monthStart = startOfMonth(selectedDate)
        const monthEnd = endOfMonth(selectedDate)
        filtered = filtered.filter(record => 
          isWithinInterval(record.timestamp.toDate(), { start: monthStart, end: monthEnd })
        )
        break
    }

    // Apply attendance filter
    switch (attendanceFilter) {
      case 'attended':
        filtered = filtered.filter(record => record.timestamp.toDate() <= new Date())
        break
      case 'missed':
        const lastWeek = addWeeks(new Date(), -1)
        filtered = filtered.filter(record => 
          record.timestamp.toDate() <= lastWeek && !attendanceRecords.some(ar => ar.lectureId === record.lectureId)
        )
        break
    }

    setFilteredRecords(filtered)
  }, [filterType, selectedDate, attendanceFilter, attendanceRecords])

  useEffect(() => {
    if (!auth.currentUser) return

    const fetchSchedule = async () => {
      const scheduleRef = collection(db, 'schedule')
      const scheduleSnapshot = await getDocs(scheduleRef)
      const scheduleData: ScheduleItem[] = []
      scheduleSnapshot.forEach((doc) => {
        scheduleData.push({ id: doc.id, ...doc.data() } as ScheduleItem)
      })
      setSchedule(scheduleData)
    }

    fetchSchedule()

    const attendanceQuery = query(
      collection(db, 'attendance'),
      where('userId', '==', auth.currentUser.uid)
    )

    const unsubscribe = onSnapshot(attendanceQuery, (snapshot) => {
      const records: AttendanceRecord[] = []
      snapshot.forEach((doc) => {
        const data = doc.data()
        const scheduleItem = schedule.find(item => item.id === data.lectureId)
        if (scheduleItem) {
          records.push({
            id: doc.id,
            lectureId: data.lectureId,
            timestamp: data.timestamp,
            course: scheduleItem.course,
            lecturer: scheduleItem.lecturer
          })
        }
      })
      setAttendanceRecords(records)
    })

    return () => unsubscribe()
  }, [schedule])

  useEffect(() => {
    filterRecords()
  }, [filterRecords])

  useEffect(() => {
    // After fetching attendance records, process them for the chart
    const processAttendanceData = () => {
      const attendanceCounts: { [key: string]: number } = {}
      attendanceRecords.forEach(record => {
        const date = format(record.timestamp.toDate(), 'yyyy-MM-dd')
        attendanceCounts[date] = (attendanceCounts[date] || 0) + 1
      })

      const chartData = Object.entries(attendanceCounts).map(([date, count]) => ({ date, count }))
      setAttendanceData(chartData)
    }

    processAttendanceData()
  }, [attendanceRecords])

  return (
    <div className="space-y-4">
      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="chart">Chart View</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Attendance Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Tabs value={filterType} onValueChange={(value) => setFilterType(value as 'daily' | 'weekly' | 'monthly')}>
                    <TabsList>
                      <TabsTrigger value="daily">Daily</TabsTrigger>
                      <TabsTrigger value="weekly">Weekly</TabsTrigger>
                      <TabsTrigger value="monthly">Monthly</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <Select value={attendanceFilter} onValueChange={(value: "all" | "attended" | "missed") => setAttendanceFilter(value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter attendance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Lectures</SelectItem>
                      <SelectItem value="attended">Attended</SelectItem>
                      <SelectItem value="missed">Missed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="rounded-md border"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">Attendance List</h3>
                    {filteredRecords.length > 0 ? (
                      <ul className="space-y-2">
                        {filteredRecords.map((record) => (
                          <li key={record.id} className="bg-secondary p-2 rounded-md">
                            <p className="font-medium">{record.course}</p>
                            <p className="text-sm text-muted-foreground">Lecturer: {record.lecturer}</p>
                            <p className="text-sm text-muted-foreground">
                              Date: {format(record.timestamp.toDate(), 'PPP')}
                            </p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground">No records found for the selected criteria.</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="chart">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}