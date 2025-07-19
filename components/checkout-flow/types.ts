import { Node, Edge } from 'reactflow';

export interface CheckoutFlowNode extends Node {
  data: {
    label: string;
    config: any;
    type: 'checkout' | 'action' | 'condition' | 'trigger';
  };
}

export interface CheckoutFlowEdge extends Edge {
  data?: {
    label?: string;
    condition?: string;
  };
}

export interface CheckoutFlow {
  id: string;
  name: string;
  description?: string;
  nodes: CheckoutFlowNode[];
  edges: CheckoutFlowEdge[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ActionConfig {
  type: 'redirect' | 'email' | 'sms' | 'webhook' | 'wait' | 'condition';
  [key: string]: any;
}

export interface CheckoutConfig {
  title: string;
  description?: string;
  actions: ActionConfig[];
}

export interface EmailActionConfig extends ActionConfig {
  type: 'email';
  template: string;
  subject: string;
  recipient: string;
  variables: Record<string, string>;
}

export interface RedirectActionConfig extends ActionConfig {
  type: 'redirect';
  url: string;
  delay?: number;
}

export interface WebhookActionConfig extends ActionConfig {
  type: 'webhook';
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers: Record<string, string>;
  body: Record<string, any>;
}

export interface WaitActionConfig extends ActionConfig {
  type: 'wait';
  duration: number;
  unit: 'seconds' | 'minutes' | 'hours' | 'days';
}

export interface ConditionActionConfig extends ActionConfig {
  type: 'condition';
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'not_contains';
  value: string | number;
  trueAction: ActionConfig;
  falseAction?: ActionConfig;
} 