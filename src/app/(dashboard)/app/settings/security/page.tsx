"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '~/components/ui/use-toast'
import { api } from "~/trpc/react";

interface PasswordChangeFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function SecuritySettings() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)
  const { register, handleSubmit, formState: { errors }, reset } = useForm<PasswordChangeFormData>()

  const changePasswordMutation = api.auth.changePassword.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Password changed successfully",
      })
      setIsSuccess(true)
      reset()
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to change password. Please try again.",
        variant: "destructive",
      })
      setIsError(true)
    },
  })

  const onSubmit = async (data: PasswordChangeFormData) => {
    setIsSuccess(false)
    setIsError(false)
    console.log(data.currentPassword)
    console.log(data.newPassword)

    changePasswordMutation.mutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword
    })
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>Change your password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm">Current Password</label>
              <Input
                type="password"
                id="currentPassword"
                {...register('currentPassword', { required: 'Current password is required' })}
              />
              {errors.currentPassword && <p className="text-red-500 text-sm mt-1">{errors.currentPassword.message}</p>}
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm">New Password</label>
              <Input
                type="password"
                id="newPassword"
                {...register('newPassword', {
                  required: 'New password is required',
                  minLength: { value: 8, message: 'Password must be at least 8 characters long' }
                })}
              />
              {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm">Confirm New Password</label>
              <Input
                type="password"
                id="confirmPassword"
                {...register('confirmPassword', {
                  required: 'Please confirm your new password',
                  validate: (value, formValues) => value === formValues.newPassword || 'Passwords do not match'
                })}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <Button type="submit" disabled={isLoading} className="bg-brand-gradient-r text-gray-900 hover:opacity-90">
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  )
}
