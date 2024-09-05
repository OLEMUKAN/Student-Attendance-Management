'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, onSnapshot, DocumentData, getDoc, doc, getDocs } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import PendingVerifications from '../../components/PendingVerifications';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface PendingUser extends DocumentData {
  id: string;
  name: string;
  email: string;
  verificationStatus: string;
}

interface AttendanceData {
  date: string;
  count: number;
}

export default function AdminDashboard() {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists() && userDoc.data().role === 'admin') {
          fetchData();
        } else {
          router.push('/dashboard');
        }
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const fetchData = async () => {
    // Fetch pending users
    const q = query(collection(db, 'users'), where('verificationStatus', '==', 'pending'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const users: PendingUser[] = [];
      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() } as PendingUser);
      });
      setPendingUsers(users);
    });

    // Fetch total users count
    const usersSnapshot = await getDocs(collection(db, 'users'));
    setTotalUsers(usersSnapshot.size);

    // Fetch attendance data (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const attendanceQuery = query(
      collection(db, 'attendance'),
      where('timestamp', '>=', sevenDaysAgo)
    );
    const attendanceSnapshot = await getDocs(attendanceQuery);
    const attendanceMap = new Map<string, number>();
    attendanceSnapshot.forEach((doc) => {
      const date = new Date(doc.data().timestamp.toDate()).toLocaleDateString();
      attendanceMap.set(date, (attendanceMap.get(date) || 0) + 1);
    });
    const chartData = Array.from(attendanceMap, ([date, count]) => ({ date, count }));
    setAttendanceData(chartData);

    setLoading(false);
  };

  if (loading) {
    return <Skeleton className="w-full h-96" />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="verifications">Pending Verifications</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{totalUsers}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Pending Verifications</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{pendingUsers.length}</p>
              </CardContent>
            </Card>
          </div>
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Attendance Overview (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart width={600} height={300} data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="verifications">
          <PendingVerifications users={pendingUsers} />
        </TabsContent>
      </Tabs>
    </div>
  );
}