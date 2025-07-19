import React, { useState } from "react";
import { CheckoutCore } from "./CheckoutCore";
import { useElementSelection } from "./contexts/ElementSelectionContext";
import { useCheckoutBuilder } from "./contexts/CheckoutBuilderContext";
import {
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Home,
  Lock,
  Save,
  CheckCircle,
  Download,
} from "lucide-react";

export const LivePreviewLayout: React.FC = () => {
  const { setSelectedElement } = useElementSelection();
  const { config, onConfigChange, handleSaveConfig, handleLoadConfig } =
    useCheckoutBuilder();
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [loadStatus, setLoadStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );

  const handleBackgroundClick = () => {
    setSelectedElement(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus("idle");

    try {
      const result = await handleSaveConfig();

      if (result.success) {
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 3000);
      } else {
        setSaveStatus("error");
        console.error("Save failed:", result.message);
      }
    } catch (error) {
      setSaveStatus("error");
      console.error("Save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoad = async () => {
    setIsLoading(true);
    setLoadStatus("idle");

    try {
      const result = await handleLoadConfig();

      if (result.success) {
        setLoadStatus("success");
        setTimeout(() => setLoadStatus("idle"), 3000);
      } else {
        setLoadStatus("error");
        console.error("Load failed:", result.message);
      }
    } catch (error) {
      setLoadStatus("error");
      console.error("Load error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSaveButtonContent = () => {
    if (isSaving) {
      return (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>Saving...</span>
        </>
      );
    }

    if (saveStatus === "success") {
      return (
        <>
          <CheckCircle className="w-4 h-4" />
          <span>Saved!</span>
        </>
      );
    }

    return (
      <>
        <Save className="w-4 h-4" />
        <span>Save Configuration</span>
      </>
    );
  };

  const getSaveButtonClasses = () => {
    let baseClasses =
      "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors";

    if (isSaving) {
      return `${baseClasses} bg-gray-500 text-white cursor-not-allowed`;
    }

    if (saveStatus === "success") {
      return `${baseClasses} bg-green-500 hover:bg-green-600 text-white`;
    }

    if (saveStatus === "error") {
      return `${baseClasses} bg-red-500 hover:bg-red-600 text-white`;
    }

    return `${baseClasses} bg-blue-500 hover:bg-blue-600 text-white`;
  };

  return (
    <div className="live-preview-container bg-gray-100 min-h-screen">
      {/* Preview Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Live Preview
            </h2>
            <p className="text-sm text-gray-600">
              Click on any element to customize its styling
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleLoad}
              disabled={isLoading}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isLoading
                  ? "bg-gray-500 text-white cursor-not-allowed"
                  : loadStatus === "success"
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : loadStatus === "error"
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-gray-500 hover:bg-gray-600 text-white"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Loading...</span>
                </>
              ) : loadStatus === "success" ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Loaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Load Config</span>
                </>
              )}
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={getSaveButtonClasses()}
            >
              {getSaveButtonContent()}
            </button>
          </div>
        </div>
      </div>
      {/* Mac Browser Window */}
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-2xl overflow-hidden">
        {/* Window Controls */}
        <div className="bg-gray-200 px-4 py-3 flex items-center justify-between border-b border-gray-300">
          <div className="flex items-center space-x-2">
            {/* Red, Yellow, Green buttons */}
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
          {/* Browser Title */}
          <div className="flex-1 text-center">
            <h1 className="text-sm font-medium text-gray-700">
              Checkout Builder Preview
            </h1>
          </div>
          <div className="w-16"></div> {/* Spacer for centering */}
        </div>

        {/* Toolbar */}
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center space-x-2">
          {/* Navigation Buttons */}
          <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors">
            <ArrowRight className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors">
            <Home className="w-4 h-4" />
          </button>

          {/* Address Bar */}
          <div className="flex-1 flex items-center bg-white border border-gray-300 rounded-lg px-3 py-1.5 mx-2">
            <Lock className="w-4 h-4 text-green-600 mr-2" />
            <span className="text-sm text-gray-700 font-mono">
              https://checkout.example.com
            </span>
          </div>

          {/* Reader Mode Button */}
          <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </button>
        </div>

        {/* Browser Content Area */}
        <div
          className="bg-white"
          onClick={handleBackgroundClick}
          style={{ cursor: "default" }}
        >
          {/* Checkout Content */}
          <div>
            <CheckoutCore
              config={config}
              isPreview={true}
              onConfigChange={onConfigChange}
            />
          </div>
        </div>

        {/* Status Bar */}
        <div className="bg-gray-50 px-4 py-2 border-t border-gray-200 flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center space-x-4">
            <span>Ready</span>
            <span>•</span>
            <span>Secure Connection</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>100%</span>
            <span>•</span>
            <span>Checkout Builder v1.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};
