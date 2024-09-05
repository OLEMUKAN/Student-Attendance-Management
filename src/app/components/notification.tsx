'use client'

import { useState, useEffect } from 'react'
import { auth, db } from './../firebase'
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore'
import { Bell } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Notification {
  id: string
  message: string
  timestamp: Date
  read: boolean
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const user = auth.currentUser
    if (!user) return

    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc'),
      limit(5)
    )

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notifs: Notification[] = []
      let unread = 0
      querySnapshot.forEach((doc) => {
        const notif = { id: doc.id, ...doc.data() } as Notification
        notifs.push(notif)
        if (!notif.read) unread++
      })
      setNotifications(notifs)
      setUnreadCount(unread)
    })

    return () => unsubscribe()
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <DropdownMenuItem key={notif.id} className="flex flex-col items-start">
              <span className={`text-sm ${notif.read ? 'text-gray-500' : 'font-bold'}`}>
                {notif.message}
              </span>
              <span className="text-xs text-gray-400">
                {notif.timestamp.toLocaleString()}
              </span>
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem>No new notifications</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}