import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

// In-memory storage for demo purposes
// In production, this would be stored in a database
let flows: any[] = [
  {
    id: '1',
    name: 'Default Checkout Flow',
    description: 'Basic checkout flow with email confirmation',
    nodes: [
      {
        id: 'checkout-page',
        type: 'checkoutPage',
        position: { x: 250, y: 100 },
        data: { 
          label: 'Checkout Page',
          type: 'checkout',
          config: {
            title: 'Complete Your Purchase',
            description: 'Secure checkout process',
            actions: [],
          }
        },
      },
      {
        id: 'email-confirmation',
        type: 'email',
        position: { x: 450, y: 100 },
        data: { 
          label: 'Send Confirmation Email',
          type: 'action',
          config: {
            template: 'order-confirmation',
            subject: 'Thank you for your order!',
            recipient: '{{customer.email}}',
            variables: {},
          }
        },
      }
    ],
    edges: [
      {
        id: 'e1',
        source: 'checkout-page',
        target: 'email-confirmation',
        type: 'smoothstep',
      }
    ],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ flows });
  } catch (error) {
    console.error('Error fetching flows:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, nodes, edges } = body;

    if (!name) {
      return NextResponse.json({ error: 'Flow name is required' }, { status: 400 });
    }

    const newFlow = {
      id: Date.now().toString(),
      name,
      description: description || '',
      nodes: nodes || [],
      edges: edges || [],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    flows.push(newFlow);

    return NextResponse.json({ flow: newFlow }, { status: 201 });
  } catch (error) {
    console.error('Error creating flow:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, description, nodes, edges, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: 'Flow ID is required' }, { status: 400 });
    }

    const flowIndex = flows.findIndex(flow => flow.id === id);
    if (flowIndex === -1) {
      return NextResponse.json({ error: 'Flow not found' }, { status: 404 });
    }

    flows[flowIndex] = {
      ...flows[flowIndex],
      name: name || flows[flowIndex].name,
      description: description || flows[flowIndex].description,
      nodes: nodes || flows[flowIndex].nodes,
      edges: edges || flows[flowIndex].edges,
      isActive: isActive !== undefined ? isActive : flows[flowIndex].isActive,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ flow: flows[flowIndex] });
  } catch (error) {
    console.error('Error updating flow:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Flow ID is required' }, { status: 400 });
    }

    const flowIndex = flows.findIndex(flow => flow.id === id);
    if (flowIndex === -1) {
      return NextResponse.json({ error: 'Flow not found' }, { status: 404 });
    }

    flows.splice(flowIndex, 1);

    return NextResponse.json({ message: 'Flow deleted successfully' });
  } catch (error) {
    console.error('Error deleting flow:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 