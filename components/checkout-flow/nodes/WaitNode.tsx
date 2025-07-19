import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Clock, Pause } from 'lucide-react';

export const WaitNode: React.FC<NodeProps> = ({ data, selected }) => {
  const formatDuration = (duration: number, unit: string) => {
    if (duration === 1) {
      return `1 ${unit.slice(0, -1)}`;
    }
    return `${duration} ${unit}`;
  };

  return (
    <div className={`px-4 py-3 shadow-md rounded-md bg-white border-2 ${selected ? 'border-blue-500' : 'border-gray-200'}`}>
      <div className="flex items-center">
        <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
          <Clock className="w-4 h-4 text-yellow-600" />
        </div>
        <div className="ml-3 flex-1">
          <div className="text-sm font-medium text-gray-900">Wait</div>
          <div className="text-xs text-gray-500">
            {formatDuration(data.config?.duration || 24, data.config?.unit || 'hours')}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Then continue flow
          </div>
        </div>
        <div className="flex items-center text-xs text-yellow-600">
          <Pause className="w-3 h-3 mr-1" />
          Delay
        </div>
      </div>
      
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
}; 