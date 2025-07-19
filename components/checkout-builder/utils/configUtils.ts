import { CheckoutConfig, CheckoutConfiguration, Field, Section, Step } from '../types';

/**
 * Utility function to find a field by ID in the configuration
 */
export const findFieldById = (config: CheckoutConfiguration, fieldId: string): Field | null => {
  for (const step of config.steps || []) {
    for (const section of step.sections || []) {
      for (const field of section.fields || []) {
        if (field.id === fieldId) {
          return field;
        }
      }
    }
  }
  return null;
};

/**
 * Utility function to find a section by ID in the configuration
 */
export const findSectionById = (config: CheckoutConfiguration, sectionId: string): { step: Step; section: Section; stepIndex: number; sectionIndex: number } | null => {
  for (let stepIndex = 0; stepIndex < (config.steps || []).length; stepIndex++) {
    const step = config.steps[stepIndex];
    for (let sectionIndex = 0; sectionIndex < (step.sections || []).length; sectionIndex++) {
      const section = step.sections[sectionIndex];
      if (section.id === sectionId) {
        return { step, section, stepIndex, sectionIndex };
      }
    }
  }
  return null;
};

/**
 * Utility function to find a step by ID in the configuration
 */
export const findStepById = (config: CheckoutConfiguration, stepId: string): { step: Step; stepIndex: number } | null => {
  for (let stepIndex = 0; stepIndex < (config.steps || []).length; stepIndex++) {
    const step = config.steps[stepIndex];
    if (step.id === stepId) {
      return { step, stepIndex };
    }
  }
  return null;
};

/**
 * Utility function to update a field by ID in the configuration
 */
export const updateFieldById = (config: CheckoutConfiguration, fieldId: string, updates: Partial<Field>): CheckoutConfiguration => {
  const newConfig = { ...config };

  for (let stepIndex = 0; stepIndex < (newConfig.steps || []).length; stepIndex++) {
    const step = newConfig.steps[stepIndex];
    for (let sectionIndex = 0; sectionIndex < (step.sections || []).length; sectionIndex++) {
      const section = step.sections[sectionIndex];
      for (let fieldIndex = 0; fieldIndex < (section.fields || []).length; fieldIndex++) {
        const field = section.fields[fieldIndex];
        if (field.id === fieldId) {
          newConfig.steps[stepIndex].sections[sectionIndex].fields[fieldIndex] = {
            ...field,
            ...updates,
          };
          return newConfig;
        }
      }
    }
  }

  return newConfig;
};

/**
 * Utility function to update a section by ID in the configuration
 */
export const updateSectionById = (config: CheckoutConfiguration, sectionId: string, updates: Partial<Section>): CheckoutConfiguration => {
  const newConfig = { ...config };

  for (let stepIndex = 0; stepIndex < (newConfig.steps || []).length; stepIndex++) {
    const step = newConfig.steps[stepIndex];
    for (let sectionIndex = 0; sectionIndex < (step.sections || []).length; sectionIndex++) {
      const section = step.sections[sectionIndex];
      if (section.id === sectionId) {
        newConfig.steps[stepIndex].sections[sectionIndex] = {
          ...section,
          ...updates,
        };
        return newConfig;
      }
    }
  }

  return newConfig;
};

/**
 * Utility function to update a step by ID in the configuration
 */
export const updateStepById = (config: CheckoutConfiguration, stepId: string, updates: Partial<Step>): CheckoutConfiguration => {
  const newConfig = { ...config };

  for (let stepIndex = 0; stepIndex < (newConfig.steps || []).length; stepIndex++) {
    const step = newConfig.steps[stepIndex];
    if (step.id === stepId) {
      newConfig.steps[stepIndex] = {
        ...step,
        ...updates,
      };
      return newConfig;
    }
  }

  return newConfig;
};

/**
 * Utility function to update nested object properties based on path
 * Supports array access like "steps[0].sections[1].fields[2]"
 */
export const updateNestedObject = (obj: any, path: string, value: any): any => {
  const keys = path.split(".");
  const newObj = { ...obj };
  let current = newObj;

  // Navigate to the parent of the target property
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (key.includes("[") && key.includes("]")) {
      // Handle array access like "steps[0]"
      const arrayKey = key.split("[")[0];
      const index = parseInt(key.split("[")[1].split("]")[0]);
      if (!current[arrayKey]) current[arrayKey] = [];
      if (!current[arrayKey][index]) current[arrayKey][index] = {};
      current = current[arrayKey][index];
    } else {
      if (!current[key]) current[key] = {};
      current = current[key];
    }
  }

  // Set the target property
  const lastKey = keys[keys.length - 1];
  if (lastKey.includes("[") && lastKey.includes("]")) {
    const arrayKey = lastKey.split("[")[0];
    const index = parseInt(lastKey.split("[")[1].split("]")[0]);
    if (!current[arrayKey]) current[arrayKey] = [];
    current[arrayKey][index] = value;
  } else {
    current[lastKey] = value;
  }

  return newObj;
};

/**
 * Utility function to get nested object value based on path
 * Supports array access like "steps[0].sections[1].fields[2]"
 */
export const getNestedValue = (obj: any, path: string): any => {
  const keys = path.split(".");
  let current = obj;

  for (const key of keys) {
    if (key.includes("[") && key.includes("]")) {
      const arrayKey = key.split("[")[0];
      const index = parseInt(key.split("[")[1].split("]")[0]);
      if (!current[arrayKey] || !current[arrayKey][index]) return undefined;
      current = current[arrayKey][index];
    } else {
      if (!current[key]) return undefined;
      current = current[key];
    }
  }

  return current;
};

/**
 * Utility function to update checkout configuration
 */
export const updateCheckoutConfig = (config: CheckoutConfiguration, updates: Partial<CheckoutConfiguration['checkoutConfig']>): CheckoutConfiguration => {
  return {
    ...config,
    checkoutConfig: {
      ...config.checkoutConfig,
      ...updates,
    },
  };
};

/**
 * Utility function to update theme configuration
 */
export const updateTheme = (config: CheckoutConfiguration, updates: Partial<CheckoutConfiguration['checkoutConfig']['theme']>): CheckoutConfiguration => {
  return {
    ...config,
    checkoutConfig: {
      ...config.checkoutConfig,
      theme: {
        ...config.checkoutConfig.theme,
        ...updates,
      },
    },
  };
};

/**
 * Utility function to update layout configuration
 */
export const updateLayout = (config: CheckoutConfiguration, updates: Partial<CheckoutConfiguration['checkoutConfig']['layout']>): CheckoutConfiguration => {
  return {
    ...config,
    checkoutConfig: {
      ...config.checkoutConfig,
      layout: {
        ...config.checkoutConfig.layout,
        ...updates,
      },
    },
  };
};

/**
 * Utility function to update progress bar configuration
 */
export const updateProgressBar = (config: CheckoutConfiguration, updates: Partial<CheckoutConfiguration['checkoutConfig']['progressBar']>): CheckoutConfiguration => {
  return {
    ...config,
    checkoutConfig: {
      ...config.checkoutConfig,
      progressBar: {
        ...config.checkoutConfig.progressBar,
        ...updates,
      },
    },
  };
};

/**
 * Utility function to update animation configuration
 */
export const updateAnimation = (config: CheckoutConfiguration, updates: Partial<CheckoutConfiguration['checkoutConfig']['animation']>): CheckoutConfiguration => {
  return {
    ...config,
    checkoutConfig: {
      ...config.checkoutConfig,
      animation: {
        ...config.checkoutConfig.animation,
        ...updates,
      },
    },
  };
};

/**
 * Utility function to add a new step to the configuration
 */
export const addStep = (config: CheckoutConfiguration, step: Step): CheckoutConfiguration => {
  return {
    ...config,
    steps: [...(config.steps || []), step],
  };
};

/**
 * Utility function to remove a step by ID from the configuration
 */
export const removeStep = (config: CheckoutConfiguration, stepId: string): CheckoutConfiguration => {
  return {
    ...config,
    steps: (config.steps || []).filter(step => step.id !== stepId),
  };
};

/**
 * Utility function to add a new section to a step
 */
export const addSection = (config: CheckoutConfiguration, stepId: string, section: Section): CheckoutConfiguration => {
  const newConfig = { ...config };
  
  for (let stepIndex = 0; stepIndex < (newConfig.steps || []).length; stepIndex++) {
    const step = newConfig.steps[stepIndex];
    if (step.id === stepId) {
      newConfig.steps[stepIndex] = {
        ...step,
        sections: [...(step.sections || []), section],
      };
      return newConfig;
    }
  }

  return newConfig;
};

/**
 * Utility function to remove a section by ID from a step
 */
export const removeSection = (config: CheckoutConfiguration, stepId: string, sectionId: string): CheckoutConfiguration => {
  const newConfig = { ...config };
  
  for (let stepIndex = 0; stepIndex < (newConfig.steps || []).length; stepIndex++) {
    const step = newConfig.steps[stepIndex];
    if (step.id === stepId) {
      newConfig.steps[stepIndex] = {
        ...step,
        sections: (step.sections || []).filter(section => section.id !== sectionId),
      };
      return newConfig;
    }
  }

  return newConfig;
};

/**
 * Utility function to add a new field to a section
 */
export const addField = (config: CheckoutConfiguration, stepId: string, sectionId: string, field: Field): CheckoutConfiguration => {
  const newConfig = { ...config };
  
  for (let stepIndex = 0; stepIndex < (newConfig.steps || []).length; stepIndex++) {
    const step = newConfig.steps[stepIndex];
    if (step.id === stepId) {
      for (let sectionIndex = 0; sectionIndex < (step.sections || []).length; sectionIndex++) {
        const section = step.sections[sectionIndex];
        if (section.id === sectionId) {
          newConfig.steps[stepIndex].sections[sectionIndex] = {
            ...section,
            fields: [...(section.fields || []), field],
          };
          return newConfig;
        }
      }
    }
  }

  return newConfig;
};

/**
 * Utility function to remove a field by ID from a section
 */
export const removeField = (config: CheckoutConfiguration, stepId: string, sectionId: string, fieldId: string): CheckoutConfiguration => {
  const newConfig = { ...config };
  
  for (let stepIndex = 0; stepIndex < (newConfig.steps || []).length; stepIndex++) {
    const step = newConfig.steps[stepIndex];
    if (step.id === stepId) {
      for (let sectionIndex = 0; sectionIndex < (step.sections || []).length; sectionIndex++) {
        const section = step.sections[sectionIndex];
        if (section.id === sectionId) {
          newConfig.steps[stepIndex].sections[sectionIndex] = {
            ...section,
            fields: (section.fields || []).filter(field => field.id !== fieldId),
          };
          return newConfig;
        }
      }
    }
  }

  return newConfig;
};

/**
 * Utility function to reorder steps
 */
export const reorderSteps = (config: CheckoutConfiguration, stepIds: string[]): CheckoutConfiguration => {
  const stepsMap = new Map((config.steps || []).map(step => [step.id, step]));
  const reorderedSteps = stepIds.map(id => stepsMap.get(id)).filter(Boolean) as Step[];
  
  return {
    ...config,
    steps: reorderedSteps,
  };
};

/**
 * Utility function to duplicate a step
 */
export const duplicateStep = (config: CheckoutConfiguration, stepId: string, newStepId: string): CheckoutConfiguration => {
  const stepToDuplicate = findStepById(config, stepId);
  if (!stepToDuplicate) return config;

  const duplicatedStep: Step = {
    ...stepToDuplicate.step,
    id: newStepId,
    title: `${stepToDuplicate.step.title} (Copy)`,
    sections: stepToDuplicate.step.sections.map(section => ({
      ...section,
      id: `${section.id}_copy`,
      fields: section.fields?.map(field => ({
        ...field,
        id: `${field.id}_copy`,
      })) || [],
    })),
  };

  return addStep(config, duplicatedStep);
};

/**
 * Utility function to reset configuration to default values
 */
export const resetToDefault = (defaultConfig: CheckoutConfiguration): CheckoutConfiguration => {
  return JSON.parse(JSON.stringify(defaultConfig));
};

/**
 * Utility function to merge configurations (useful for partial updates)
 */
export const mergeConfig = (baseConfig: CheckoutConfiguration, updates: Partial<CheckoutConfiguration>): CheckoutConfiguration => {
  return {
    ...baseConfig,
    ...updates,
    checkoutConfig: {
      ...baseConfig.checkoutConfig,
      ...(updates.checkoutConfig || {}),
      theme: {
        ...baseConfig.checkoutConfig.theme,
        ...(updates.checkoutConfig?.theme || {}),
      },
      layout: {
        ...baseConfig.checkoutConfig.layout,
        ...(updates.checkoutConfig?.layout || {}),
      },
      progressBar: {
        ...baseConfig.checkoutConfig.progressBar,
        ...(updates.checkoutConfig?.progressBar || {}),
      },
      animation: {
        ...baseConfig.checkoutConfig.animation,
        ...(updates.checkoutConfig?.animation || {}),
      },
    },
  };
};

/**
 * Utility function to get primary and secondary colors from the configuration
 */
export const getPrimaryColorAndSecondaryColor = (config: CheckoutConfig) => {
  const layout = config.layout;
  
  const isEnableOneColumn = layout.type === "one_column";

  if (isEnableOneColumn) {
    return {
      primaryColor: layout.oneColumn?.primaryColor,
      secondaryColor: layout.oneColumn?.secondaryColor,
    };
  }
  const isProductInfo =
    layout.twoColumn?.rightColumn?.content === "product_info";

  if (isProductInfo) {
    return {
      primaryColor: layout.twoColumn?.rightColumn?.primaryColor,
      secondaryColor: layout.twoColumn?.rightColumn?.secondaryColor,
    };
  }

  return {
    primaryColor: layout.twoColumn?.leftColumn?.primaryColor,
    secondaryColor: layout.twoColumn?.leftColumn?.secondaryColor,
  };
};