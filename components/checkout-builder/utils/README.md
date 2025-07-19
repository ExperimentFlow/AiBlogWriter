# Configuration Utilities

This directory contains reusable utility functions for managing checkout configuration updates.

## Overview

The `configUtils.ts` file provides a comprehensive set of utility functions for updating checkout configurations in a type-safe and consistent manner. These functions replace the scattered utility functions that were previously duplicated across different components.

## Available Functions

### Finding Elements

- `findFieldById(config, fieldId)` - Find a field by its ID
- `findSectionById(config, sectionId)` - Find a section by its ID with step context
- `findStepById(config, stepId)` - Find a step by its ID

### Updating Elements

- `updateFieldById(config, fieldId, updates)` - Update a field by its ID
- `updateSectionById(config, sectionId, updates)` - Update a section by its ID
- `updateStepById(config, stepId, updates)` - Update a step by its ID

### Nested Object Operations

- `updateNestedObject(obj, path, value)` - Update nested object properties using dot notation
- `getNestedValue(obj, path)` - Get nested object values using dot notation

### Configuration Updates

- `updateCheckoutConfig(config, updates)` - Update checkout configuration
- `updateTheme(config, updates)` - Update theme configuration
- `updateLayout(config, updates)` - Update layout configuration
- `updateProgressBar(config, updates)` - Update progress bar configuration
- `updateAnimation(config, updates)` - Update animation configuration

### Adding/Removing Elements

- `addStep(config, step)` - Add a new step
- `removeStep(config, stepId)` - Remove a step by ID
- `addSection(config, stepId, section)` - Add a section to a step
- `removeSection(config, stepId, sectionId)` - Remove a section from a step
- `addField(config, stepId, sectionId, field)` - Add a field to a section
- `removeField(config, stepId, sectionId, fieldId)` - Remove a field from a section

### Utility Functions

- `reorderSteps(config, stepIds)` - Reorder steps
- `duplicateStep(config, stepId, newStepId)` - Duplicate a step
- `resetToDefault(defaultConfig)` - Reset to default configuration
- `mergeConfig(baseConfig, updates)` - Merge configurations

## Usage Examples

### Basic Field Update

```typescript
import { updateFieldById } from './utils/configUtils';

// Update a field's styling
const updatedConfig = updateFieldById(config, 'firstName', {
  styling: {
    backgroundColor: '#f0f0f0',
    color: '#333333'
  }
});

onConfigChange(updatedConfig);
```

### Theme Update

```typescript
import { updateTheme } from './utils/configUtils';

// Update theme colors
const updatedConfig = updateTheme(config, {
  primaryColor: '#007bff',
  backgroundColor: '#ffffff'
});

onConfigChange(updatedConfig);
```

### Nested Object Update

```typescript
import { updateNestedObject } from './utils/configUtils';

// Update a specific section's title
const updatedConfig = updateNestedObject(config, 'steps[0].sections[1].title', 'New Section Title');

onConfigChange(updatedConfig);
```

### Adding New Elements

```typescript
import { addStep, addSection, addField } from './utils/configUtils';

// Add a new step
const newStep = {
  id: 'shipping',
  title: 'Shipping Information',
  description: 'Enter your shipping details',
  sections: []
};

let updatedConfig = addStep(config, newStep);

// Add a section to the new step
const newSection = {
  id: 'shipping-address',
  title: 'Shipping Address',
  fields: []
};

updatedConfig = addSection(updatedConfig, 'shipping', newSection);

// Add a field to the section
const newField = {
  id: 'address',
  type: 'text',
  label: 'Street Address',
  placeholder: 'Enter your address',
  required: true
};

updatedConfig = addField(updatedConfig, 'shipping', 'shipping-address', newField);

onConfigChange(updatedConfig);
```

## Migration Guide

### Before (Old Way)

```typescript
// Inline utility functions
const updateFieldById = (config: any, fieldId: string, updates: any): any => {
  // ... implementation
};

// Direct config manipulation
const updatedConfig = {
  ...config,
  checkoutConfig: {
    ...config.checkoutConfig,
    theme: {
      ...config.checkoutConfig.theme,
      primaryColor: '#007bff'
    }
  }
};
```

### After (New Way)

```typescript
// Import utility functions
import { updateFieldById, updateTheme } from './utils/configUtils';

// Use utility functions
const updatedConfig = updateTheme(config, {
  primaryColor: '#007bff'
});
```

## Benefits

1. **Type Safety** - All functions are properly typed with TypeScript
2. **Consistency** - Standardized approach across all components
3. **Reusability** - Functions can be used in any component
4. **Maintainability** - Centralized logic, easier to update and debug
5. **Performance** - Optimized implementations
6. **Documentation** - Clear function signatures and examples

## Best Practices

1. Always import the utility functions you need
2. Use the appropriate function for the type of update you're making
3. Leverage TypeScript's type checking for better development experience
4. Use the utility functions instead of manually manipulating the config object
5. Consider using `mergeConfig` for complex partial updates 