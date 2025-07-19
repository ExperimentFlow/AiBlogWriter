import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { GitBranch, CheckCircle, XCircle } from 'lucide-react';

export const ConditionNode: React.FC<NodeProps> = ({ data, selected }) => {
  const getOperatorSymbol = (operator: string) => {
    switch (operator) {
      case 'equals': return '=';
      case 'not_equals': return '≠';
      case 'greater_than': return '>';
      case 'less_than': return '<';
      case 'contains': return '⊃';
      case 'not_contains': return '⊅';
      default: return '?';
    }
  };

  return (
    <div className={`px-4 py-3 shadow-md rounded-md bg-white border-2 ${selected ? 'border-blue-500' : 'border-gray-200'}`}>
      <div className="flex items-center">
        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
          <GitBranch className="w-4 h-4 text-orange-600" />
        </div>
        <div className="ml-3 flex-1">
          <div className="text-sm font-medium text-gray-900">Condition</div>
          <div className="text-xs text-gray-500">
            {data.config?.field || 'order.total'} {getOperatorSymbol(data.config?.operator)} {data.config?.value || '100'}
          </div>
          <div className="flex items-center mt-1 space-x-2">
            <div className="flex items-center text-xs text-green-600">
              <CheckCircle className="w-3 h-3 mr-1" />
              True
            </div>
            <div className="flex items-center text-xs text-red-600">
              <XCircle className="w-3 h-3 mr-1" />
              False
            </div>
          </div>
        </div>
      </div>
      
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <Handle type="source" position={Position.Bottom} id="true" className="w-3 h-3 bg-green-500" />
      <Handle type="source" position={Position.Right} id="false" className="w-3 h-3 bg-red-500" />
    </div>
  );
}; 