'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setEmail('');
        
        // Redirect after successful login
        setTimeout(() => {
          router.push(data.redirectTo || '/admin');
          router.refresh();
        }, 1500);
      } else {
        setError(data.error || 'An error occurred.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {message && (
        <div className="text-green-600 text-sm bg-green-50 p-3 rounded-md">
          {message}
          <div className="mt-2 text-xs text-gray-600">
            Redirecting you to dashboard...
          </div>
        </div>
      )}
      
      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Email address"
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
        
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Sending reset email...' : 'Send reset email'}
        </Button>
      </form>
    </div>
  );
} 