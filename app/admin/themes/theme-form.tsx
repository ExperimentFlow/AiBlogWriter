'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { themes, getTheme, ThemeConfig } from '@/lib/themes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, Eye, Palette, ExternalLink } from 'lucide-react';
import { updateThemeAction } from '@/app/actions';

interface ThemeFormProps {
  tenant: any;
}

export function ThemeForm({ tenant }: ThemeFormProps) {
  const router = useRouter();
  const [selectedTheme, setSelectedTheme] = useState(tenant.theme || 'default');
  const [isLoading, setIsLoading] = useState(false);
  const [previewTheme, setPreviewTheme] = useState<ThemeConfig | null>(null);

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

  const handlePreview = (theme: ThemeConfig) => {
    setPreviewTheme(theme);
  };

  const handleClosePreview = () => {
    setPreviewTheme(null);
  };

  return (
    <div className="space-y-6">
      {/* Current Theme Display */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{currentTheme.preview}</div>
          <div>
            <div className="font-semibold text-gray-900">{currentTheme.name}</div>
            <div className="text-sm text-gray-600">{currentTheme.description}</div>
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          Current Theme
        </Badge>
      </div>

      {/* Theme Selector */}
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Select Theme
          </label>
          <Select value={selectedTheme} onValueChange={handleThemeChange} disabled={isLoading}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a theme" />
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
        </div>

        {/* Theme Options */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {themes.map((theme) => (
            <Card 
              key={theme.id} 
              className={`border-2 cursor-pointer transition-all hover:shadow-lg ${
                theme.id === selectedTheme 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handlePreview(theme)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="text-2xl">{theme.preview}</div>
                  {theme.id === tenant.theme && (
                    <Badge variant="default" className="text-xs">
                      Active
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-base">{theme.name}</CardTitle>
                <CardDescription className="text-sm">{theme.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Mini Preview */}
                  <div 
                    className="h-16 rounded-md border border-gray-200 relative overflow-hidden"
                    style={{
                      background: `linear-gradient(to bottom right, ${theme.colors.background}, ${theme.colors.surface})`
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-sm font-medium" style={{ color: theme.colors.text }}>
                          {theme.name}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Color Palette */}
                  <div className="flex gap-1">
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-200" 
                      style={{ backgroundColor: theme.colors.primary }}
                      title="Primary"
                    />
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-200" 
                      style={{ backgroundColor: theme.colors.secondary }}
                      title="Secondary"
                    />
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-200" 
                      style={{ backgroundColor: theme.colors.accent }}
                      title="Accent"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleThemeChange(theme.id);
                      }}
                      disabled={isLoading || theme.id === tenant.theme}
                    >
                      {theme.id === tenant.theme ? (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          Active
                        </>
                      ) : (
                        'Apply'
                      )}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreview(theme);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Preview Modal */}
      {previewTheme && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{previewTheme.preview}</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{previewTheme.name}</h3>
                    <p className="text-gray-600">{previewTheme.description}</p>
                  </div>
                </div>
                <Button variant="ghost" onClick={handleClosePreview}>
                  ✕
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Theme Preview */}
              <div 
                className="min-h-[400px] rounded-lg border-2 border-gray-200 overflow-hidden"
                style={{
                  background: `linear-gradient(to bottom right, ${previewTheme.colors.background}, ${previewTheme.colors.surface})`
                }}
              >
                <div className="p-8">
                  <div className="text-center mb-8">
                    <div className="text-6xl mb-4">{tenant.emoji}</div>
                    <h1 
                      className="text-4xl font-bold mb-4"
                      style={{ color: previewTheme.colors.text }}
                    >
                      {tenant.name || tenant.subdomain}
                    </h1>
                    <p 
                      className="text-xl mb-6"
                      style={{ color: previewTheme.colors.textSecondary }}
                    >
                      {tenant.description || 'Welcome to our blog'}
                    </p>
                  </div>
                  
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                      <div 
                        key={i}
                        className="p-6 rounded-lg border"
                        style={{
                          backgroundColor: previewTheme.colors.surface,
                          borderColor: previewTheme.colors.textSecondary + '20'
                        }}
                      >
                        <h3 
                          className="font-semibold mb-2"
                          style={{ color: previewTheme.colors.text }}
                        >
                          Sample Post {i}
                        </h3>
                        <p 
                          className="text-sm"
                          style={{ color: previewTheme.colors.textSecondary }}
                        >
                          This is a preview of how your blog posts will look with this theme.
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 mt-6">
                <Button 
                  onClick={() => {
                    handleThemeChange(previewTheme.id);
                    handleClosePreview();
                  }}
                  disabled={isLoading || previewTheme.id === tenant.theme}
                  className="flex-1"
                >
                  {previewTheme.id === tenant.theme ? 'Already Active' : 'Apply This Theme'}
                </Button>
                <Button variant="outline" onClick={handleClosePreview}>
                  Close Preview
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 