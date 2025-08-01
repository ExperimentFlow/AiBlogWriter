"use client";


import { CheckoutFlowBuilder } from '@/components/checkout-flow/CheckoutFlowBuilder';
import React from 'react';

export default function CheckoutFlowPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Checkout Flow Builder</h1>
        <p className="text-gray-600 mb-4">
          Design what happens after a customer completes their checkout. Create automated workflows, 
          email sequences, and follow-up actions with a visual flow builder.
        </p>
        <CheckoutFlowBuilder />
      </div>
    </div>
  );
} 