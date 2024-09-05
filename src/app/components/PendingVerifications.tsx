'use client'

import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { toast } from "@/hooks/use-toast"

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
      toast({
        title: "User Updated",
        description: `User has been ${action === 'approve' ? 'approved' : 'rejected'}.`,
      })
    } catch (error) {
      console.error('Error updating user verification status:', error);
      toast({
        title: "Error",
        description: "Failed to update user status. Please try again.",
        variant: "destructive",
      })
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
        <div className="space-y-4">
          {users.map((user) => (
            <Card key={user.id}>
              <CardContent className="flex justify-between items-center p-4">
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <div className="space-x-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="default" disabled={verifyingUsers.has(user.id)}>
                        Approve
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Approve User</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to approve {user.name}?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleVerification(user.id, 'approve')}>
                          Approve
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" disabled={verifyingUsers.has(user.id)}>
                        Reject
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Reject User</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to reject {user.name}?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleVerification(user.id, 'reject')}>
                          Reject
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}