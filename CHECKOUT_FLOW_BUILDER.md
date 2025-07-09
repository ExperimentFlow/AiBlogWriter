# Checkout Flow Builder

A visual drag-and-drop checkout flow builder that allows you to design automated workflows for post-checkout actions using React Flow.

## 🎯 Features

### Visual Checkout Page
- **Realistic Checkout Preview**: Shows a visual representation of the checkout page with product details, payment form, and security indicators
- **Interactive Design**: Click to configure checkout page settings like title and description
- **Multiple Triggers**: Supports both successful purchases and abandoned checkout scenarios

### Action Nodes
1. **Email Node** - Send automated emails
   - Multiple email templates (order confirmation, shipping updates, etc.)
   - Customizable subject and recipient
   - Variable support for personalization

2. **SMS Node** - Send SMS notifications
   - Custom message content
   - Phone number variable support
   - Perfect for order confirmations and updates

3. **Redirect Node** - Redirect customers
   - Custom URL configuration
   - Optional delay before redirect
   - Perfect for thank you pages or upsells

4. **Webhook Node** - Make HTTP requests
   - Support for GET, POST, PUT, DELETE methods
   - Custom headers and body
   - Integrate with external services

5. **Wait Node** - Add delays
   - Configurable duration (seconds, minutes, hours, days)
   - Perfect for follow-up sequences
   - Time-based automation

6. **Condition Node** - Conditional logic
   - Multiple operators (equals, greater than, contains, etc.)
   - Field-based conditions (order total, customer type, etc.)
   - True/False branching paths

### Flow Management
- **Drag & Drop Interface**: Intuitive visual flow building
- **Real-time Configuration**: Click any node to configure its settings
- **Flow Saving**: Save and load checkout flows
- **Export/Import**: Share flows between environments
- **Active/Inactive States**: Enable or disable flows

## 🚀 Getting Started

### Installation
The checkout flow builder uses React Flow for the visual interface:

```bash
pnpm add reactflow
```

### Access
Navigate to `/admin/checkout-flow` in your admin panel to access the flow builder.

## 📋 Usage

### Creating a Flow

1. **Start with Checkout Page**: The flow always begins with a visual checkout page node
2. **Add Actions**: Drag action nodes from the sidebar onto the canvas
3. **Connect Nodes**: Draw connections between nodes to define the flow
4. **Configure Actions**: Click any node to configure its specific settings
5. **Save Flow**: Use the save button to store your flow

### Example Workflows

#### Basic Order Confirmation
```
Checkout Page → Send Email (Order Confirmation) → Redirect (Thank You Page)
```

#### Abandoned Cart Recovery
```
Checkout Page → Wait (24 hours) → Send Email (Abandoned Cart) → Wait (48 hours) → Send SMS (Final Reminder)
```

#### Premium Customer Flow
```
Checkout Page → Condition (Order Total > $100) → Send Email (Premium Customer) → Webhook (CRM Update)
```

#### Multi-channel Follow-up
```
Checkout Page → Send Email (Confirmation) → Wait (1 hour) → Send SMS (Tracking) → Webhook (Analytics)
```

## 🔧 Configuration

### Available Variables

#### Customer Data
- `{{customer.email}}` - Customer email address
- `{{customer.name}}` - Customer full name
- `{{customer.phone}}` - Customer phone number

#### Order Data
- `{{order.id}}` - Unique order identifier
- `{{order.total}}` - Order total amount
- `{{order.items}}` - Order items list

### Node Configuration

#### Email Node
- **Template**: Choose from predefined email templates
- **Subject**: Custom email subject line
- **Recipient**: Email recipient (supports variables)

#### SMS Node
- **Message**: SMS message content (supports variables)
- **Recipient**: Phone number (supports variables)

#### Redirect Node
- **URL**: Destination URL
- **Delay**: Optional delay in seconds before redirect

#### Webhook Node
- **URL**: Webhook endpoint
- **Method**: HTTP method (GET, POST, PUT, DELETE)
- **Headers**: Custom HTTP headers
- **Body**: Request body data

#### Wait Node
- **Duration**: Time to wait
- **Unit**: Time unit (seconds, minutes, hours, days)

#### Condition Node
- **Field**: Data field to check
- **Operator**: Comparison operator
- **Value**: Value to compare against

## 🛠️ Technical Details

### Architecture
- **Frontend**: React with TypeScript
- **Flow Engine**: React Flow
- **State Management**: React hooks with useCallback
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

### File Structure
```
components/checkout-flow/
├── CheckoutFlowBuilder.tsx    # Main flow builder component
├── CheckoutFlowToolbar.tsx    # Top toolbar with save/export
├── CheckoutFlowSidebar.tsx    # Left sidebar with draggable nodes
├── CheckoutFlowPanel.tsx      # Right configuration panel
├── types.ts                   # TypeScript interfaces
└── nodes/                     # Individual node components
    ├── CheckoutPageNode.tsx   # Visual checkout page
    ├── EmailNode.tsx          # Email action node
    ├── SMSNode.tsx            # SMS action node
    ├── RedirectNode.tsx       # Redirect action node
    ├── WebhookNode.tsx        # Webhook action node
    ├── WaitNode.tsx           # Wait action node
    └── ConditionNode.tsx      # Conditional logic node
```

### API Endpoints
- `GET /api/checkout-flows` - Fetch all flows
- `POST /api/checkout-flows` - Create new flow
- `PUT /api/checkout-flows` - Update existing flow
- `DELETE /api/checkout-flows?id=<id>` - Delete flow

## 🔮 Future Enhancements

### Planned Features
- **Flow Templates**: Pre-built flow templates for common scenarios
- **A/B Testing**: Test different flows and measure performance
- **Analytics Integration**: Track flow performance and conversion rates
- **Advanced Conditions**: More complex conditional logic
- **Scheduled Actions**: Time-based flow execution
- **Multi-language Support**: Internationalization for flows
- **Flow Versioning**: Version control for flows
- **Collaboration**: Team collaboration on flow design

### Advanced Actions
- **Database Operations**: Direct database updates
- **File Operations**: Generate and send files
- **Social Media Integration**: Post to social platforms
- **Chat Integration**: Send messages to chat platforms
- **Calendar Integration**: Schedule follow-up meetings

## 🎨 Customization

### Adding New Node Types
1. Create a new node component in `components/checkout-flow/nodes/`
2. Add the node type to the `nodeTypes` object in `CheckoutFlowBuilder.tsx`
3. Add configuration options in `CheckoutFlowPanel.tsx`
4. Update the sidebar with the new node type

### Styling
The flow builder uses Tailwind CSS for styling. You can customize:
- Node appearance by modifying the component styles
- Color schemes by updating the color classes
- Layout by adjusting the flex and grid classes

## 🐛 Troubleshooting

### Common Issues
1. **Drag and Drop Not Working**: Ensure React Flow is properly installed
2. **Nodes Not Connecting**: Check that handles are properly positioned
3. **Configuration Not Saving**: Verify the API endpoint is accessible
4. **Flow Not Loading**: Check browser console for errors

### Debug Mode
Enable debug mode by adding `?debug=true` to the URL to see additional logging information.

## 📄 License

This checkout flow builder is part of the platform and follows the same licensing terms. 