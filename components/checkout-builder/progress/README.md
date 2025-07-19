# Progress Bar System

This directory contains different types of progress indicators for the checkout flow. The progress bar type is configurable through the `progressBar.type` property in the checkout configuration.

## Available Progress Bar Types

### 1. **progress_bar** - Traditional Progress Bar
- Simple horizontal progress bar with percentage fill
- Shows step names below the bar (optional)
- Clean and minimal design

### 2. **step_indicators** - Step Indicators (Default)
- Numbered circles with checkmarks for completed steps
- Shows step names and descriptions (optional)
- Most common and user-friendly

### 3. **breadcrumb** - Breadcrumb Navigation
- Horizontal breadcrumb-style navigation
- Shows step numbers and names
- Good for shorter checkout flows

### 4. **dots** - Dots Progress
- Simple dots with current step highlighted
- Compact design
- Good for mobile or space-constrained layouts

### 5. **numbers** - Numbers Only
- Clean numbered circles
- Shows "Step X of Y" information
- Minimal and focused

### 6. **timeline** - Timeline Progress
- Vertical timeline with connected dots
- Shows detailed step information
- Good for longer, more complex flows

## Configuration

To change the progress bar type, update the configuration in `app/checkout/config/defaultConfig.ts`:

```typescript
progressBar: {
  type: "step_indicators", // Change this to any of the types above
  position: "top",
  showStepNames: true,
  showStepNumbers: true,
  showStepDescriptions: false,
  styling: {
    backgroundColor: "#404040",
    completedColor: "#007bff",
    activeColor: "#007bff",
    inactiveColor: "#a0a0a0",
    textColor: "#ffffff",
    height: "8px",
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: "500",
    gap: "16px",
    padding: "16px",
    borderColor: "#404040",
    borderWidth: "2px",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowBlur: "4px",
    iconSize: "32px",
  },
}
```

## Configuration Options

### Display Options
- `showStepNames`: Show/hide step titles
- `showStepNumbers`: Show/hide step numbers
- `showStepDescriptions`: Show/hide step descriptions

### Styling Options
- `backgroundColor`: Background color for inactive elements
- `completedColor`: Color for completed steps
- `activeColor`: Color for current step
- `inactiveColor`: Color for future steps
- `textColor`: Color for text elements
- `height`: Height of progress bar (for progress_bar type)
- `borderRadius`: Border radius for elements
- `fontSize`: Font size for text
- `fontWeight`: Font weight for text
- `gap`: Spacing between elements
- `padding`: Padding around the progress component
- `borderColor`: Border color for elements
- `borderWidth`: Border width for elements
- `shadowColor`: Shadow color
- `shadowBlur`: Shadow blur radius
- `iconSize`: Size of icons/circles

## Usage Examples

### Traditional Progress Bar
```typescript
progressBar: {
  type: "progress_bar",
  showStepNames: true,
  styling: {
    height: "12px",
    completedColor: "#28a745",
    // ... other styling
  }
}
```

### Timeline Progress
```typescript
progressBar: {
  type: "timeline",
  showStepNames: true,
  showStepDescriptions: true,
  styling: {
    iconSize: "24px",
    completedColor: "#007bff",
    // ... other styling
  }
}
```

### Minimal Dots
```typescript
progressBar: {
  type: "dots",
  showStepNames: false,
  showStepDescriptions: true,
  styling: {
    gap: "8px",
    completedColor: "#007bff",
    // ... other styling
  }
}
```

## Dark Theme Support

All progress bar types automatically adapt to the dark theme when `colorScheme` is set to "dark" in the main theme configuration. The colors will be adjusted for better contrast and visibility in dark mode.

## Responsive Design

All progress bar types are responsive and will adapt to different screen sizes. The layout and spacing will adjust automatically for mobile devices. 