import { Field } from '../types';

export interface FieldTypeDefinition {
  type: string;
  label: string;
  description: string;
  icon: string;
  defaultConfig: Partial<Field>;
}

export const fieldTypes: FieldTypeDefinition[] = [
  {
    type: 'text',
    label: 'Text Input',
    description: 'Single line text input',
    icon: '📝',
    defaultConfig: {
      type: 'text',
      label: 'Text Field',
      placeholder: 'Enter text',
      required: false,
      validation: {
        type: 'required',
        message: 'This field is required'
      }
    }
  },
  {
    type: 'email',
    label: 'Email Input',
    description: 'Email address input with validation',
    icon: '📧',
    defaultConfig: {
      type: 'email',
      label: 'Email Address',
      placeholder: 'Enter your email',
      required: false,
      validation: {
        type: 'email',
        message: 'Please enter a valid email address'
      }
    }
  },
  {
    type: 'tel',
    label: 'Phone Number',
    description: 'Telephone number input',
    icon: '📞',
    defaultConfig: {
      type: 'tel',
      label: 'Phone Number',
      placeholder: 'Enter your phone number',
      required: false,
      validation: {
        type: 'required',
        message: 'Phone number is required'
      }
    }
  },
  {
    type: 'number',
    label: 'Number Input',
    description: 'Numeric input field',
    icon: '🔢',
    defaultConfig: {
      type: 'number',
      label: 'Number',
      placeholder: 'Enter a number',
      required: false,
      validation: {
        type: 'required',
        message: 'This field is required'
      }
    }
  },
  {
    type: 'textarea',
    label: 'Text Area',
    description: 'Multi-line text input',
    icon: '📄',
    defaultConfig: {
      type: 'textarea',
      label: 'Description',
      placeholder: 'Enter description',
      required: false,
      validation: {
        type: 'required',
        message: 'This field is required'
      }
    }
  },
  {
    type: 'select',
    label: 'Dropdown Select',
    description: 'Dropdown selection field',
    icon: '📋',
    defaultConfig: {
      type: 'select',
      label: 'Select Option',
      placeholder: 'Choose an option',
      required: false,
      options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' }
      ],
      validation: {
        type: 'required',
        message: 'Please select an option'
      }
    }
  },
  {
    type: 'radio',
    label: 'Radio Buttons',
    description: 'Single choice radio buttons',
    icon: '🔘',
    defaultConfig: {
      type: 'radio',
      label: 'Choose One',
      required: false,
      options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' }
      ],
      validation: {
        type: 'required',
        message: 'Please select an option'
      }
    }
  },
  {
    type: 'checkbox',
    label: 'Checkbox',
    description: 'Checkbox input field',
    icon: '☑️',
    defaultConfig: {
      type: 'checkbox',
      label: 'I agree to the terms',
      required: false,
      validation: {
        type: 'required',
        message: 'You must agree to continue'
      }
    }
  },
  {
    type: 'date',
    label: 'Date Picker',
    description: 'Date selection field',
    icon: '📅',
    defaultConfig: {
      type: 'date',
      label: 'Select Date',
      required: false,
      validation: {
        type: 'required',
        message: 'Please select a date'
      }
    }
  },
  {
    type: 'url',
    label: 'URL Input',
    description: 'Website URL input',
    icon: '🔗',
    defaultConfig: {
      type: 'url',
      label: 'Website URL',
      placeholder: 'https://example.com',
      required: false,
      validation: {
        type: 'url',
        message: 'Please enter a valid URL'
      }
    }
  }
];

export const getFieldTypeDefinition = (type: string): FieldTypeDefinition | undefined => {
  return fieldTypes.find(fieldType => fieldType.type === type);
};

export const createFieldFromType = (type: string): Field => {
  const fieldType = getFieldTypeDefinition(type);
  if (!fieldType) {
    // Fallback to text field if type not found
    return {
      id: `field-${Date.now()}`,
      type: 'text',
      label: 'New Field',
      placeholder: 'Enter value',
      required: false,
      validation: {
        type: 'required',
        message: 'This field is required'
      }
    };
  }

  return {
    id: `field-${Date.now()}`,
    ...fieldType.defaultConfig
  } as Field;
}; 