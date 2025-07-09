"use client";

import type { Metadata } from 'next';
import { BlogAnalyticsDashboard } from './dashboard';
import { rootDomain } from '@/lib/utils';


export default function AdminPage() {


  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Blog Analytics Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Monitor your blog performance and manage your content
        </p>
      </div>
      
      {/* <BlogAnalyticsDashboard analytics={analytics} /> */}
    </div>
  );
}
