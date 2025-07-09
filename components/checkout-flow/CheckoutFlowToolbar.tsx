import React from 'react';
import { Save, Play, Pause, Download, Upload } from 'lucide-react';

interface CheckoutFlowToolbarProps {
  flowName: string;
  onFlowNameChange: (name: string) => void;
  onSave: () => void;
  isSaving: boolean;
}

export const CheckoutFlowToolbar: React.FC<CheckoutFlowToolbarProps> = ({
  flowName,
  onFlowNameChange,
  onSave,
  isSaving,
}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <input
              type="text"
              value={flowName}
              onChange={(e) => onFlowNameChange(e.target.value)}
              className="text-xl font-semibold text-gray-900 bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
              placeholder="Enter flow name..."
            />
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              Active
            </span>
            <span className="text-sm text-gray-500">•</span>
            <span className="text-sm text-gray-500">Last saved 2 minutes ago</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          
          <button className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </button>
          
          <button className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">
            <Play className="w-4 h-4 mr-2" />
            Test Flow
          </button>
          
          <button
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Flow'}
          </button>
        </div>
      </div>
    </div>
  );
}; 