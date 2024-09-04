'use client'

import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '../firebase';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
      <button
          onClick={handleLogout}
          className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
      >
        Log Out
      </button>
  );
}