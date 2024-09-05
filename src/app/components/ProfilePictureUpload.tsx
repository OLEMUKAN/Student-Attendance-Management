'use client'
import React, { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { auth, db } from './../firebase';
import { doc, updateDoc } from 'firebase/firestore';

const ProfilePictureUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !auth.currentUser) return;

    setUploading(true);
    const storage = getStorage();
    const storageRef = ref(storage, `profile_pictures/${auth.currentUser.uid}`);
    await uploadBytes(storageRef, file);
    const photoURL = await getDownloadURL(storageRef);

    await updateProfile(auth.currentUser, { photoURL });
    await updateDoc(doc(db, 'users', auth.currentUser.uid), { photoURL });

    setUploading(false);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
};

export default ProfilePictureUpload;