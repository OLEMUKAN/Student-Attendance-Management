import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface PendingUser {
  id: string;
  name: string;
  email: string;
  verificationStatus: string;
}

interface PendingVerificationsProps {
  users: PendingUser[];
}

export default function PendingVerifications({ users }: PendingVerificationsProps) {
  const [verifyingUsers, setVerifyingUsers] = useState<Set<string>>(new Set());

  const handleVerification = async (userId: string, action: 'approve' | 'reject') => {
    setVerifyingUsers(new Set(verifyingUsers.add(userId)));
    try {
      await updateDoc(doc(db, 'users', userId), {
        verificationStatus: action === 'approve' ? 'verified' : 'rejected'
      });
    } catch (error) {
      console.error('Error updating user verification status:', error);
    } finally {
      setVerifyingUsers(new Set([...verifyingUsers].filter(id => id !== userId)));
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Pending Verifications</h2>
      {users.length === 0 ? (
        <p>No pending verifications</p>
      ) : (
        <ul className="space-y-4">
          {users.map((user) => (
            <li key={user.id} className="bg-white shadow rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleVerification(user.id, 'approve')}
                    disabled={verifyingUsers.has(user.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleVerification(user.id, 'reject')}
                    disabled={verifyingUsers.has(user.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}