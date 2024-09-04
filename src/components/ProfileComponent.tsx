import React, { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../app/firebase';

interface ProfileComponentProps {
  user: User;
}

interface UserData {
  name: string;
  email: string;
  course: string;
  year: string;
  verificationStatus: 'pending' | 'verified';
}

const ProfileComponent: React.FC<ProfileComponentProps> = ({ user }) => {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data() as UserData);
      }
    };

    fetchUserData();
  }, [user]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">User Profile</h2>
      </div>
      <div>
        <p><strong>Name:</strong> {userData.name}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Course:</strong> {userData.course}</p>
        <p><strong>Year:</strong> {userData.year}</p>
        <p>
          <strong>Verification Status:</strong>
          <span className={`ml-2 px-2 py-1 rounded-full text-sm ${
            userData.verificationStatus === 'verified' 
              ? 'bg-green-200 text-green-800' 
              : 'bg-yellow-200 text-yellow-800'
          }`}>
            {userData.verificationStatus.charAt(0).toUpperCase() + userData.verificationStatus.slice(1)}
          </span>
        </p>
      </div>
    </div>
  );
};

export default ProfileComponent;
