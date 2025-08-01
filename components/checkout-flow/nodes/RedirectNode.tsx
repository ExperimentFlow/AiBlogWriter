import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { ExternalLink, ArrowRight, Plus } from 'lucide-react';

export const RedirectNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <div className={`px-4 py-3 shadow-md rounded-md bg-white border-2 ${selected ? 'border-blue-500' : 'border-gray-200'}`}>
      <div className="flex items-center">
        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
          <ExternalLink className="w-4 h-4 text-green-600" />
        </div>
        <div className="ml-3 flex-1">
          <div className="text-sm font-medium text-gray-900">Redirect</div>
          <div className="text-xs text-gray-500 truncate">
            {data.config?.url || 'https://example.com'}
          </div>
          {data.config?.delay && data.config.delay > 0 && (
            <div className="text-xs text-gray-400 mt-1">
              Delay: {data.config.delay}s
            </div>
          )}
        </div>
        <div className="flex items-center text-xs text-green-600">
          <ArrowRight className="w-3 h-3 mr-1" />
          Go
        </div>
      </div>
      
      <Handle type="target" position={Position.Top} className="w-4 h-4 bg-blue-500 hover:bg-blue-600 transition-colors" />
      <Handle type="source" position={Position.Bottom} className="w-4 h-4 bg-green-500 hover:bg-green-600 transition-colors" />
      
      {/* Quick Connect Button */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
        <button
          className="w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
          title="Add next action"
          onClick={(e) => {
            e.stopPropagation();
            // This will be handled by the parent component
            if (data.onQuickConnect) {
              data.onQuickConnect();
            }
          }}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}; 