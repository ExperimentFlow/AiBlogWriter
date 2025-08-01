"use client";

import React, { useState, useCallback, useMemo } from "react";
import ReactFlow, {
  Node,
  Edge,
  NodeTypes,
  EdgeTypes,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  NodeChange,
  EdgeChange,
} from "reactflow";
import "reactflow/dist/style.css";

import { CheckoutFlowToolbar } from "./CheckoutFlowToolbar";
import { CheckoutFlowSidebar } from "./CheckoutFlowSidebar";
import { CheckoutFlowPanel } from "./CheckoutFlowPanel";
import { CheckoutFlowNode, CheckoutFlowEdge } from "./types";

// Import node components
import { CheckoutPageNode } from "./nodes/CheckoutPageNode";
import { EmailNode } from "./nodes/EmailNode";
import { RedirectNode } from "./nodes/RedirectNode";
import { WebhookNode } from "./nodes/WebhookNode";
import { WaitNode } from "./nodes/WaitNode";
import { ConditionNode } from "./nodes/ConditionNode";
import { SMSNode } from "./nodes/SMSNode";
import { Plus, Mail, MessageSquare, ExternalLink, Globe, Clock, GitBranch } from 'lucide-react';

const nodeTypes: NodeTypes = {
  checkoutPage: CheckoutPageNode,
  email: EmailNode,
  redirect: RedirectNode,
  webhook: WebhookNode,
  wait: WaitNode,
  condition: ConditionNode,
  sms: SMSNode,
};

const initialNodes: Node[] = [
  {
    id: "checkout-page",
    type: "checkoutPage",
    position: { x: 250, y: 100 },
    data: {
      label: "Checkout Page",
      type: "checkout",
      config: {
        title: "Complete Your Purchase",
        description: "Secure checkout process",
        actions: [],
      },
    },
  },
];

const initialEdges: Edge[] = [];

const nodeTypeOptions = [
  { type: 'email', label: 'Send Email', icon: Mail },
  { type: 'sms', label: 'Send SMS', icon: MessageSquare },
  { type: 'redirect', label: 'Redirect', icon: ExternalLink },
  { type: 'webhook', label: 'Webhook', icon: Globe },
  { type: 'wait', label: 'Wait', icon: Clock },
  { type: 'condition', label: 'Condition', icon: GitBranch },
];

// Custom Edge with Plus Icon
const PlusEdge = ({ id, sourceX, sourceY, targetX, targetY, markerEnd, data }: {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  markerEnd?: string;
  data?: { onPlusClick?: () => void };
}) => {
  const midX = (sourceX + targetX) / 2;
  const midY = (sourceY + targetY) / 2;
  return (
    <g>
      <path
        d={`M${sourceX},${sourceY} L${targetX},${targetY}`}
        stroke="#888"
        strokeWidth={2}
        fill="none"
        markerEnd={markerEnd}
      />
      <foreignObject
        x={midX - 16}
        y={midY - 16}
        width={32}
        height={32}
        style={{ overflow: 'visible' }}
      >
        <button
          onClick={data?.onPlusClick}
          style={{
            background: '#fff',
            border: '1px solid #ddd',
            borderRadius: '50%',
            width: 32,
            height: 32,
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'box-shadow 0.2s',
          }}
        >
          <Plus size={18} color="#2563eb" />
        </button>
      </foreignObject>
    </g>
  );
};

const edgeTypes = {
  plus: PlusEdge,
};

export const CheckoutFlowBuilder: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [flowName, setFlowName] = useState("My Checkout Flow");
  const [isSaving, setIsSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalSourceNode, setModalSourceNode] = useState<string | null>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const addNode = useCallback(
    (nodeType: string, position: { x: number; y: number }, config?: any) => {
      const newNode: Node = {
        id: `${nodeType}-${Date.now()}`,
        type: nodeType,
        position,
        data: {
          label: getNodeLabel(nodeType),
          type: "action",
          config: config || getDefaultConfig(nodeType),
        },
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes]
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = document
        .querySelector(".react-flow")
        ?.getBoundingClientRect();
      const data = event.dataTransfer.getData("application/reactflow");

      if (typeof data === "undefined" || !data) {
        return;
      }

      let nodeType: string;
      let config: any = {};

      try {
        const parsedData = JSON.parse(data);
        nodeType = parsedData.type;
        config = parsedData.config || {};
      } catch {
        nodeType = data;
      }

      if (reactFlowBounds) {
        const position = {
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        };

        addNode(nodeType, position, config);
      }
    },
    [addNode]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const updateNodeConfig = useCallback(
    (nodeId: string, config: any) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, config } }
            : node
        )
      );
    },
    [setNodes]
  );

  const deleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
      );
      if (selectedNode?.id === nodeId) {
        setSelectedNode(null);
      }
    },
    [setNodes, setEdges, selectedNode]
  );

  const saveFlow = useCallback(async () => {
    setIsSaving(true);
    try {
      const flowData = {
        name: flowName,
        nodes,
        edges,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // TODO: Save to API
      console.log("Saving flow:", flowData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Flow saved successfully!");
    } catch (error) {
      console.error("Error saving flow:", error);
    } finally {
      setIsSaving(false);
    }
  }, [flowName, nodes, edges]);

  const getNodeLabel = (nodeType: string): string => {
    const labels: Record<string, string> = {
      checkoutPage: "Checkout Page",
      email: "Send Email",
      redirect: "Redirect",
      webhook: "Webhook",
      wait: "Wait",
      condition: "Condition",
      sms: "Send SMS",
    };
    return labels[nodeType] || "Unknown Node";
  };

  const getDefaultConfig = (nodeType: string): any => {
    const configs: Record<string, any> = {
      email: {
        template: "default",
        subject: "Thank you for your order!",
        recipient: "{{customer.email}}",
        variables: {},
      },
      redirect: {
        url: "https://example.com/thank-you",
        delay: 0,
      },
      webhook: {
        url: "",
        method: "POST",
        headers: {},
        body: {},
      },
      wait: {
        duration: 24,
        unit: "hours",
      },
      condition: {
        field: "order.total",
        operator: "greater_than",
        value: 100,
      },
      sms: {
        message:
          "Thank you for your order! Your order #{{order.id}} has been confirmed.",
        recipient: "{{customer.phone}}",
      },
    };
    return configs[nodeType] || {};
  };

  // Show initial edge with plus icon if only one node and no edges
  const customEdges = useMemo(() => {
    if (nodes.length === 1 && edges.length === 0) {
      const node = nodes[0];
      return [
        {
          id: 'plus-edge',
          source: node.id,
          target: node.id + '-plus', // virtual target
          type: 'plus',
          data: {
            onPlusClick: () => {
              setModalOpen(true);
              setModalSourceNode(node.id);
            },
          },
        },
      ];
    }
    return edges;
  }, [nodes, edges]);

  // Quick connect handler for all nodes
  const handleQuickConnect = (sourceNodeId: string) => {
    setModalOpen(true);
    setModalSourceNode(sourceNodeId);
  };

  // Handle node type selection from modal
  const handleSelectNodeType = (type: string) => {
    if (!type || !modalSourceNode) {
      setModalOpen(false);
      setModalSourceNode(null);
      return;
    }
    // Find the source node for position
    const sourceNode = nodes.find((n) => n.id === modalSourceNode);
    if (!sourceNode) {
      setModalOpen(false);
      setModalSourceNode(null);
      return;
    }
    // Position new node directly below the source node
    const position = { x: sourceNode.position.x, y: sourceNode.position.y + 150 };
    const config = getDefaultConfig(type);
    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type,
      position,
      data: {
        label: getNodeLabel(type),
        type: 'action',
        config: config || {},
        onQuickConnect: () => handleQuickConnect(`${type}-${Date.now()}`),
      },
    };
    setNodes((nds) => [
      ...nds,
      {
        ...newNode,
        data: {
          ...newNode.data,
          onQuickConnect: () => handleQuickConnect(newNode.id),
        },
      },
    ]);
    setEdges((eds) => [
      ...eds,
      { id: `e-${modalSourceNode}-${newNode.id}`, source: modalSourceNode, target: newNode.id, animated: true },
    ]);
    setModalOpen(false);
    setModalSourceNode(null);
  };

  // Patch all nodes to inject onQuickConnect
  const patchedNodes = nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      onQuickConnect: () => handleQuickConnect(node.id),
    },
  }));

  return (
    <div className="flex h-[calc(100vh-200px)] bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Main Flow Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <CheckoutFlowToolbar
          flowName={flowName}
          onFlowNameChange={setFlowName}
          onSave={saveFlow}
          isSaving={isSaving}
        />
        {/* Flow Canvas */}
        <div className="flex-1 relative flex">
          <ReactFlow
            nodes={patchedNodes}
            edges={customEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
            zoomOnScroll={false}
            zoomOnPinch={false}
            zoomOnDoubleClick={false}
            attributionPosition="bottom-left"
          >
            <Controls />
            <Background />
            <MiniMap />
          </ReactFlow>
          {/* Modal for node type selection */}
          {modalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40 backdrop-blur-sm">
              <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mx-auto border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Select Action to Add</h3>
                <div className="space-y-3">
                  {nodeTypeOptions.map((opt) => (
                    <button
                      key={opt.type}
                      className="w-full flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-blue-50 transition group"
                      onClick={() => handleSelectNodeType(opt.type)}
                    >
                      <span className="rounded-full w-9 h-9 flex items-center justify-center mr-3 bg-blue-100 group-hover:scale-110 transition-transform">
                        <opt.icon className="w-5 h-5 text-blue-600" />
                      </span>
                      <span className="flex-1 text-left">
                        <span className="block text-base font-medium text-gray-900">{opt.label}</span>
                      </span>
                    </button>
                  ))}
                </div>
                <button
                  className="mt-6 w-full py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
        {/* Configuration Panel */}
        {selectedNode && (
          <CheckoutFlowPanel
            node={selectedNode}
            onUpdateConfig={updateNodeConfig}
            onDeleteNode={deleteNode}
            onClose={() => setSelectedNode(null)}
          />
        )}
      </div>
    </div>
  );
};
