'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Eye, 
  Clock, 
  TrendingUp, 
  Calendar,
  Edit,
  ExternalLink,
  Plus
} from 'lucide-react';
import Link from 'next/link';

export function BlogAnalyticsDashboard({ analytics }: { analytics: BlogAnalytics }) {
  return (
    <div className="space-y-6">
      {/* Tenant Info Header */}
      {analytics.tenantInfo && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-4xl">{analytics.tenantInfo.emoji}</div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {analytics.tenantInfo.name || analytics.tenantInfo.subdomain}
                  </h2>
                  <p className="text-gray-600">
                    {analytics.tenantInfo.subdomain}.platforms.com
                  </p>
                  {analytics.tenantInfo.description && (
                    <p className="text-sm text-gray-500 mt-1">
                      {analytics.tenantInfo.description}
                    </p>
                  )}
                </div>
              </div>
              <Button variant="outline" asChild>
                <a href={`https://${analytics.tenantInfo.subdomain}.platforms.com`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit Site
                </a>
              </Button>
        </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Posts"
          value={analytics.totalPosts}
          icon={FileText}
          color="blue"
        />
        <StatCard
          title="Published"
          value={analytics.postsByStatus.published}
          icon={Eye}
          color="green"
        />
        <StatCard
          title="Drafts"
          value={analytics.postsByStatus.draft}
          icon={Edit}
          color="orange"
        />
        <StatCard
          title="Scheduled"
          value={analytics.postsByStatus.scheduled}
          icon={Clock}
          color="purple"
        />
      </div>

      {/* Total Views Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.totalViews.toLocaleString()}</p>
              </div>
            </div>
            <Button asChild>
              <Link href="/admin/blog/create">
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Popular Posts and Recent Posts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <PostList
          posts={analytics.popularPosts}
          title="Popular Posts"
          emptyMessage="No published posts yet"
          showViews={true}
        />
        <PostList
          posts={analytics.recentPosts}
          title="Recent Posts"
          emptyMessage="No posts created yet"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button asChild variant="outline" className="h-16">
              <Link href="/admin/blog/create">
                <div className="text-center">
                  <Plus className="h-6 w-6 mx-auto mb-2" />
                  <span>Create New Post</span>
                </div>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-16">
              <Link href="/admin/blog">
                <div className="text-center">
                  <FileText className="h-6 w-6 mx-auto mb-2" />
                  <span>Manage Posts</span>
                </div>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-16">
              <Link href="/admin/themes">
                <div className="text-center">
                  <Calendar className="h-6 w-6 mx-auto mb-2" />
                  <span>Customize Theme</span>
                </div>
              </Link>
            </Button>
        </div>
        </CardContent>
      </Card>
    </div>
  );
}
