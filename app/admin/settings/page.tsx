import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Settings, Globe, Mail, Shield, Database } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
        <p className="text-gray-600 mt-1">
          Configure your platform settings and preferences
        </p>
      </div>

      <div className="grid gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              General Settings
            </CardTitle>
            <CardDescription>
              Basic site configuration and branding
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  defaultValue="Multi-Tenant Platform"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="siteUrl">Site URL</Label>
                <Input
                  id="siteUrl"
                  defaultValue="https://yourdomain.com"
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="siteDescription">Site Description</Label>
              <Textarea
                id="siteDescription"
                defaultValue="A modern multi-tenant platform for creating custom subdomains"
                className="mt-1"
                rows={3}
              />
            </div>
            <Button>Save General Settings</Button>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Settings
            </CardTitle>
            <CardDescription>
              Configure email notifications and SMTP settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="smtpHost">SMTP Host</Label>
                <Input
                  id="smtpHost"
                  placeholder="smtp.gmail.com"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="smtpPort">SMTP Port</Label>
                <Input
                  id="smtpPort"
                  placeholder="587"
                  className="mt-1"
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="smtpUser">SMTP Username</Label>
                <Input
                  id="smtpUser"
                  placeholder="your-email@gmail.com"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="smtpPass">SMTP Password</Label>
                <Input
                  id="smtpPass"
                  type="password"
                  placeholder="••••••••"
                  className="mt-1"
                />
              </div>
            </div>
            <Button>Save Email Settings</Button>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Settings
            </CardTitle>
            <CardDescription>
              Configure security and authentication settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="requireAuth">Require Authentication</Label>
                <p className="text-sm text-gray-500">
                  Require users to be logged in to create subdomains
                </p>
              </div>
              <Switch id="requireAuth" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailVerification">Email Verification</Label>
                <p className="text-sm text-gray-500">
                  Require email verification for new accounts
                </p>
              </div>
              <Switch id="emailVerification" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
                <p className="text-sm text-gray-500">
                  Enable 2FA for admin accounts
                </p>
              </div>
              <Switch id="twoFactor" />
            </div>
            <Button>Save Security Settings</Button>
          </CardContent>
        </Card>

        {/* Database Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Settings
            </CardTitle>
            <CardDescription>
              Database configuration and maintenance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="dbUrl">Database URL</Label>
                <Input
                  id="dbUrl"
                  type="password"
                  placeholder="postgresql://..."
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="dbPool">Connection Pool</Label>
                <Input
                  id="dbPool"
                  placeholder="10"
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Test Connection</Button>
              <Button variant="outline">Backup Database</Button>
              <Button variant="outline">Reset Database</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 