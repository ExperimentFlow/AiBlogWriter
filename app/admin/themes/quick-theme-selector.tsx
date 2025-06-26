'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { themes, getTheme } from '@/lib/themes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Palette, Check } from 'lucide-react';
import { updateThemeAction } from '@/app/actions';

interface QuickThemeSelectorProps {
  tenant: any;
  className?: string;
}

export function QuickThemeSelector({ tenant, className = '' }: QuickThemeSelectorProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(tenant.theme || 'default');

  const currentTheme = getTheme(tenant.theme || 'default');

  const handleThemeChange = async (themeId: string) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('tenantId', tenant.id);
      formData.append('themeId', themeId);
      
      const result = await updateThemeAction(formData);
      
      if (result.success) {
        setSelectedTheme(themeId);
        router.refresh();
      } else {
        console.error('Failed to update theme:', result.error);
      }
    } catch (error) {
      console.error('Failed to update theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center gap-2">
        <Palette className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Theme:</span>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-lg">{currentTheme.preview}</span>
        <span className="text-sm text-gray-600">{currentTheme.name}</span>
      </div>
      
      <Select value={selectedTheme} onValueChange={handleThemeChange} disabled={isLoading}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Change theme" />
        </SelectTrigger>
        <SelectContent>
          {themes.map((theme) => (
            <SelectItem key={theme.id} value={theme.id}>
              <div className="flex items-center gap-2">
                <span className="text-lg">{theme.preview}</span>
                <span>{theme.name}</span>
                {theme.id === tenant.theme && (
                  <Check className="h-4 w-4 text-green-500 ml-auto" />
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {isLoading && (
        <Badge variant="outline" className="text-xs">
          Updating...
        </Badge>
      )}
    </div>
  );
} 