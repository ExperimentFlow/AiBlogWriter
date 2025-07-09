import React from 'react';
import { UserProfile } from '../../components/UserProfile';

export default function UserDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            User Authentication Demo
          </h1>
          <p className="text-gray-600">
            This page demonstrates the useUser hook functionality including login, 
            profile management, and tenant information.
          </p>
        </div>
        
        <UserProfile />
      </div>
    </div>
  );
} 