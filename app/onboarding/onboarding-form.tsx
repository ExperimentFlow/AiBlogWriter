"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, Globe, Type, Image, Plus } from "lucide-react";
import { rootDomain } from "@/lib/utils";
import { useGallerySelect } from "@/hooks/use-gallery-select";
import { MediaItem } from "@/types/media";
import {
  Card,
  CardContent,
  CardTitle,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import { GalleryImagePicker } from "@/components/gallery-image-picker";
import { useUserContext } from "@/contexts/UserContext";

const onboardingSchema = z.object({
  subdomain: z
    .string()
    .min(3, "Subdomain must be at least 3 characters")
    .max(63, "Subdomain must be less than 63 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Subdomain can only contain lowercase letters, numbers, and hyphens"
    )
    .refine(
      (val) => !val.startsWith("-") && !val.endsWith("-"),
      "Subdomain cannot start or end with a hyphen"
    ),
  subtitle: z
    .string()
    .min(1, "Subtitle is required")
    .max(100, "Subtitle must be less than 100 characters"),
  favicon: z.string().optional(),
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

// Custom hook for debounced subdomain checking
function useDebouncedSubdomainCheck() {
  const [subdomainAvailable, setSubdomainAvailable] = useState<boolean | null>(
    null
  );
  const [checkingSubdomain, setCheckingSubdomain] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const checkSubdomain = useCallback(async (value: string) => {
    if (!value || value.length < 3) {
      setSubdomainAvailable(null);
      setError(null);
      return;
    }

    setCheckingSubdomain(true);
    setError(null);

    try {
      const response = await fetch("/api/check-subdomain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subdomain: value }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubdomainAvailable(data.available);
        if (!data.available && data.error) {
          setError(data.error);
        }
      } else {
        setSubdomainAvailable(null);
        setError(data.error || "Failed to check subdomain availability");
      }
    } catch (error) {
      setSubdomainAvailable(null);
      setError("Network error. Please try again.");
    } finally {
      setCheckingSubdomain(false);
    }
  }, []);

  const debouncedCheck = useCallback(
    (value: string) => {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Reset state immediately
      setSubdomainAvailable(null);
      setError(null);
      setCheckingSubdomain(false);

      // Don't check if value is too short
      if (!value || value.length < 3) {
        return;
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        checkSubdomain(value);
      }, 500);
    },
    [checkSubdomain]
  );

  return {
    subdomainAvailable,
    checkingSubdomain,
    error,
    debouncedCheck,
  };
}

export function OnboardingForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFavicon, setSelectedFavicon] = useState<MediaItem | null>(
    null
  );
  const router = useRouter();
  const { refreshSession, clearError } = useUserContext();

  const {
    subdomainAvailable,
    checkingSubdomain,
    error: subdomainError,
    debouncedCheck,
  } = useDebouncedSubdomainCheck();

  const { selectImage } = useGallerySelect();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    mode: "onBlur",
  });

  const subdomain = watch("subdomain");

  const handleFaviconSelect = (image: MediaItem) => {
    setSelectedFavicon(image);
    setValue("favicon", image.url);
  };

  const handleOpenGallery = () => {
    selectImage(handleFaviconSelect);
  };

  const handleRemoveFavicon = () => {
    setSelectedFavicon(null);
    setValue("favicon", "");
  };

  const handleThumbnailChange = (image: MediaItem | null) => {
    console.log("OnboardingForm - handleThumbnailChange called with:", image);

    // Use setTimeout to defer state updates and avoid React render issues
    setTimeout(() => {
      setSelectedFavicon(image);
      if (image) {
        console.log("OnboardingForm - setting favicon URL:", image.url);
        setValue("favicon", image.url);
      } else {
        console.log("OnboardingForm - clearing favicon URL");
        setValue("favicon", "");
      }
    }, 0);
  };

  const onSubmit = async (data: OnboardingFormData) => {
    if (subdomainAvailable === false) {
      setError("This subdomain is already taken. Please choose another one.");
      return;
    }

    setError("");
    setLoading(true);
    clearError();

    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok) {
        // Refresh the user session to get updated tenant information
        await refreshSession();
        router.push("/admin");
        router.refresh();
      } else {
        setError(responseData.error || "Failed to create site");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
          {error}
        </div>
      )}

      {/* Subdomain Field */}
      <div className="space-y-2">
        <Label htmlFor="subdomain" className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          Subdomain
        </Label>
        <div className="relative">
          <Input
            id="subdomain"
            type="text"
            placeholder="your-site"
            className="pr-20"
            {...register("subdomain", {
              onChange: (e) => debouncedCheck(e.target.value),
            })}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
            .{rootDomain}
          </div>
        </div>
        {errors.subdomain && (
          <p className="text-red-600 text-sm">{errors.subdomain.message}</p>
        )}
        {subdomainError && (
          <p className="text-red-600 text-sm">{subdomainError}</p>
        )}
        {checkingSubdomain && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            Checking availability...
          </div>
        )}
        {subdomainAvailable === true && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Subdomain is available!
          </div>
        )}
        {subdomainAvailable === false && !subdomainError && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            This subdomain is already taken
          </div>
        )}
      </div>

      {/* Subtitle Field */}
      <div className="space-y-2">
        <Label htmlFor="subtitle" className="flex items-center gap-2">
          <Type className="h-4 w-4" />
          Site Subtitle
        </Label>
        <Input
          id="subtitle"
          type="text"
          placeholder="Your amazing site description"
          {...register("subtitle")}
        />
        {errors.subtitle && (
          <p className="text-red-600 text-sm">{errors.subtitle.message}</p>
        )}
      </div>

      {/* Favicon Field */}
      <div className="space-y-2">
        <Label htmlFor="favicon" className="flex items-center gap-2">
          <Image className="h-4 w-4" />
          Favicon
        </Label>

        {selectedFavicon ? (
          <div className="space-y-3">
            <div className="relative group">
              <img
                src={selectedFavicon.url}
                alt={selectedFavicon.alt || selectedFavicon.name}
                className="w-16 h-16 object-cover rounded-lg border shadow-sm"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-lg">
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleOpenGallery}
                    className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                  >
                    <Image className="h-3 w-3" />
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleRemoveFavicon}
                    className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                  >
                    <svg
                      className="h-3 w-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </Button>
                </div>
              </div>
              <div className="absolute -top-2 -right-2">
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full shadow-sm">
                  {selectedFavicon.width} × {selectedFavicon.height}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Selected: <strong>{selectedFavicon.name}</strong>
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="border-t pt-4">
              <p className="text-sm text-gray-600 mb-3">
                Or select from your gallery:
              </p>
              <GalleryImagePicker
                value={selectedFavicon}
                onChange={handleThumbnailChange}
                placeholder="Click to select a favicon from your gallery"
                className="max-w-md"
              />
            </div>
          </div>
        )}

        {errors.favicon && (
          <p className="text-red-600 text-sm">{errors.favicon.message}</p>
        )}
      </div>

      {/* Preview */}
      {subdomain && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Preview</h3>
          <div className="text-sm text-gray-600">
            <p>Your site will be available at:</p>
            <p className="font-mono text-blue-600 mt-1">
              https://{subdomain}.{rootDomain}
            </p>
          </div>
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={loading || checkingSubdomain || subdomainAvailable === false}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Creating your site...
          </>
        ) : (
          "Create Site & Continue"
        )}
      </Button>
    </form>
  );
}
