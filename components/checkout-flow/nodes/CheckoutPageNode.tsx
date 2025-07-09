import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { ShoppingCart, CreditCard, Lock } from 'lucide-react';

export const CheckoutPageNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <div className={`px-6 py-4 shadow-lg rounded-lg bg-white border-2 ${selected ? 'border-blue-500' : 'border-gray-200'}`}>
      {/* Checkout Page Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-semibold text-gray-900">Checkout Page</h3>
            <p className="text-xs text-gray-500">Customer completes purchase here</p>
          </div>
        </div>
        <div className="flex items-center text-xs text-green-600">
          <Lock className="w-3 h-3 mr-1" />
          Secure
        </div>
      </div>

      {/* Visual Checkout Form */}
      <div className="bg-gray-50 rounded-lg p-3 mb-3">
        <div className="space-y-2">
          {/* Product Summary */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Product Name</span>
            <span className="font-medium">$99.99</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Shipping</span>
            <span className="font-medium">$5.99</span>
          </div>
          <div className="border-t border-gray-200 pt-1 flex items-center justify-between text-xs font-semibold">
            <span>Total</span>
            <span>$105.98</span>
          </div>
        </div>
      </div>

      {/* Payment Form Preview */}
      <div className="space-y-2">
        <div className="h-6 bg-gray-200 rounded text-xs flex items-center px-2 text-gray-500">
          Email: customer@example.com
        </div>
        <div className="h-6 bg-gray-200 rounded text-xs flex items-center px-2 text-gray-500">
          Card: **** **** **** 1234
        </div>
        <div className="flex space-x-2">
          <div className="h-6 bg-gray-200 rounded text-xs flex items-center px-2 text-gray-500 flex-1">
            MM/YY
          </div>
          <div className="h-6 bg-gray-200 rounded text-xs flex items-center px-2 text-gray-500 flex-1">
            CVC
          </div>
        </div>
      </div>

      {/* Action Points */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Triggers:</span>
          <div className="flex space-x-1">
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded">Success</span>
            <span className="px-2 py-1 bg-red-100 text-red-700 rounded">Abandon</span>
          </div>
        </div>
      </div>

      {/* Connection Handles */}
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-green-500" />
      {/* <Handle type="target" position={Position.Top} className="w-3 h-3 bg-blue-500" /> */}
    </div>
  );
}; 