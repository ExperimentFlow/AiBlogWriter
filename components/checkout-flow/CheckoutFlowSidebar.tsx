import React from 'react';
import { Mail, MessageSquare, Globe, Clock, GitBranch, ExternalLink, ShoppingCart } from 'lucide-react';

interface CheckoutFlowSidebarProps {
  onAddNode: (nodeType: string, position: { x: number; y: number }, config?: any) => void;
}

const nodeTypes = [
  {
    type: 'email',
    label: 'Send Email',
    icon: Mail,
    description: 'Send automated emails to customers',
    color: 'bg-blue-100 text-blue-600',
    config: {
      template: 'default',
      subject: 'Thank you for your order!',
      recipient: '{{customer.email}}',
      variables: {},
    },
  },
  {
    type: 'sms',
    label: 'Send SMS',
    icon: MessageSquare,
    description: 'Send SMS notifications',
    color: 'bg-green-100 text-green-600',
    config: {
      message: 'Thank you for your order! Your order #{{order.id}} has been confirmed.',
      recipient: '{{customer.phone}}',
    },
  },
  {
    type: 'redirect',
    label: 'Redirect',
    icon: ExternalLink,
    description: 'Redirect customer to another page',
    color: 'bg-purple-100 text-purple-600',
    config: {
      url: 'https://example.com/thank-you',
      delay: 0,
    },
  },
  {
    type: 'webhook',
    label: 'Webhook',
    icon: Globe,
    description: 'Make HTTP requests to external services',
    color: 'bg-orange-100 text-orange-600',
    config: {
      url: '',
      method: 'POST',
      headers: {},
      body: {},
    },
  },
  {
    type: 'wait',
    label: 'Wait',
    icon: Clock,
    description: 'Add delays between actions',
    color: 'bg-yellow-100 text-yellow-600',
    config: {
      duration: 24,
      unit: 'hours',
    },
  },
  {
    type: 'condition',
    label: 'Condition',
    icon: GitBranch,
    description: 'Add conditional logic to your flow',
    color: 'bg-red-100 text-red-600',
    config: {
      field: 'order.total',
      operator: 'greater_than',
      value: 100,
    },
  },
];

export const CheckoutFlowSidebar: React.FC<CheckoutFlowSidebarProps> = ({ onAddNode }) => {
  const handleDragStart = (event: React.DragEvent, nodeType: string, config?: any) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ type: nodeType, config }));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Flow Actions</h3>
        <p className="text-sm text-gray-600">
          Drag and drop actions to build your checkout flow
        </p>
      </div>
      
      <div className="space-y-3">
        {nodeTypes.map((nodeType) => {
          const Icon = nodeType.icon;
          return (
            <div
              key={nodeType.type}
              draggable
              onDragStart={(event) => handleDragStart(event, nodeType.type, nodeType.config)}
              className="p-3 bg-white rounded-lg border border-gray-200 cursor-move hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <div className={`rounded-full w-8 h-8 flex items-center justify-center ${nodeType.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">{nodeType.label}</div>
                  <div className="text-xs text-gray-500">{nodeType.description}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Available Variables</h4>
        <div className="space-y-2 text-xs text-gray-600">
          <div className="bg-blue-50 p-2 rounded">
            <div className="font-medium text-blue-800">Customer Data</div>
            <div>• {'{{customer.email}}'} - Customer email</div>
            <div>• {'{{customer.name}}'} - Customer name</div>
            <div>• {'{{customer.phone}}'} - Customer phone</div>
          </div>
          <div className="bg-green-50 p-2 rounded">
            <div className="font-medium text-green-800">Order Data</div>
            <div>• {'{{order.id}}'} - Order ID</div>
            <div>• {'{{order.total}}'} - Order total</div>
            <div>• {'{{order.items}}'} - Order items</div>
          </div>
        </div>
      </div>
    </div>
  );
}; 