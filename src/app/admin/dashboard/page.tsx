'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, onSnapshot, DocumentData } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import PendingVerifications from '../../components/PendingVerifications';

interface PendingUser extends DocumentData {
  id: string;
  name: string;
  email: string;
  verificationStatus: string;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Check if user is admin (you'll need to implement this logic)
        const isUserAdmin = await checkIfUserIsAdmin(currentUser.uid);
        setIsAdmin(isUserAdmin);
        if (!isUserAdmin) {
          router.push('/dashboard');
        }
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (isAdmin) {
      const q = query(collection(db, 'users'), where('verificationStatus', '==', 'pending'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const users: PendingUser[] = [];
        querySnapshot.forEach((doc) => {
          users.push({ id: doc.id, ...doc.data() } as PendingUser);
        });
        setPendingUsers(users);
      });

      return () => unsubscribe();
    }
  }, [isAdmin]);

  if (!user || !isAdmin) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <PendingVerifications users={pendingUsers} />
    </div>
  );
}

async function checkIfUserIsAdmin(uid: string): Promise<boolean> {
  // Implement your admin check logic here
  // For example, you could have a separate 'admins' collection in Firestore
  // and check if the user's UID exists in that collection
  return true; // Placeholder: always return true for now
}