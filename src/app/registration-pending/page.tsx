'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { EnvelopeIcon } from '@heroicons/react/24/outline'

export default function RegistrationPending() {
  return (
    <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Registration Pending</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Thank you for registering. Your account is currently pending verification by an administrator. Please check back later or contact your administrator for more information.</p>
          <p className="mb-4">Estimated verification time: 1-2 business days</p>
          <Button className="w-full" onClick={() => window.location.href = 'mailto:olemukan4@gmail.com'}>
            <EnvelopeIcon className="h-5 w-5 mr-2" />
            Contact Administrator
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}