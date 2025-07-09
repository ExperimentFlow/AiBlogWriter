import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Mail, Send } from 'lucide-react';

export const EmailNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <div className={`px-4 py-3 shadow-md rounded-md bg-white border-2 ${selected ? 'border-blue-500' : 'border-gray-200'}`}>
      <div className="flex items-center">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <Mail className="w-4 h-4 text-blue-600" />
        </div>
        <div className="ml-3 flex-1">
          <div className="text-sm font-medium text-gray-900">Send Email</div>
          <div className="text-xs text-gray-500">
            {data.config?.subject || 'Email subject...'}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            To: {data.config?.recipient || '{{customer.email}}'}
          </div>
        </div>
        <div className="flex items-center text-xs text-blue-600">
          <Send className="w-3 h-3 mr-1" />
          Auto
        </div>
      </div>
      
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
}; 