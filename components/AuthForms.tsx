import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema, signUpSchema, profileUpdateSchema } from '../lib/validations/auth';
import type { SignInFormData, SignUpFormData, ProfileUpdateFormData } from '../lib/validations/auth';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface AuthFormsProps {
  onLogin: (data: SignInFormData) => Promise<void>;
  onRegister: (data: SignUpFormData) => Promise<void>;
  onUpdateProfile: (data: ProfileUpdateFormData) => Promise<void>;
}

export const AuthForms: React.FC<AuthFormsProps> = ({
  onLogin,
  onRegister,
  onUpdateProfile,
}) => {
  const loginForm = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const registerForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      role: 'user',
    },
  });

  const profileForm = useForm<ProfileUpdateFormData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      avatar: '',
    },
  });

  const handleLogin = async (data: SignInFormData) => {
    try {
      await onLogin(data);
      loginForm.reset();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleRegister = async (data: SignUpFormData) => {
    try {
      await onRegister(data);
      registerForm.reset();
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handleProfileUpdate = async (data: ProfileUpdateFormData) => {
    try {
      await onUpdateProfile(data);
      profileForm.reset();
    } catch (error) {
      console.error('Profile update failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Login Form */}
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
            <div>
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                {...loginForm.register('email')}
              />
              {loginForm.formState.errors.email && (
                <p className="text-sm text-red-600 mt-1">
                  {loginForm.formState.errors.email.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="login-password">Password</Label>
              <Input
                id="login-password"
                type="password"
                {...loginForm.register('password')}
              />
              {loginForm.formState.errors.password && (
                <p className="text-sm text-red-600 mt-1">
                  {loginForm.formState.errors.password.message}
                </p>
              )}
            </div>
            <Button type="submit" disabled={loginForm.formState.isSubmitting}>
              {loginForm.formState.isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Register Form */}
      <Card>
        <CardHeader>
          <CardTitle>Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="register-firstName">First Name</Label>
                <Input
                  id="register-firstName"
                  {...registerForm.register('firstName')}
                />
                {registerForm.formState.errors.firstName && (
                  <p className="text-sm text-red-600 mt-1">
                    {registerForm.formState.errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="register-lastName">Last Name</Label>
                <Input
                  id="register-lastName"
                  {...registerForm.register('lastName')}
                />
                {registerForm.formState.errors.lastName && (
                  <p className="text-sm text-red-600 mt-1">
                    {registerForm.formState.errors.lastName.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="register-email">Email</Label>
              <Input
                id="register-email"
                type="email"
                {...registerForm.register('email')}
              />
              {registerForm.formState.errors.email && (
                <p className="text-sm text-red-600 mt-1">
                  {registerForm.formState.errors.email.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="register-password">Password</Label>
              <Input
                id="register-password"
                type="password"
                {...registerForm.register('password')}
              />
              {registerForm.formState.errors.password && (
                <p className="text-sm text-red-600 mt-1">
                  {registerForm.formState.errors.password.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="register-confirmPassword">Confirm Password</Label>
              <Input
                id="register-confirmPassword"
                type="password"
                {...registerForm.register('confirmPassword')}
              />
              {registerForm.formState.errors.confirmPassword && (
                <p className="text-sm text-red-600 mt-1">
                  {registerForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="register-phone">Phone (Optional)</Label>
              <Input
                id="register-phone"
                {...registerForm.register('phone')}
              />
              {registerForm.formState.errors.phone && (
                <p className="text-sm text-red-600 mt-1">
                  {registerForm.formState.errors.phone.message}
                </p>
              )}
            </div>
            <Button type="submit" disabled={registerForm.formState.isSubmitting}>
              {registerForm.formState.isSubmitting ? 'Registering...' : 'Register'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Profile Update Form */}
      <Card>
        <CardHeader>
          <CardTitle>Update Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="profile-firstName">First Name</Label>
                <Input
                  id="profile-firstName"
                  {...profileForm.register('firstName')}
                />
                {profileForm.formState.errors.firstName && (
                  <p className="text-sm text-red-600 mt-1">
                    {profileForm.formState.errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="profile-lastName">Last Name</Label>
                <Input
                  id="profile-lastName"
                  {...profileForm.register('lastName')}
                />
                {profileForm.formState.errors.lastName && (
                  <p className="text-sm text-red-600 mt-1">
                    {profileForm.formState.errors.lastName.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="profile-phone">Phone</Label>
              <Input
                id="profile-phone"
                {...profileForm.register('phone')}
              />
              {profileForm.formState.errors.phone && (
                <p className="text-sm text-red-600 mt-1">
                  {profileForm.formState.errors.phone.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="profile-avatar">Avatar URL</Label>
              <Input
                id="profile-avatar"
                type="url"
                {...profileForm.register('avatar')}
              />
              {profileForm.formState.errors.avatar && (
                <p className="text-sm text-red-600 mt-1">
                  {profileForm.formState.errors.avatar.message}
                </p>
              )}
            </div>
            <Button type="submit" disabled={profileForm.formState.isSubmitting}>
              {profileForm.formState.isSubmitting ? 'Updating...' : 'Update Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}; 