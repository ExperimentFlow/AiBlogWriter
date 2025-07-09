import React, { useState } from 'react';
import { Node } from 'reactflow';
import { X, Trash2, Save } from 'lucide-react';

interface CheckoutFlowPanelProps {
  node: Node;
  onUpdateConfig: (nodeId: string, config: any) => void;
  onDeleteNode: (nodeId: string) => void;
  onClose: () => void;
}

export const CheckoutFlowPanel: React.FC<CheckoutFlowPanelProps> = ({
  node,
  onUpdateConfig,
  onDeleteNode,
  onClose,
}) => {
  const [config, setConfig] = useState(node.data.config || {});

  const handleSave = () => {
    onUpdateConfig(node.id, config);
  };

  const handleDelete = () => {
    onDeleteNode(node.id);
    onClose();
  };

  const renderEmailConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email Template</label>
        <select
          value={config.template || 'default'}
          onChange={(e) => setConfig({ ...config, template: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="default">Default Template</option>
          <option value="order-confirmation">Order Confirmation</option>
          <option value="shipping-update">Shipping Update</option>
          <option value="delivery-confirmation">Delivery Confirmation</option>
          <option value="abandoned-cart">Abandoned Cart</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
        <input
          type="text"
          value={config.subject || ''}
          onChange={(e) => setConfig({ ...config, subject: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Email subject..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Recipient</label>
        <input
          type="text"
          value={config.recipient || ''}
          onChange={(e) => setConfig({ ...config, recipient: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="{{customer.email}}"
        />
      </div>
    </div>
  );

  const renderSMSConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
        <textarea
          value={config.message || ''}
          onChange={(e) => setConfig({ ...config, message: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="SMS message content..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Recipient</label>
        <input
          type="text"
          value={config.recipient || ''}
          onChange={(e) => setConfig({ ...config, recipient: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="{{customer.phone}}"
        />
      </div>
    </div>
  );

  const renderRedirectConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Redirect URL</label>
        <input
          type="url"
          value={config.url || ''}
          onChange={(e) => setConfig({ ...config, url: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://example.com/thank-you"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Delay (seconds)</label>
        <input
          type="number"
          value={config.delay || 0}
          onChange={(e) => setConfig({ ...config, delay: parseInt(e.target.value) })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          min="0"
        />
      </div>
    </div>
  );

  const renderWebhookConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
        <input
          type="url"
          value={config.url || ''}
          onChange={(e) => setConfig({ ...config, url: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://api.example.com/webhook"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
        <select
          value={config.method || 'POST'}
          onChange={(e) => setConfig({ ...config, method: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
      </div>
    </div>
  );

  const renderWaitConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
        <div className="flex space-x-2">
          <input
            type="number"
            value={config.duration || 24}
            onChange={(e) => setConfig({ ...config, duration: parseInt(e.target.value) })}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
          />
          <select
            value={config.unit || 'hours'}
            onChange={(e) => setConfig({ ...config, unit: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="seconds">Seconds</option>
            <option value="minutes">Minutes</option>
            <option value="hours">Hours</option>
            <option value="days">Days</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderConditionConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Field</label>
        <select
          value={config.field || 'order.total'}
          onChange={(e) => setConfig({ ...config, field: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="order.total">Order Total</option>
          <option value="order.items_count">Number of Items</option>
          <option value="customer.is_new">New Customer</option>
          <option value="customer.country">Customer Country</option>
          <option value="order.payment_method">Payment Method</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Operator</label>
        <select
          value={config.operator || 'greater_than'}
          onChange={(e) => setConfig({ ...config, operator: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="equals">Equals</option>
          <option value="not_equals">Not Equals</option>
          <option value="greater_than">Greater Than</option>
          <option value="less_than">Less Than</option>
          <option value="contains">Contains</option>
          <option value="not_contains">Not Contains</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
        <input
          type="text"
          value={config.value || ''}
          onChange={(e) => setConfig({ ...config, value: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="100"
        />
      </div>
    </div>
  );

  const renderCheckoutPageConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
        <input
          type="text"
          value={config.title || ''}
          onChange={(e) => setConfig({ ...config, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Complete Your Purchase"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={config.description || ''}
          onChange={(e) => setConfig({ ...config, description: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Secure checkout process..."
        />
      </div>
    </div>
  );

  const renderConfig = () => {
    switch (node.type) {
      case 'checkoutPage':
        return renderCheckoutPageConfig();
      case 'email':
        return renderEmailConfig();
      case 'sms':
        return renderSMSConfig();
      case 'redirect':
        return renderRedirectConfig();
      case 'webhook':
        return renderWebhookConfig();
      case 'wait':
        return renderWaitConfig();
      case 'condition':
        return renderConditionConfig();
      default:
        return <div className="text-gray-500">No configuration available for this node type.</div>;
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Configure Node</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-2">{node.data.label}</h4>
        <p className="text-xs text-gray-500">Node ID: {node.id}</p>
      </div>
      
      <div className="space-y-6">
        {renderConfig()}
      </div>
      
      <div className="flex space-x-2 mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={handleSave}
          className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Save className="w-4 h-4 mr-2" />
          Save
        </button>
        <button
          onClick={handleDelete}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}; 