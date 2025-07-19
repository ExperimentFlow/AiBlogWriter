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

export const CheckoutFlowBuilder: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [flowName, setFlowName] = useState("My Checkout Flow");
  const [isSaving, setIsSaving] = useState(false);

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

  return (
    <div className="flex h-[calc(100vh-200px)] bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Sidebar */}
      <CheckoutFlowSidebar onAddNode={addNode} />

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
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
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
        </div>
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
  );
};
