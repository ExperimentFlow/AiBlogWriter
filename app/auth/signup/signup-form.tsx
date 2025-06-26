'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { signUpSchema, type SignUpFormData } from '@/lib/validations/auth';

export function SignUpForm() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: 'onBlur',
  });

  const password = watch('password');

  const onSubmit = async (data: SignUpFormData) => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(responseData.error || 'Sign-up failed');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
          {error}
        </div>
      )}
      
      <FormField
        label="Full name"
        id="name"
        type="text"
        autoComplete="name"
        error={errors.name?.message}
        {...register('name')}
      />
      
      <FormField
        label="Email address"
        id="email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />
      
      <div className="space-y-2">
        <FormField
          label="Password"
          id="password"
          type="password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password')}
        />
        {password && !errors.password && (
          <div className="text-sm text-gray-600">
            <p className="font-medium">Password requirements:</p>
            <ul className="list-disc list-inside space-y-1 mt-1">
              <li className={password.length >= 6 ? 'text-green-600' : 'text-gray-500'}>
                At least 6 characters
              </li>
              <li className={/[a-z]/.test(password) ? 'text-green-600' : 'text-gray-500'}>
                One lowercase letter
              </li>
              <li className={/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-500'}>
                One uppercase letter
              </li>
              <li className={/\d/.test(password) ? 'text-green-600' : 'text-gray-500'}>
                One number
              </li>
            </ul>
          </div>
        )}
      </div>
      
      <FormField
        label="Confirm password"
        id="confirmPassword"
        type="password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />
      
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Creating account...' : 'Create account'}
      </Button>
    </form>
  );
} 