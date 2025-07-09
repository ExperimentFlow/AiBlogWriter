import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Globe, Zap } from 'lucide-react';

export const WebhookNode: React.FC<NodeProps> = ({ data, selected }) => {
  const getMethodColor = (method: string) => {
    switch (method?.toUpperCase()) {
      case 'GET': return 'bg-green-100 text-green-600';
      case 'POST': return 'bg-blue-100 text-blue-600';
      case 'PUT': return 'bg-yellow-100 text-yellow-600';
      case 'DELETE': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className={`px-4 py-3 shadow-md rounded-md bg-white border-2 ${selected ? 'border-blue-500' : 'border-gray-200'}`}>
      <div className="flex items-center">
        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
          <Globe className="w-4 h-4 text-purple-600" />
        </div>
        <div className="ml-3 flex-1">
          <div className="text-sm font-medium text-gray-900">Webhook</div>
          <div className="text-xs text-gray-500 truncate">
            {data.config?.url || 'https://api.example.com'}
          </div>
          <div className="flex items-center mt-1">
            <span className={`px-2 py-1 rounded text-xs font-medium ${getMethodColor(data.config?.method)}`}>
              {data.config?.method || 'POST'}
            </span>
          </div>
        </div>
        <div className="flex items-center text-xs text-purple-600">
          <Zap className="w-3 h-3 mr-1" />
          API
        </div>
      </div>
      
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
}; 