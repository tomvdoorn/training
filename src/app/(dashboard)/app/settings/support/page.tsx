"use client"
import { useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function SupportForm() {
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>()

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      // TODO: Implement support form submission logic here
      // For example: await submitSupportRequest(data)
      setIsSuccess(true)
      setIsError(false)
      reset()
    } catch (error) {
      setIsError(true)
      setIsSuccess(false)
    }
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Support Request</CardTitle>
          <CardDescription>Submit a support request and we will get back to you as soon as possible.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                {...register('name', { required: 'Name is required' })}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Entered value does not match email format"
                  }
                })}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                {...register('subject', { required: 'Subject is required' })}
              />
              {errors.subject && <p className="text-red-500 text-sm">{errors.subject.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                {...register('message', { required: 'Message is required' })}
              />
              {errors.message && <p className="text-red-500 text-sm">{errors.message.message}</p>}
            </div>

            <Button type="submit" className="bg-brand-gradient-r text-gray-900 hover:opacity-90">Submit Request</Button>
          </form>
        </CardContent>
        <CardFooter>
          {isSuccess && (
            <Alert>
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>Your support request has been submitted successfully!</AlertDescription>
            </Alert>
          )}

          {isError && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>An error occurred. Please try again.</AlertDescription>
            </Alert>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}